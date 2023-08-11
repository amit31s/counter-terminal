import { Screen, ScreenLayout, useAppDispatch, useAppSelector } from "@ct/common";
import { federatedSignIn } from "@ct/common/state/auth.slice";
import { StyledButton } from "@ct/components";
import { AppConstants, colorConstants, stringConstants } from "@ct/constants";
import { LoginScreenBackGroundImage } from "@ct/features/LoginScreenFeature/LoginScreenBackGroundImage";
import { LoginScreenPostOfficeLogo } from "@ct/features/LoginScreenFeature/LoginScreenPostOfficeLogo";
import { Box, Text, View } from "native-base";
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

export const UserLogin = () => {
  const dispatch = useAppDispatch();
  const { userLoginStarted } = useAppSelector((state) => state.auth);
  const [wasPressed, setWasPressed] = useState(false);

  const handleRedirect = useCallback(() => {
    setWasPressed(true);
    window.localStorage.setItem(AppConstants.AppKeys.APP_LAUNCHED, "false");
    setTimeout(function () {
      dispatch(federatedSignIn());
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    if (userLoginStarted) {
      setWasPressed(false);
    }
  }, [userLoginStarted]);

  return (
    <Screen>
      <ScreenLayout>
        <View
          flex={1}
          position="relative"
          testID={stringConstants.LoginScreenTestIds.LoginScreenPanel}
        >
          <LoginScreenBackGroundImage />
          <Box flexDirection="row" flex={1} alignItems="center">
            <LoginScreenPostOfficeLogo />

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
                  {stringConstants.LoginScreen.PleaseLoginUser}
                </Text>
              </Box>
              <Box
                bgColor={colorConstants.loginColors.formBackground}
                pt="42px"
                flex={1}
                alignItems="center"
              >
                <StyledButton
                  type="tertiary"
                  onPress={handleRedirect}
                  testID={stringConstants.LoginScreenTestIds.LoginClick}
                  label={stringConstants.LoginScreen.Button.login}
                  styles={buttonStyles.base}
                  textStyles={buttonStyles.text}
                  isDisabled={wasPressed || userLoginStarted}
                />
              </Box>
            </Box>
          </Box>
        </View>
      </ScreenLayout>
    </Screen>
  );
};
