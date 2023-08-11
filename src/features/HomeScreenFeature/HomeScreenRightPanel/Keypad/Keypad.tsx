import { getNumpadFlag } from "@ct/common";
import { ButtonsPad } from "@ct/features/HomeScreenFeature/HomeScreenRightPanel/Keypad/ButtonsPadComponent";
import { Flex, View } from "native-base";
import { memo, RefObject } from "react";
import { TextInput } from "react-native";
import { useSelector } from "react-redux";
import TransactionButtonsPad from "./TransactionButtonsPad";

export type KeypadProps = {
  scannerInputRef?: RefObject<TextInput>;
};

const Keypad = memo(({ scannerInputRef }: KeypadProps) => {
  const numpadFlag = useSelector(getNumpadFlag);

  return (
    <Flex>
      <View flexDirection={"row"}>
        {numpadFlag.flag && (
          <>
            <ButtonsPad scannerInputRef={scannerInputRef} />
          </>
        )}
        <TransactionButtonsPad scannerInputRef={scannerInputRef} />
      </View>
    </Flex>
  );
});

Keypad.displayName = "Keypad";

export default Keypad;
