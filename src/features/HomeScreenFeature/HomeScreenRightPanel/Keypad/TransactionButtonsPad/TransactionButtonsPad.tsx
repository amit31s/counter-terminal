import { Flex, View } from "native-base";
import { RefObject } from "react";
import { TextInput } from "react-native";
import { EmptyBasketButton } from "../../EmptyBasketButton";
import { PaymentButton } from "../../PaymentButton";
import { Quantity } from "../../QuantityButton";
import { RemoveItemButton } from "../../RemoveItemButton";
import {
  Backspace,
  DownArrowActionButton,
  UpArrowActionButton,
} from "../ActionsButtonPad/ActionsButtonPad";

export type TransactionButtonsPadProps = {
  scannerInputRef?: RefObject<TextInput>;
};

function TransactionButtonsPad({ scannerInputRef }: TransactionButtonsPadProps) {
  return (
    <Flex>
      <View flex={1}>
        <View flex={1} flexDirection="row">
          <UpArrowActionButton />
          <RemoveItemButton />
        </View>
        <View flex={1} flexDirection="row" marginTop="12px">
          <DownArrowActionButton />
          <EmptyBasketButton />
        </View>
        <View flex={1} flexDirection="row" marginTop="12px">
          <Backspace scannerInputRef={scannerInputRef} />
          <Quantity />
        </View>
        <View flex={1} marginTop="12px">
          <PaymentButton />
        </View>
      </View>
    </Flex>
  );
}

export default TransactionButtonsPad;
