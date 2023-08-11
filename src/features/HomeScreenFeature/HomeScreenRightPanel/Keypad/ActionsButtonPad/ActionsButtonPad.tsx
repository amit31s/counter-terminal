import { MaterialSymbol } from "@ct/assets/icons";
import {
  getBasket,
  getQuantityFlag,
  getUpDownArrow,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { updateUpDownArrow } from "@ct/common/state/HomeScreen/UpdateUpDownArrow";
import { colorConstants } from "@ct/constants";
import { View } from "native-base";
import { RefContext } from "postoffice-global-ref-input";
import { BasketButton } from "postoffice-spm-components";
import { RefObject, useCallback, useContext } from "react";
import { TextInput } from "react-native";
import { useSelector } from "react-redux";

export type ButtonPadProps = {
  scannerInputRef?: RefObject<TextInput>;
};

export function DownArrowActionButton() {
  const dispatch = useAppDispatch();
  const { isBasketEmpty, basketItemCount } = useAppSelector(getBasket);
  const upDownArrow = useSelector(getUpDownArrow);
  const disableArrowkeys = basketItemCount === 1 || isBasketEmpty;
  const downArrowDisabled = disableArrowkeys || upDownArrow.disableDownClick;
  const downArrowClicked = useCallback(() => {
    dispatch(
      updateUpDownArrow({
        upClicked: false,
        downClicked: true,
      }),
    );
  }, [dispatch]);
  return (
    <View marginRight="12px">
      <BasketButton
        title=""
        icon={
          <MaterialSymbol
            name={"south"}
            color={
              downArrowDisabled ? colorConstants.buttonColors.disabled.blue : colorConstants.blue
            }
          />
        }
        variant="keypad"
        disabled={downArrowDisabled}
        onPress={() => downArrowClicked()}
      />
    </View>
  );
}

export function UpArrowActionButton() {
  const dispatch = useAppDispatch();
  const { isBasketEmpty, basketItemCount } = useAppSelector(getBasket);
  const upDownArrow = useSelector(getUpDownArrow);
  const disableArrowkeys = basketItemCount === 1 || isBasketEmpty;
  const upArrowDisabled = disableArrowkeys || upDownArrow.disableUpClick;
  const upArrorClicked = useCallback(() => {
    dispatch(
      updateUpDownArrow({
        upClicked: true,
        downClicked: false,
      }),
    );
  }, [dispatch]);
  return (
    <View marginRight="12px">
      <BasketButton
        title=""
        icon={
          <MaterialSymbol
            name={"north"}
            color={
              upArrowDisabled ? colorConstants.buttonColors.disabled.blue : colorConstants.blue
            }
          />
        }
        variant="keypad"
        disabled={upArrowDisabled}
        onPress={() => upArrorClicked()}
      />
    </View>
  );
}

export function Backspace({ scannerInputRef }: ButtonPadProps) {
  const quantityFlag = useAppSelector(getQuantityFlag);
  const { setPendingChanges } = useContext(RefContext);
  const backSpaceClicked = useCallback(() => {
    try {
      // Prioritize focus on quantity input box.
      !quantityFlag.flag ? scannerInputRef?.current?.focus() : null;
      setPendingChanges?.({
        value: null,
        action: "backspace",
      });
    } catch (e) {
      console.log(e);
    }
  }, [quantityFlag.flag, scannerInputRef, setPendingChanges]);
  return (
    <View marginRight="12px">
      <BasketButton
        title=""
        icon={<MaterialSymbol name={"backspace"} color={colorConstants.blue} />}
        variant="keypad"
        onPress={() => backSpaceClicked()}
      />
    </View>
  );
}
