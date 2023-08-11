import { getBasket, useAppDispatch, useAppSelector } from "@ct/common";
import { updateHomeScreenStage, updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { preUpdateBasket } from "@ct/utils";
import { cloneDeep } from "lodash";

type UseBasket = {
  changeValueToZero: (uniqueID: string | string[]) => IbasketItem[];
  basketItemByUuid: (uniqueID: string) => IbasketItem | undefined;
  itemNameByUuid: (uniqueID: string) => string;
  updateTxCompleted: () => void;
};

export const useBasket = (): UseBasket => {
  const dispatch = useAppDispatch();
  const { basketItems } = useAppSelector(getBasket);
  const updateValue = (item: IbasketItem) => {
    item = cloneDeep(item);
    item.price = 0;
    item.total = 0;
    item.quantity = 0;
    item.additionalItemsValue = 0;
    if (typeof item.journeyData === "object" && typeof item.journeyData.transaction === "object") {
      item.journeyData.transaction.valueInPence = 0;
      delete item.journeyData?.basket?.params;
      for (const additionalItem of item.journeyData.transaction?.additionalItems ?? []) {
        additionalItem.valueInPence = 0;
      }
    }
    return item;
  };
  const changeValueToZero = (uniqueID: string | string[]): IbasketItem[] => {
    const updatedItems = basketItems.map((item) => {
      /* entryID added for card items*/
      const itemUniqueID = item.journeyData?.transaction?.uniqueID
        ? (item.journeyData?.transaction?.uniqueID as string)
        : (item.journeyData?.transaction?.entryID as string);

      if (typeof uniqueID === "string" && itemUniqueID === uniqueID) {
        return updateValue(item);
      }

      if (Array.isArray(uniqueID) && uniqueID.includes(itemUniqueID)) {
        return updateValue(item);
      }

      return item;
    });
    dispatch(updateBasket(preUpdateBasket(updatedItems)));
    return updatedItems;
  };

  const basketItemByUuid = (uniqueID: string): IbasketItem | undefined => {
    return basketItems.find(
      (item: IbasketItem) => item.journeyData?.transaction.uniqueID === uniqueID,
    );
  };

  const itemNameByUuid = (uniqueID: string): string => {
    if (!uniqueID) {
      return "";
    }

    const item = basketItemByUuid(uniqueID);

    if (!item) {
      return "";
    }

    return item.id.replace(uniqueID, "");
  };

  const updateTxCompleted = () => {
    dispatch(
      updateHomeScreenStage({
        stage: "completed",
      }),
    );
    dispatch(
      updatePaymentStatus({
        completed: true,
      }),
    );
  };

  return {
    changeValueToZero,
    basketItemByUuid,
    itemNameByUuid,
    updateTxCompleted,
  };
};
