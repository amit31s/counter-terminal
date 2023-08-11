import { CurrencyInput } from "@ct/common";
import { TEXT } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";
import { useState } from "react";
import { SubmitCashTransfer } from "./SubmitCashTransfer";

interface CashInputProps {
  selectedEntity: string;
}
export const CashInput = ({ selectedEntity }: CashInputProps) => {
  const [amount, setAmount] = useState<number>(0);

  return (
    <>
      <Center px="10px" flex={1} maxHeight="780px" testID="test-cash-input">
        <Text mr="130px" mb="8px" fontSize="18px" fontFamily={FontFamily.FONT_NUNITO_BOLD}>
          {TEXT.CTTXT00066(selectedEntity)}
        </Text>
        <CurrencyInput value={amount} onChangeText={(e: number) => setAmount(e)} />
      </Center>
      <SubmitCashTransfer amount={amount} />
    </>
  );
};
