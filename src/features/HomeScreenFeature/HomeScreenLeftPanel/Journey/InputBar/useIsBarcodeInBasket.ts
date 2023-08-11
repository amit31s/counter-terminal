import { getBasket, useAppSelector } from "@ct/common";
import { IbasketItem } from "@ct/interfaces";
import { Dispatch, SetStateAction, useCallback } from "react";

export function useIsBarcodeInBasket(setDuplicateBarcodeFlag: Dispatch<SetStateAction<boolean>>) {
  const { basketItems } = useAppSelector(getBasket);

  return useCallback(
    (barcode: string): boolean => {
      const isDuplicate =
        basketItems.find(
          (data: IbasketItem) =>
            data?.journeyData?.basket?.duplicateBarcodeIdentifier &&
            barcode.includes(data?.journeyData?.basket?.duplicateBarcodeIdentifier + ""),
        ) !== undefined;

      setDuplicateBarcodeFlag(isDuplicate);

      if (isDuplicate) {
        setTimeout(() => {
          setDuplicateBarcodeFlag(false);
        }, 3000);
      }

      return isDuplicate;
    },
    [basketItems, setDuplicateBarcodeFlag],
  );
}
