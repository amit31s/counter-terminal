import { CustomButton, useAppDispatch } from "@ct/common";
import { resetCashTransfer } from "@ct/common/state/cashTransfer/cashTransfer.slice";
import { BUTTON, COLOR_CONSTANTS, SCREENS } from "@ct/constants";
import { FontFamily } from "@ct/utils/Scaling/FontFamily";
import { Flex, Text } from "native-base";
import { useNavigate } from "react-router-dom";

export const BackToHome = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const back = () => {
    dispatch(resetCashTransfer());
    navigate(SCREENS.HOME, { state: { from: SCREENS.CASH_TRANSFER } });
  };

  return (
    <Flex direction="row" justifyContent={"center"} testID="test-backtohome">
      <CustomButton
        onChange={back}
        testID={BUTTON.CTBTN0002}
        buttonId={BUTTON.CTBTN0002}
        bg={COLOR_CONSTANTS.buttonColors.teritary}
      >
        <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.white}>
          {BUTTON.CTBTN0002}
        </Text>
      </CustomButton>
    </Flex>
  );
};
