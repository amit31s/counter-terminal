import { StyledButtonProps } from "@ct/components";
import { BUTTON, stringConstants } from "@ct/constants";
import { testIds } from "./testData";

export const alertModalButton = (onSuccessPress: () => void): StyledButtonProps => ({
  testID: testIds.successButton,
  label: stringConstants.Button.Ok,
  onPress: onSuccessPress,
});

export const pouchSubmittedModalButton = (success: () => void): StyledButtonProps => ({
  testID: testIds.successButton,
  label: stringConstants.Button.Finish,
  onPress: success,
});

export const branchValidationPrimaryPopupButton = (success: () => void): StyledButtonProps => ({
  testID: testIds.successButton,
  label: stringConstants.Button.BTN_ACCEPT,
  onPress: success,
});

export const branchValidationSecondaryPopupButton = (cancel: () => void): StyledButtonProps => ({
  testID: testIds.cancelButton,
  label: stringConstants.Button.Decline,
  onPress: cancel,
});

export const showAvailablePouchModalPrimaryButton = (success: () => void): StyledButtonProps => ({
  testID: testIds.successButton,
  label: stringConstants.Button.BTN_YES,
  onPress: success,
});

export const showAvailablePouchModalSecondaryButton = (cancel: () => void): StyledButtonProps => ({
  testID: testIds.cancelButton,
  label: stringConstants.Button.BTN_NO,
  onPress: cancel,
});

export const submitPouchModalPrimaryButton = (success: () => void): StyledButtonProps => ({
  testID: testIds.confirmButton,
  label: stringConstants.Button.Confirm,
  onPress: success,
});

export const submitPouchModalConfirmWithoutPrintPrimaryButton = (
  success: () => void,
): StyledButtonProps => ({
  testID: testIds.confirmWithouPrintButton,
  label: BUTTON.CTBTN0012,
  onPress: success,
});

export const submitPouchModalSecondaryButton = (success: () => void): StyledButtonProps => ({
  testID: testIds.reprintButton,
  label: BUTTON.CTBTN0011,
  onPress: success,
});

export const submitPouchModalCancelButton = (cancel: () => void): StyledButtonProps => ({
  testID: testIds.cancelButton,
  label: stringConstants.Button.Cancel_Button,
  onPress: cancel,
});

export const submitPouchModalFinishButton = (cancel: () => void): StyledButtonProps => ({
  testID: testIds.finishButton,
  label: stringConstants.Button.Finish,
  onPress: cancel,
});
