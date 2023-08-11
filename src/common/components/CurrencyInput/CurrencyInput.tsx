import { useAppSelector } from "@ct/common/hooks";
import { touchKeyboardSelector } from "@ct/common/selectors";
import { APP_CONSTANTS } from "@ct/constants";
import { Text } from "native-base";
import { TextInput } from "postoffice-spm-components";
import { ComponentProps, useCallback, useEffect, useState } from "react";

const adornment: ComponentProps<typeof TextInput>["adornment"] = {
  position: "left",
  icon: <Text textAlign="center">£</Text>,
  separator: true,
};

interface InputProps {
  value: number;
  onChangeText: (value: number) => void;
  maxValue?: number;
}

export const CurrencyInput = ({
  value,
  onChangeText,
  maxValue = APP_CONSTANTS.CONST0011,
}: InputProps) => {
  const [updatedValue, setUpdatedValue] = useState<string>(value.toString());
  const { enabled: touchKeyboardEnabled } = useAppSelector(touchKeyboardSelector);

  useEffect(() => {
    if (value === 0) {
      setUpdatedValue("0");
    }
  }, [value]);

  const handleChangeCurrency = useCallback(
    (input: string) => {
      if (maxValue && Number(input) > maxValue) {
        return;
      }
      onChangeText(Number(input));
      setUpdatedValue(input);
    },
    [maxValue, onChangeText],
  );

  return (
    <TextInput
      value={updatedValue}
      mask="currency"
      testID="currency-field"
      onChangeText={handleChangeCurrency}
      adornment={adornment}
      virtualKeyboardPolicy={touchKeyboardEnabled ? "auto" : "manual"}
    />
  );
};
