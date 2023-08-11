import { getBasket, getQuantityFlag, useAppDispatch, useAppSelector } from "@ct/common";
import { setSelectedItem } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { BasketItemsList } from "@ct/components";
import { UpdateQuantityModal } from "@ct/components/UpdateQuantityModal";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { View } from "native-base";
import { useCallback } from "react";
import { TxRecoveryModalContent } from "../HomeScreenModals/TxRecoveryModal/TxRecoveryModal";

export const Basket = () => {
  const dispatch = useAppDispatch();

  const quantityFlag = useAppSelector(getQuantityFlag);
  const { basketItems, selectedItem } = useAppSelector(getBasket);
  const updateSelectedBasketItem = useCallback(
    (item: IbasketItem) => {
      dispatch(setSelectedItem(item));
    },
    [dispatch],
  );

  if (quantityFlag.flag) {
    return <UpdateQuantityModal />;
  }

  return (
    <>
      <View flex={1}>
        <BasketItemsList
          dataList={basketItems}
          updateSelectedBasketItem={updateSelectedBasketItem}
          selectedItem={selectedItem}
        />
      </View>
      <TxRecoveryModalContent />
    </>
  );
};
