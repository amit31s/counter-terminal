import { SCREENS } from "@ct/constants";
import { DeviceAttributes, RawDeviceAttributes, RawUserIdentities } from "@ct/interfaces";
import { logManager } from "@pol/frontend-logger-web";
import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";

const errorLogger = logManager(LOGGER_TYPE.errorLogger);

export const getInitialLoggedInScreen = async () => {
  return SCREENS.HOME;
};

export const parseUserIdentities = (identities: RawUserIdentities[]) => {
  try {
    return {
      id: identities[0]?.userId ?? "",
      provider: identities[0]?.providerName ?? "",
      createdAt: identities[0]?.dateCreated ?? 0,
    };
  } catch (error) {
    errorLogger.error({
      methodName: APP_LOGS_FN.parseUserIdentities,
      error: error as Error,
      message: APP_LOGS_MSG.failedToParseUser,
    });
    return {
      id: "",
      provider: "",
      createdAt: 0,
    };
  }
};

export const parseCognitoAttributes = (user: RawDeviceAttributes) => {
  return {
    nodeID: user["custom:node_id"],
    deviceID: user["custom:id"],
    deviceType: user["custom:type"],
    branchID: user["custom:branch_id"],
    branchName: user["custom:branch_name"],
    branchAddress: user["custom:branch_address"],
    branchPostcode: user["custom:branch_postcode"],
    branchUnitCode: user["custom:branch_unit_code"],
    branchUnitCodeVer: user["custom:branch_unit_code_ver"],
  };
};

export const fromCognitoUser = async (user: CognitoUser): Promise<DeviceAttributes> => {
  const cognitoAttributes = await new Promise<CognitoUserAttribute[]>((resolve, reject) => {
    user.getUserAttributes((error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("No user"));

      resolve(result);
    });
  });

  const getCognitoAttributeValueByName = (attributeName: string): string => {
    const cognitoAttribute = cognitoAttributes.find((val) => val.Name === attributeName);
    if (cognitoAttribute === undefined) return "";
    return cognitoAttribute.Value;
  };

  return {
    nodeID: getCognitoAttributeValueByName("custom:node_id"),
    deviceID: getCognitoAttributeValueByName("custom:id"),
    deviceType: getCognitoAttributeValueByName("custom:type"),
    branchID: getCognitoAttributeValueByName("custom:branch_id"),
    branchName: getCognitoAttributeValueByName("custom:branch_name"),
    branchAddress: getCognitoAttributeValueByName("custom:branch_address"),
    branchPostcode: getCognitoAttributeValueByName("custom:branch_postcode"),
    branchUnitCode: getCognitoAttributeValueByName("custom:branch_unit_code"),
    branchUnitCodeVer: getCognitoAttributeValueByName("custom:branch_unit_code_ver"),
  };
};
