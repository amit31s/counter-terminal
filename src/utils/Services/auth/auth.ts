import { Auth } from "@aws-amplify/auth";
import { APP_CONSTANTS } from "@ct/constants";
import { DeviceAttributes } from "@ct/interfaces/device.interface";
import { getItem, removeItem } from "@ct/utils/Storage";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import jwtDecode from "jwt-decode";
import { fromCognitoUser } from "./helper";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";

export type Tokens = {
  idToken: string | undefined;
  refreshToken: string | undefined;
  accessToken: string | undefined;
};

export const defaultTokenValue: Tokens = {
  accessToken: undefined,
  refreshToken: undefined,
  idToken: undefined,
};
const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);

const currentUserAuthAttributes = async (): Promise<Tokens> => {
  const user = await Auth.currentAuthenticatedUser();
  const sess = user.getSignInUserSession();

  return {
    accessToken: sess?.getAccessToken().getJwtToken() || undefined,
    refreshToken: sess?.getRefreshToken().getToken() || undefined,
    idToken: sess?.getIdToken().getJwtToken() || undefined,
  };
};

const currentUserAttributes = async (): Promise<DeviceAttributes> => {
  const user = await Auth.currentAuthenticatedUser();
  return fromCognitoUser(user);
};

type TokenPayload = {
  exp: number;
};

const isTokenExpired = (token: string): boolean => {
  const decoded = jwtDecode(token) as TokenPayload;
  let exp = decoded?.exp;
  if (!exp) {
    return true;
  }
  exp = exp * 1000 - 5000;
  const currentDateTime = new Date().getTime();

  if (exp <= currentDateTime) {
    return true;
  }
  return false;
};

const getUpdatedTokens = async (): Promise<Tokens> => {
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    return new Promise((resolve) => {
      cognitoUser.refreshSession(
        currentSession.getRefreshToken(),
        (err: Error, session: CognitoUserSession) => {
          if (err) {
            throw err;
          }
          resolve({
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
            accessToken: session.getAccessToken().getJwtToken(),
          });
        },
      );
    });
  } catch (error) {
    applicationLogger.fatal({
      methodName: APP_LOGS_FN.getNewToken,
      error: error as Error,
    });
    return defaultTokenValue;
  }
};

const getIdToken = async (): Promise<string> => {
  try {
    const currentSession = await Auth.currentSession();
    const idToken = currentSession.getIdToken().getJwtToken();
    const expired = isTokenExpired(idToken);
    if (!expired) {
      return idToken;
    }
    const tokens = await getUpdatedTokens();
    if (!tokens.idToken) {
      throw "idToken not found";
    }
    return tokens.idToken;
  } catch (error) {
    applicationLogger.fatal({
      methodName: APP_LOGS_FN.getIdToken,
      error: error as Error,
    });
    return "";
  }
};

// get device token from storage
export const getUserIdToken = (): string => {
  const userName = getItem(APP_CONSTANTS.CONST0005);
  if (!userName) {
    applicationLogger.info({
      methodName: APP_LOGS_FN.getUserIdToken,
      message: APP_LOGS_MSG.userTokenNotFound,
    });
    return APP_LOGS_MSG.userTokenNotFound;
  }
  const userToken = getItem(APP_CONSTANTS.CONST0006(userName));
  if (!userToken) {
    applicationLogger.info({
      methodName: APP_LOGS_FN.getUserIdToken,
      message: APP_LOGS_MSG.deviceTokenNotFound,
    });
    return APP_LOGS_MSG.deviceTokenNotFound;
  }
  return userToken;
};

export const cleanUserIdToken = () => {
  const userName = getItem(APP_CONSTANTS.CONST0005);
  if (userName) {
    removeItem(userName);
  }
};

// get user token from storage
export const getDeviceToken = (): string => {
  const deviceName = getItem(APP_CONSTANTS.CONST0009);
  if (!deviceName) {
    applicationLogger.info({
      methodName: APP_LOGS_FN.getDeviceToken,
      message: APP_LOGS_FN.deviceTokenNotFound,
    });
    return APP_LOGS_FN.deviceTokenNotFound;
  }
  const deviceToken = getItem(APP_CONSTANTS.CONST0010(deviceName));
  if (!deviceToken) {
    applicationLogger.info({
      methodName: APP_LOGS_FN.getDeviceToken,
      message: APP_LOGS_FN.deviceTokenNotFound,
    });
    return APP_LOGS_FN.deviceTokenNotFound;
  }
  return deviceToken;
};

export const getUserName = (): string => {
  const userName = getItem(APP_CONSTANTS.CONST0005);
  if (userName) {
    return userName.replace("forgerock_", "");
  }
  return "";
};

export default Object.freeze({
  currentUserAuthAttributes,
  currentUserAttributes,
  getIdToken,
});
