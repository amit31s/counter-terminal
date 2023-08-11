import { MaterialSymbol } from "@ct/assets/icons/MaterialSymbol";
import { getBasket, touchKeyboardSelector, useAppDispatch, useAppSelector } from "@ct/common";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { hideUpdateQuantity } from "@ct/common/state/HomeScreen/updateQuantityFlag.slice";
import { colorConstants, stringConstants } from "@ct/constants";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { appendPoundSymbolWithAmount, poundToPence, preUpdateBasket } from "@ct/utils";
import { cloneDeep } from "lodash";
import { Text, View } from "native-base";
import { BasketButton } from "postoffice-spm-components";
import { useEffect, useState } from "react";
import { QuantityCounter } from "./QuantityCounter";
import styles from "./updateQuantityModalStyle";

export const UpdateQuantityModal = () => {
  const dispatch = useAppDispatch();
  const { enabled: touchKeyboardEnabled } = useAppSelector(touchKeyboardSelector);
  const { basketItems, selectedItem } = useAppSelector(getBasket);
  const initialQty = selectedItem?.quantity || 0;
  const [qty, setQty] = useState<number>(1); // set default quantity 1
  const originalQuantity: string = selectedItem?.journeyData.transaction?.originalQuantity;

  const updateQuantity = async () => {
    const basketArray: IbasketItem[] = cloneDeep(basketItems);
    for (let i = 0; i < basketArray.length; i++) {
      if (basketArray[i].id === selectedItem?.id) {
        const total = basketArray[i].price * qty;
        basketArray[i].quantity = qty;
        basketArray[i].total = Number(total.toFixed(2));
        basketArray[i].journeyData.transaction.quantity = basketArray[i].quantity;
        basketArray[i].journeyData.transaction.valueInPence = poundToPence(total);
      }
    }
    dispatchBasketData(basketArray);
    dispatch(hideUpdateQuantity());
  };

  const dispatchBasketData = (basketArray: IbasketItem[]) => {
    dispatch(updateBasket(preUpdateBasket(basketArray)));
  };
  const maximunQuantity =
    selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND
      ? initialQty
      : selectedItem?.journeyData.transaction.maxQuantity
      ? selectedItem?.journeyData.transaction.maxQuantity
      : 1000;

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const plusClicked = () => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      const newQty = qty - 1;
      if (newQty >= selectedItem?.journeyData.transaction?.originalQuantity) {
        setQty(newQty);
      }
    } else {
      const newQty = qty + 1;
      if (qty <= maximunQuantity) {
        setQty(newQty);
      }
    }
  };

  const minusClicked = () => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      const newQty = qty + 1;
      if (newQty < 0) {
        setQty(newQty);
      }
    } else {
      const newQty = qty - 1;
      if (newQty >= 0) {
        setQty(newQty);
      }
    }
  };

  const isMinQuantityDisabled = (): boolean => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      if (qty >= -1) return true;
      return false;
    } else {
      return qty <= 1;
    }
  };
  const isMaxQuantityDisabled = (): boolean => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      return qty <= selectedItem?.journeyData.transaction?.originalQuantity;
    } else {
      return qty > maximunQuantity;
    }
  };

  const displayQuantityLimitWarnings = (): string => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      if (qty >= -1) return stringConstants.quantityEditor.errorLessThanOne;
      if (qty === parseFloat(originalQuantity))
        return stringConstants.quantityEditor.errorMaximumQuantity;
    } else {
      if (qty <= 0 || qty === 0) return stringConstants.quantityEditor.errorLessThanOne;
      else if (qty > 99 && qty <= maximunQuantity)
        return stringConstants.quantityEditor.errorHighQuantity;
      else if (qty > maximunQuantity) return stringConstants.quantityEditor.errorMaximumQuantity;
    }
    return "";
  };

  const isUpdateButtonDisabled = (): boolean => {
    if (selectedItem?.journeyData.transaction.journeyType === JOURNEYENUM.REFUND) {
      return !!(qty === 0);
    } else {
      return !!(qty > maximunQuantity || qty < 1);
    }
  };

  const errorMessage = displayQuantityLimitWarnings();

  return (
    <View testID="updateQuantityView">
      <View style={styles.itemsQuantityRow}>
        <View style={styles.modalWebContainer}>
          <View style={styles.topQuantityView}>
            <View style={styles.inputQtyView}>
              <Text
                fontSize={24}
                fontWeight={700}
                color={colorConstants.iconColors.defaultBlue}
                marginBottom={"16px"}
                fontFamily="Nunito Sans"
              >
                {selectedItem?.item}
              </Text>
            </View>
            <View style={styles.inputQtyView}>
              <Text
                fontSize={24}
                fontWeight={700}
                color={colorConstants.iconColors.defaultBlue}
                marginBottom={"32px"}
                fontFamily="Nunito Sans"
              >
                {appendPoundSymbolWithAmount(selectedItem?.price || 0)}
              </Text>
            </View>
            <QuantityCounter
              minusClicked={() => minusClicked()}
              plusClicked={plusClicked}
              minusDisabled={isMinQuantityDisabled()}
              plusDisabled={isMaxQuantityDisabled()}
              isError={!!errorMessage}
              quantity={qty}
              setQuantity={setQty}
              touchKeyboardEnabled={touchKeyboardEnabled}
            />
          </View>
          {errorMessage && (
            <View style={styles.alertText}>
              <MaterialSymbol name={"info"} color={colorConstants.white} size="small" />
              <Text style={styles.popupMsgText} testID="qtyError">
                {errorMessage}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.popupButtonView}>
        <View>
          <BasketButton
            title="Cancel"
            size="sm_medium"
            onPress={() => {
              dispatch(hideUpdateQuantity());
            }}
          />
        </View>
        <View style={styles.successButtonContainer}>
          <BasketButton
            disabled={isUpdateButtonDisabled()}
            title="Confirm"
            size="sm_medium"
            variant="primary"
            onPress={() => {
              updateQuantity();
            }}
          />
        </View>
      </View>
    </View>
  );
};
