import { CustomButton, Screen, ScreenLayout, useAppDispatch } from "@ct/common";
import { signOutUser } from "@ct/common/state/auth.slice";
import { setTouchKeyboardEnabled } from "@ct/common/state/touchKeyboard.slice";
import { COLOR_CONSTANTS, TEXT, stringConstants } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { cleanUserIdToken } from "@ct/utils/Services/auth";
import { Center, Text } from "native-base";

export const NotAllowedOnThisBranch = () => {
  const dispatch = useAppDispatch();

  return (
    <Screen>
      <ScreenLayout>
        <Center flex={1} testID={"notAllowedOnThisBranch"}>
          <Text fontWeight={"bold"}>{TEXT.CTTXT00033}</Text>
          <CustomButton
            mt="50px"
            marginLeft="30px"
            onChange={() => {
              setTimeout(function () {
                cleanUserIdToken();
                dispatch(setTouchKeyboardEnabled(false));
                dispatch(signOutUser());
              }, 500);
            }}
            testID={stringConstants.Button.Ok}
            buttonId={stringConstants.Button.Ok}
            bg={COLOR_CONSTANTS.buttonColors.teritary}
            h="70px"
          >
            <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.white}>
              {stringConstants.Button.Ok}
            </Text>
          </CustomButton>
        </Center>
      </ScreenLayout>
    </Screen>
  );
};
