import {
  BasketStateEnum,
  getBasket,
  getQuantityFlag,
  useAppSelector,
  useGetHomeScreenStage,
  useGetJourneyStatus,
} from "@ct/common";
import { STATE_CONSTANTS } from "@ct/constants";
import { isCommitInitiated } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { transactionApiClient } from "@ct/utils";
import { useCallback } from "react";

type UseVoidItemOrBasket = {
  isDisabled: boolean;
  isBasketVoidable: () => Promise<boolean>;
  isItemVoidable: (item: IbasketItem) => Promise<boolean>;
};

export const useVoidItemOrBasket = (): UseVoidItemOrBasket => {
  const { basketItems } = useAppSelector(getBasket);
  const txApi = transactionApiClient();

  const { isJourneyStarted } = useGetJourneyStatus();

  const { flag: isQuantityModalOpened } = useAppSelector(getQuantityFlag);
  const { stage } = useGetHomeScreenStage();

  const isDisabled =
    basketItems.length === 0 ||
    stage === "tendering" ||
    stage === "completed" ||
    isQuantityModalOpened ||
    isJourneyStarted;

  const isItemVoidable = useCallback(
    async (item: IbasketItem): Promise<boolean> => {
      if (isCommitInitiated(item) || item.source === "nbit" || !item.voidable) {
        return false;
      }

      try {
        const { data } = await txApi.getLastBasket();
        if (data?.basket?.basketCore?.NumberOfEntries === 0) {
          return true;
        }
        const entries = data.entries.map((entry) => entry.entryCore?.entryID);
        return !entries.includes(item?.journeyData?.transaction?.entryID);
      } catch (error) {
        throw error;
      }
    },
    [txApi],
  );

  const isBasketVoidable = useCallback(async (): Promise<boolean> => {
    const invalidItem = basketItems.find(
      (item) =>
        item.source === "nbit" ||
        !item.voidable ||
        item.commitStatus === STATE_CONSTANTS.COMMIT_INITIATED,
    );
    if (invalidItem) {
      return false;
    }
    try {
      const { data } = await txApi.getLastBasket();
      return (
        data?.basket?.basketCore?.basketState === BasketStateEnum.Bkc ||
        data?.basket?.basketCore?.NumberOfEntries === 0
      );
    } catch (error) {
      throw error;
    }
  }, [basketItems, txApi]);

  return { isDisabled, isItemVoidable, isBasketVoidable };
};
