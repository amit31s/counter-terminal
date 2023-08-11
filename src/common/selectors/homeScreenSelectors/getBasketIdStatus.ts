import { RootState } from "@ct/common/state";
import { UpdateBasketIdStatus } from "@ct/common/state/HomeScreen";
import { createSelector } from "@reduxjs/toolkit";

export const getBasketIdStatus = createSelector(
  [(state: RootState) => state.updateBasketIdStatus],
  (basketStatusData): UpdateBasketIdStatus => {
    const basketId = basketStatusData?.basketId ?? "";
    const isBasketOpened = basketStatusData?.isBasketOpened ?? false;
    const closeBasketFailed = basketStatusData?.closeBasketFailed ?? false;
    const errorCode = basketStatusData?.errorCode;
    const basketClosed = basketStatusData?.basketClosed ?? false;

    return {
      isBasketOpened,
      basketId,
      closeBasketFailed,
      errorCode,
      basketClosed,
    };
  },
);
