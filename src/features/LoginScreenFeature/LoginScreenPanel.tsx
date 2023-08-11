import { useAppDispatch, useAppSelector, useFeatureFlag } from "@ct/common";
import { clearError, registerDevice } from "@ct/common/state/auth.slice";
import { CustomModal } from "@ct/components";
import { SCREENS, TEXT, featureFlags, stringConstants } from "@ct/constants";
import { LoginForm } from "@ct/features/LoginScreenFeature/LoginForm";
import { LoginScreenBackGroundImage } from "@ct/features/LoginScreenFeature/LoginScreenBackGroundImage";
import { LoginScreenPostOfficeLogo } from "@ct/features/LoginScreenFeature/LoginScreenPostOfficeLogo";
import { loginPageBroadcast } from "@ct/utils/BroadcastChannels/helper";
import { Box, View } from "native-base";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { ERROR_LOGS_FN, ERROR_LOGS_MSG } from "@ct/common/constants/ErrorLogs";

export const LoginScreenPanel = () => {
  const errorLogger = logManager(LOGGER_TYPE.errorLogger);
  const [shouldUseFederatedSignIn] = useFeatureFlag(featureFlags.shouldUseFederatedSignIn);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { device, loading, deviceError, isDeviceRegistered } = useAppSelector(
    (rootState) => rootState.auth,
  );
  const navigate = useNavigate();

  useEffect(() => {
    loginPageBroadcast();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await dispatch(registerDevice({ email, password, shouldUseFederatedSignIn }));
  };

  useEffect(() => {
    if (
      deviceError?.code === "NotAuthorizedException" ||
      deviceError?.code === "InvalidParameterException"
    ) {
      setIsErrorModalVisible(true);
      return;
    }
    if (deviceError) {
      errorLogger.error({
        methodName: ERROR_LOGS_FN.handleLogin,
        message: ERROR_LOGS_MSG.errorLogForSignIn,
        error: deviceError as Error,
      });
      setSomethingWentWrong(true);
      return;
    }

    if (loading || !device) {
      return;
    }
    if (isDeviceRegistered) {
      navigate(SCREENS.HOME);
    }
  }, [deviceError, loading, device, navigate, isDeviceRegistered]);

  const dismissErrorModal = () => {
    setIsErrorModalVisible(false);
    dispatch(clearError());
  };

  return (
    <View flex={1} position="relative" testID={stringConstants.LoginScreenTestIds.LoginScreenPanel}>
      <LoginScreenBackGroundImage />
      <Box flexDirection="row" flex={1} alignItems="center">
        <LoginScreenPostOfficeLogo />
        <LoginForm handleLogin={handleLogin} />
      </Box>

      <CustomModal
        isOpen={isErrorModalVisible}
        onClose={() => {
          dismissErrorModal();
        }}
        title={stringConstants.LoginScreen.loginModal}
        primaryButtonProps={{
          label: stringConstants.LoginScreen.Button.Login_TryAgain,
          onPress: () => {
            dismissErrorModal();
          },
        }}
      />
      <CustomModal
        isOpen={somethingWentWrong}
        title={TEXT.CTTXT00025}
        primaryButtonProps={{
          label: stringConstants.LoginScreen.Button.Login_TryAgain,
          onPress: () => {
            setSomethingWentWrong(false);
          },
        }}
      />
    </View>
  );
};
