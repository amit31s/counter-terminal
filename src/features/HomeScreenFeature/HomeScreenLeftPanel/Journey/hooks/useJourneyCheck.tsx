import { StyledErrorWarningAmberIcon } from "@ct/assets/icons";
import { cashItemID, getBasket, useAppDispatch, useAppSelector } from "@ct/common";
import { useAddBasketItem } from "@ct/common/hooks/useAddBasketItem";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { IJourneyData } from "@ct/components/JourneyRenderer";
import { TEXT, stringConstants } from "@ct/constants";
import { confirmationModalBasketRestrictBtn } from "@ct/features";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { EntryType, IbasketItem } from "@ct/interfaces";
import { isNetworkError } from "@ct/utils";
import { Box } from "native-base";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { useCallback } from "react";

export const getItemJourneyType = (data: IJourneyData) => {
  if (data?.basketDataList?.[0]?.transaction?.journeyType === JOURNEYENUM.REFUND) {
    return JOURNEYENUM.REFUND;
  }

  return JOURNEYENUM.SALES;
};

function itemIsNonCashPayment(basketItem: IbasketItem): boolean {
  return (
    basketItem.type === EntryType.paymentMode &&
    basketItem.journeyData?.transaction?.itemID !== cashItemID
  );
}

function isItemCashOnly(data: IJourneyData) {
  if ("basketDataList" in data && data.basketDataList?.length) {
    return data.basketDataList?.some(
      (item: { transaction: BasketItemPayload }) =>
        item?.transaction?.tokens?.methodOfPayment === "cash",
    );
  }
  return data?.transaction?.tokens?.methodOfPayment === "cash";
}

function getError(
  data: IJourneyData,
  journeyType: string,
  basketItemCount: number,
  basketItems: IbasketItem[],
): { title: string; content: string } | null {
  const currentItemJourneyType = getItemJourneyType(data);
  if (journeyType !== currentItemJourneyType && basketItemCount > 0) {
    return {
      title: stringConstants.messages.basketRestrictionErr,
      content: currentItemJourneyType === JOURNEYENUM.SALES ? TEXT.CTTXT00041 : TEXT.CTTXT00042,
    };
  }

  if (isItemCashOnly(data) && basketItems.some(itemIsNonCashPayment)) {
    return { title: TEXT.CTTXT00073, content: TEXT.CTTXT00077 };
  }

  return null;
}

export function useJourneyCheck() {
  const dispatch = useAppDispatch();
  const addBasketItem = useAddBasketItem();

  const { basketItemCount, journeyType, basketItems } = useAppSelector(getBasket);

  return useCallback(
    async (data: IJourneyData) => {
      const error = getError(data, journeyType, basketItemCount, basketItems);

      if (error !== null) {
        dispatch(
          setLoadingActive({
            id: LoadingId.HOME_SCREEN_JOURNEY_NOTICE,
            modalProps: {
              ...error,
              testID: stringConstants.messages.basketRestrictionErr,
              icon: (
                <Box>
                  <StyledErrorWarningAmberIcon />
                </Box>
              ),
              primaryButtonProps: confirmationModalBasketRestrictBtn(() =>
                dispatch(setLoadingInactive(LoadingId.HOME_SCREEN_JOURNEY_NOTICE)),
              ),
            },
          }),
        );
        return;
      }

      const itemStatus = await addBasketItem(data);
      if (isNetworkError(itemStatus)) {
        dispatch(showNoNetworkModal());
      }
    },
    [addBasketItem, basketItemCount, basketItems, dispatch, journeyType],
  );
}
