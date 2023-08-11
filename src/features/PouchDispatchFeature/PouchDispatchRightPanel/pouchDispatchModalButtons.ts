import { StyledButtonProps } from "@ct/components";
import { STRING_CONSTANTS } from "@ct/constants";

export const alertModalButton = (onSuccessPress: () => void): StyledButtonProps => ({
  testID: STRING_CONSTANTS.Button.Ok,
  label: STRING_CONSTANTS.Button.Ok,
  onPress: onSuccessPress,
});
