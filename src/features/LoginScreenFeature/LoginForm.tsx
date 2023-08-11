import { envProvider } from "@ct/common/platformHelper";
import { StyledButton, StyledInput } from "@ct/components";
import { colorConstants, featureFlags, stringConstants } from "@ct/constants";
import { Box, Text } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  base: {
    width: 393,
    height: 100,
    marginTop: 70,
  },
  text: {
    fontSize: 36,
  },
});

interface ILoginProps {
  handleLogin: (userId: string, password: string) => void | Promise<void>;
}

export const LoginForm = ({ handleLogin }: ILoginProps) => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [shouldUseSerialNumber, setShouldUseSerialNumber] = useState(
    envProvider.REACT_APP_USING_ELECTRON === "true" && featureFlags.shouldUseSerialNumber,
  );

  const currentEnvironment =
    envProvider.REACT_APP_ENV !== "prod" ? `(${envProvider.REACT_APP_ENV})` : null;

  useEffect(() => {
    if (!shouldUseSerialNumber) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await window.electronAPI?.getSerialNumber?.();

        if (cancelled) return;
        if (typeof res !== "string") {
          throw "Serial number could not be determined.";
        }

        setUserId(res);
      } catch (e) {
        setShouldUseSerialNumber(false);
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shouldUseSerialNumber]);

  const loginCallBack = useCallback(async () => {
    setLoading(true);
    await handleLogin(userId, password);
    setLoading(false);
  }, [handleLogin, password, userId]);

  return (
    <Box alignSelf="stretch" width="626px">
      <Box bgColor={colorConstants.black}>
        <Text
          color={colorConstants.textboxBackgroundColour}
          fontFamily="body"
          fontWeight="bold"
          fontSize="30px"
          lineHeight="40px"
          m="30px"
        >
          {stringConstants.LoginScreen.PleaseLogin} {currentEnvironment}
        </Text>
      </Box>
      <Box
        bgColor={colorConstants.loginColors.formBackground}
        pt="42px"
        flex={1}
        alignItems="center"
      >
        <StyledInput
          label={stringConstants.LoginScreen.DeviceID}
          isDisabled={loading || shouldUseSerialNumber}
          inputProps={{
            testID: stringConstants.LoginScreenTestIds.UserIdInput,
            fontSize: "21px",
            lineHeight: "30px",
            _input: {
              px: "19px",
              py: "29px",
              _focus: {
                px: "18px",
                py: "28px",
              },
            },
            onChangeText: (text: string) => {
              setUserId(text);
            },
            value: userId,
          }}
          labelContainerProps={{
            color: "white",
            h: "28px",
          }}
          labelProps={{
            fontSize: "22px",
            lineHeight: "28px",
          }}
        />
        <StyledInput
          marginTop="28px"
          label={stringConstants.LoginScreen.OTP}
          isDisabled={loading}
          inputProps={{
            testID: stringConstants.LoginScreenTestIds.PasswordInput,
            fontSize: "21px",
            lineHeight: "30px",
            _input: {
              px: "19px",
              py: "29px",
              _focus: {
                px: "18px",
                py: "28px",
              },
            },
            value: password,
            onChangeText: (text: string) => {
              setPassword(text);
            },
          }}
          labelContainerProps={{
            color: "white",
            h: "28px",
          }}
          labelProps={{
            fontSize: "22px",
            lineHeight: "28px",
          }}
          labelTestId="DeviceOTPLabel"
        />
        <StyledButton
          type="tertiary"
          onPress={loginCallBack}
          testID={stringConstants.LoginScreenTestIds.LoginClick}
          label={stringConstants.LoginScreen.Button.Enter}
          isDisabled={loading}
          styles={buttonStyles.base}
          textStyles={buttonStyles.text}
        />
      </Box>
    </Box>
  );
};
