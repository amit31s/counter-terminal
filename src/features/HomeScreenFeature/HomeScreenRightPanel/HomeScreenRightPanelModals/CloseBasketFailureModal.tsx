import { StyledSmsFailedOutlinedIcon } from "@ct/assets/icons";
import { getBasketIdStatus, useAppDispatch, useAppSelector } from "@ct/common";
import { updateBasketIdStatus } from "@ct/common/state/HomeScreen";
import { CustomModal, StyledButtonProps } from "@ct/components";
import { TEXT, stringConstants } from "@ct/constants";
import { useCallback, useMemo } from "react";

type CloseBasketFailed = {
  alertModalButton: StyledButtonProps;
  closeBasketFailed: boolean | undefined;
};

const CloseBasketFailedDueToFulfilmentPending = ({
  alertModalButton,
  closeBasketFailed,
}: CloseBasketFailed) => {
  return (
    <CustomModal
      testID={TEXT.CTTXT0004}
      title={TEXT.CTTXT0002}
      content={TEXT.CTTXT0004}
      isOpen={closeBasketFailed}
      primaryButtonProps={alertModalButton}
      icon={<StyledSmsFailedOutlinedIcon />}
      contentSize="medium"
    />
  );
};

const CloseBasketFailedGeneric = ({ alertModalButton, closeBasketFailed }: CloseBasketFailed) => {
  return (
    <CustomModal
      testID={TEXT.CTTXT0002}
      title={TEXT.CTTXT0002}
      content={TEXT.CTTXT0003}
      isOpen={closeBasketFailed}
      primaryButtonProps={alertModalButton}
      icon={<StyledSmsFailedOutlinedIcon />}
      contentSize="medium"
    />
  );
};

export const CloseBasketFailureModal = () => {
  const { closeBasketFailed, errorCode } = useAppSelector(getBasketIdStatus);
  const dispatch = useAppDispatch();

  const CloseBasketFailure = useCallback(() => {
    dispatch(
      updateBasketIdStatus({
        closeBasketFailed: false,
      }),
    );
  }, [dispatch]);

  const alertModalButton = useMemo<StyledButtonProps>(
    () => ({
      testID: stringConstants.CommitFailureModal.ok_Btn,
      label: stringConstants.CommitFailureModal.ok_Btn,
      onPress: CloseBasketFailure,
    }),
    [CloseBasketFailure],
  );

  return ((code: string | undefined) => {
    switch (code) {
      case "TE0102436":
        return (
          <CloseBasketFailedDueToFulfilmentPending
            alertModalButton={alertModalButton}
            closeBasketFailed={closeBasketFailed}
          />
        );
      default:
        return (
          <CloseBasketFailedGeneric
            alertModalButton={alertModalButton}
            closeBasketFailed={closeBasketFailed}
          />
        );
    }
  })(errorCode);
};
