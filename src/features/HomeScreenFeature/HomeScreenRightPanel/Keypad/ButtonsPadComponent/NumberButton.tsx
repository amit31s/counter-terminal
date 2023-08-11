import { colorConstants } from "@ct/constants";
import KeypadButton from "@ct/features/HomeScreenFeature/HomeScreenRightPanel/Keypad/KeypadButton";
import { Text } from "native-base";
import { useCallback } from "react";
import { TouchableHighlightProps } from "react-native";
import styles from "./styles";

interface Props {
  parentCallback: (name: string) => void;
  onLayout?: TouchableHighlightProps["onLayout"];
  name: string;
  ID: string;
}

function NumberButton({ parentCallback, onLayout, name, ID }: Props) {
  const handlePress = useCallback(() => {
    parentCallback(name);
  }, [name, parentCallback]);

  return (
    <KeypadButton onLayout={onLayout} onPress={handlePress} testID={ID}>
      <Text
        fontFamily="body"
        fontWeight="700"
        color={colorConstants.primaryBlueTextColor}
        style={styles.btnText}
      >
        {name}
      </Text>
    </KeypadButton>
  );
}

export default NumberButton;
