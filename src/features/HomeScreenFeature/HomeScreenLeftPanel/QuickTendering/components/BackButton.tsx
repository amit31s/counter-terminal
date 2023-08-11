import { useAppDispatch } from "@ct/common";
import { updateHomeScreenStage, updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { StyledButton } from "@ct/components";
import { Flex } from "native-base";
import { ReactElement, useCallback } from "react";
import { buttonStyles } from "./buttonStyles";

export type BackButtonProps = {
  isDisabled: boolean;
};

export function BackButton({ isDisabled }: BackButtonProps): ReactElement {
  const dispatch = useAppDispatch();

  const backBtnCallback = useCallback(() => {
    dispatch(
      updatePaymentStatus({
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmountTxCommited: false,
      }),
    );
    dispatch(
      updateHomeScreenStage({
        stage: "home",
      }),
    );
  }, [dispatch]);

  return (
    <Flex flexDir="row">
      <StyledButton
        testID="Back"
        type="secondary"
        size="slim"
        label="Back"
        onPress={backBtnCallback}
        isDisabled={isDisabled}
        styles={buttonStyles.backButton}
      />
    </Flex>
  );
}
