import { FORGEROCK_COGNITO_WEB_CLIENT_ID, Screen, useAppDispatch } from "@ct/common";
import { SCREENS } from "@ct/constants";
import { getUserName } from "@ct/utils/Services/auth";
import { Text } from "native-base";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { APP_LOGS_FN, APP_LOGS_VARS } from "@ct/common/constants/AppLogger";

export const SignOutRedirect = () => {
  const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    applicationLogger.info({
      methodName: APP_LOGS_FN.signOutRedirect,
      message: APP_LOGS_VARS.userLoggedOutFrom(getUserName()),
    });

    Object.keys(localStorage)
      .filter((key) =>
        key.startsWith(`CognitoIdentityServiceProvider.${FORGEROCK_COGNITO_WEB_CLIENT_ID}`),
      )
      .forEach((key) => {
        localStorage.removeItem(key);
      });
    navigate(SCREENS.USER_LOGIN);
  }, [dispatch, navigate]);

  return (
    <Screen>
      <Text>Signing off...</Text>
    </Screen>
  );
};
