import { CustomButton } from "@ct/common";
import { colorConstants, stringConstants } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Text } from "native-base";
import styles from "./styles";

interface Props {
  isDisabled: boolean;
  onPress: () => void;
}

function TransactionButton({ isDisabled, onPress }: Props) {
  return (
    <CustomButton
      style={styles.button}
      disabled={isDisabled}
      testID={stringConstants.Button.VoidItem}
      buttonId={stringConstants.Button.VoidItem}
      onPress={onPress}
      bg={isDisabled ? colorConstants.disableBtnColor : colorConstants.buttonColors.teritary}
    >
      <Text
        fontFamily={FontFamily.FONT_NUNITO_BOLD}
        color={isDisabled ? colorConstants.disabledTextColour : colorConstants.white}
      >
        {stringConstants.Button.VoidItemBtn} {isDisabled}
      </Text>
    </CustomButton>
  );
}

export default TransactionButton;
