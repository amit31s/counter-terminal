import { useGetUser } from "@ct/common";
import { APP_LOGS_FN, APP_LOGS_MSG, APP_LOGS_VARS } from "@ct/common/constants/AppLogger";
import { decodeJWTToken } from "@ct/utils/jwt";
import { getUserIdToken } from "@ct/utils/Services/auth";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";

type UserToken = {
  [key: string]: string;
};

export const useCheckBranchPermission = () => {
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);
  const { device } = useGetUser();
  const userToken = getUserIdToken();
  if (!userToken || userToken === APP_LOGS_MSG.userTokenNotFound) {
    appLogger.info({
      methodName: APP_LOGS_FN.useCheckBranchPermission,
      message: APP_LOGS_MSG.userTokenNotFound,
    });
    return false;
  }
  if (!device.branchID) {
    appLogger.info({
      methodName: APP_LOGS_FN.useCheckBranchPermission,
      message: APP_LOGS_MSG.fadCodeNotFound,
    });
    return false;
  }

  try {
    const decodedUserIdToken = decodeJWTToken(userToken) as UserToken;
    const sysRole = decodedUserIdToken["custom:SysRole"];
    if (!sysRole) {
      appLogger.info({
        methodName: APP_LOGS_FN.useCheckBranchPermission,
        data: decodedUserIdToken,
        message: APP_LOGS_MSG.customSysRoleNotFound,
      });
      return false;
    }
    const decodedSysRole = decodeURIComponent(sysRole.replace(/\+/g, ""));
    const jsonObjectOfRoles = JSON.parse(decodedSysRole);
    const fadCodes = jsonObjectOfRoles.map((role: UserToken) => role?.fadCode);

    const isValid = fadCodes.includes(device.branchID);
    if (!isValid) {
      // Branch permission check failed with ${fadcode}
      appLogger.info({
        methodName: APP_LOGS_FN.useCheckBranchPermission,
        data: jsonObjectOfRoles,
        message: APP_LOGS_VARS.branchPermissionFailedFadCode(device.branchID),
      });
      return false;
    }
    // Branch permission check passed successfully with ${fadcode}`
    appLogger.info({
      methodName: APP_LOGS_FN.useCheckBranchPermission,
      data: jsonObjectOfRoles,
      message: APP_LOGS_VARS.branchPermissionPassedFadCode(device.branchID),
    });
    return true;
  } catch (err) {
    appLogger.error({
      methodName: APP_LOGS_FN.useCheckBranchPermission,
      error: err as Error,
    });
    return false;
  }
};
