import { RootState } from "@ct/common/state";
import { STATE_CONSTANTS } from "@ct/constants";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { syncSelectedItem } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { floatConversion } from "@ct/utils";
import { createSelector } from "@reduxjs/toolkit";

export type GetBasket = {
  basketValue: number;
  basketItems: IbasketItem[];
  failedItems: IbasketItem[];
  successItems: IbasketItem[];
  customerToPay: number;
  postOfficeToPay: number;
  selectedItem: IbasketItem;
  isBasketEmpty: boolean;
  basketItemCount: number;
  journeyType: string;
  allItemFulfilled: boolean;
  allItemCommited: boolean;
  postOfficeTenderingAmount: number;
  actualPostOfficeTenderingAmount: number;
  absolutePostOfficeTenderingAmount: number;
  basketId: string;
};

export const getBasket = createSelector(
  [(state: RootState) => state.updateBasket],
  (basketData): GetBasket => {
    const basketItems: IbasketItem[] = basketData?.items ?? [];
    const customerToPay = Number(floatConversion(basketData?.customerToPay ?? 0));
    const actualPostOfficeTenderingAmount = Number(
      floatConversion(basketData.postOfficeTenderingAmount),
    );
    const absolutePostOfficeTenderingAmount = Math.abs(basketData.postOfficeTenderingAmount);
    const postOfficeTenderingAmount =
      customerToPay >= Math.abs(actualPostOfficeTenderingAmount)
        ? 0
        : Math.abs(actualPostOfficeTenderingAmount);

    const postOfficeToPay = basketData?.postOfficeToPay ?? 0;
    const basketValue = basketData.basketValue ?? 0;
    const selectedItem: IbasketItem =
      syncSelectedItem(basketData?.selectedItem?.id, basketItems) ?? basketItems[0];
    const basketItemsLength = basketItems.length;
    const isBasketEmpty = !basketItemsLength;
    const basketItemCount = basketItemsLength;

    const failedItems: IbasketItem[] = [];
    const successItems: IbasketItem[] = [];
    let allItemFulfilled = !!basketItemsLength;
    let allItemCommited = !!basketItemsLength;
    for (const item of basketItems) {
      if (item.commitStatus === STATE_CONSTANTS.FAIL) {
        failedItems.push(item);
      } else if (item.commitStatus === STATE_CONSTANTS.SUCCESS) {
        successItems.push(item);
      }
      if (
        allItemFulfilled &&
        item.fulFillmentStatus !== STATE_CONSTANTS.FULFILLMENT_SUCCESS &&
        item.fulFillmentStatus !== STATE_CONSTANTS.FULFILLMENT_NOT_REQUIRED
      ) {
        allItemFulfilled = false;
      }
      if (allItemCommited && item.commitStatus !== STATE_CONSTANTS.SUCCESS) {
        allItemCommited = false;
      }
    }
    const journeyType =
      basketData?.items[0]?.journeyData?.transaction?.journeyType ?? JOURNEYENUM.SALES;

    return {
      basketValue,
      basketItems,
      customerToPay,
      postOfficeToPay,
      selectedItem,
      isBasketEmpty,
      basketItemCount,
      failedItems,
      journeyType,
      successItems,
      allItemFulfilled,
      allItemCommited,
      postOfficeTenderingAmount,
      actualPostOfficeTenderingAmount,
      absolutePostOfficeTenderingAmount,
      basketId: basketData.basketId,
    };
  },
);
