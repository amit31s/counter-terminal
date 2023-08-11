import { Text, View } from "native-base";
import { Dispatch, SetStateAction, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import styles, { OutLineStyle } from "./updateQuantityModalStyle";

type QuantityButtonProps = {
  text: string;
  focused: boolean;
  disabled?: boolean;
};
const QuantityButton = ({ text, focused, disabled }: QuantityButtonProps) => {
  const customBorderStyle = disabled
    ? styles.quantityButtonBorderDisabled
    : focused
    ? styles.quantityButtonBorderFocused
    : styles.quantityButtonBorderDefault;
  return (
    <View focusable={true} style={[OutLineStyle(), styles.quantityButton, customBorderStyle]}>
      <Text
        fontSize={24}
        style={
          disabled ? styles.quantityButtonTextColorDisabled : styles.quantityButtonTextColorDefault
        }
      >
        {text}
      </Text>
    </View>
  );
};

export type QuantityCounterProps = {
  quantity: number;
  minusDisabled: boolean;
  plusDisabled: boolean;
  minusClicked: () => void;
  plusClicked: () => void;
  setQuantity: Dispatch<SetStateAction<number>>;
  isError: boolean;
  touchKeyboardEnabled: boolean;
};

export const QuantityCounter = ({
  quantity,
  minusDisabled,
  minusClicked,
  plusDisabled,
  plusClicked,
  setQuantity,
  isError,
  touchKeyboardEnabled,
}: QuantityCounterProps) => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [minusFocused, setMinusFocused] = useState<boolean>(false);
  const [plusFocused, setPlusFocused] = useState<boolean>(false);

  const customStyle = isFocused ? styles.quantityTextInputFocused : styles.quantityTextInputDefault;

  return (
    <View style={styles.quantityLayout}>
      <TouchableOpacity
        disabled={minusDisabled}
        testID="minus"
        onFocus={() => setMinusFocused(true)}
        onBlur={() => setMinusFocused(false)}
        onPressOut={() => setMinusFocused(false)}
        accessibilityLabel="decrease quantity"
        onPress={minusClicked}
        style={[OutLineStyle(), styles.quantityButtonRight]}
      >
        <QuantityButton text="-" focused={minusFocused} disabled={minusDisabled} />
      </TouchableOpacity>
      <View style={styles.inputBox}>
        <TextInput
          autoFocus
          testID="qty"
          keyboardType="numeric"
          onChangeText={(input) => {
            const newQty = !input ? 0 : Number(input);
            if (!isNaN(newQty)) {
              setQuantity(newQty);
            }
          }}
          value={quantity.toString()}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          style={[OutLineStyle(), isError ? styles.quantityTextInputError : customStyle]}
          virtualKeyboardPolicy={touchKeyboardEnabled ? "auto" : "manual"}
        />
      </View>
      <TouchableOpacity
        disabled={plusDisabled}
        testID="plus"
        accessibilityLabel="increase quantity"
        onFocus={() => setPlusFocused(true)}
        onBlur={() => setPlusFocused(false)}
        onPressOut={() => setPlusFocused(false)}
        onPress={plusClicked}
        style={[OutLineStyle(), styles.quantityButtonLeft]}
      >
        <QuantityButton text="+" focused={plusFocused} disabled={plusDisabled} />
      </TouchableOpacity>
    </View>
  );
};
