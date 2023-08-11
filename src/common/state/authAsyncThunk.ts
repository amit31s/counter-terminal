import { Auth } from "@aws-amplify/auth";
import { APP_CONSTANTS } from "@ct/constants";
import { IAuthTokens } from "@ct/interfaces/device.interface";
import { getItem, setItem } from "@ct/utils/Storage";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { APP_LOGS_FN, APP_LOGS_MSG } from "../constants/AppLogger";
const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);

const refreshedTokens = (
  cognitoUser: CognitoUser,
  currentSession: CognitoUserSession,
): Promise<IAuthTokens> => {
  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(
      currentSession.getRefreshToken(),
      (error: Error, session: CognitoUserSession) => {
        if (error) {
          applicationLogger.error({
            methodName: APP_LOGS_FN.refreshedTokens,
            error: error as Error,
            message: APP_LOGS_MSG.refreshTokenFailed,
          });
          reject(error);
          return;
        }
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
          accessToken: session.getAccessToken().getJwtToken(),
        });
      },
    );
  });
};

export const refreshUserTokensAsyncThunk = createAsyncThunk(
  "auth/refreshUserTokensAsyncThunk",
  async () => {
    const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    const tokens = await refreshedTokens(cognitoUser, currentSession);
    const userName = getItem(APP_CONSTANTS.CONST0005);
    userName && setItem(APP_CONSTANTS.CONST0006(userName), tokens.idToken);
    return tokens;
  },
);

export const refreshDeviceTokensAsyncThunk = createAsyncThunk(
  "auth/refreshDeviceTokensAsyncThunk",
  async () => {
    const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    const tokens = await refreshedTokens(cognitoUser, currentSession);
    const userName = getItem(APP_CONSTANTS.CONST0009);
    userName && setItem(APP_CONSTANTS.CONST0010(userName), tokens.idToken);
    return tokens;
  },
);
