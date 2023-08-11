import { getBasket, getNumpadFlag, useAppSelector } from "@ct/common";
import { View } from "native-base";
import { RefObject } from "react";
import { TextInput } from "react-native";
import { Basket } from "./Basket";
import Keypad from "./Keypad";

export type HomeScreenRightPanelProps = {
  scannerInputRef?: RefObject<TextInput>;
};

export const HomeScreenRightPanel = ({ scannerInputRef }: HomeScreenRightPanelProps) => {
  const numpadFlag = useAppSelector(getNumpadFlag);
  const { basketItems } = useAppSelector(getBasket);

  return (
    <View flex={1}>
      <View justifyContent="space-between" flex={1} flexDirection="column">
        <Basket />
        {!numpadFlag.flag && basketItems.length === 0 ? (
          <View testID="empty-view" />
        ) : (
          <Keypad scannerInputRef={scannerInputRef} />
        )}
      </View>
    </View>
  );
};
