import { ERROR } from "@ct/common/enums";
import { useAppDispatch, useAppSelector } from "@ct/common/hooks";
import { getBasket } from "@ct/common/selectors";
import { CommitStatus, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { TxStatus } from "@ct/common/state/HomeScreen/updatePaymentStatus.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import {
  isNetworkError,
  preUpdateBasket,
  transactionApiClient,
  useGetCommitFulfillClient,
} from "@ct/utils";
import { logManager } from "@pol/frontend-logger-web";
import { clone } from "lodash";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useCallback } from "react";
import { useGetBasketItemToCommit } from "../useGetBasketItemToCommit";
import { BasketStateEnum, useOpenBasket } from "./useOpenBasket";
import { API_LOGS_FN, API_LOGS_MSG } from "@ct/common/constants/APILogs";

type CommitBasketProps = {
  basketItems: IbasketItem[];
  txStatus?: TxStatus;
  paidAmount?: number;
};

export const useCommitBasket = () => {
  const apiLogger = logManager(LOGGER_TYPE.apiLogger);
  const { basketItems } = useAppSelector(getBasket);
  const dispatch = useAppDispatch();
  const transactionAPI = transactionApiClient();

  const clientCnF = useGetCommitFulfillClient();

  const { openBasket } = useOpenBasket();
  const { getCardEntryToCommit, getAggregatedItemsToCommit, getDataToCommit } =
    useGetBasketItemToCommit();

  const resetCommitStatus = useCallback(() => {
    const items = clone(basketItems);
    items.forEach((item) => {
      if (item.commitStatus === STATE_CONSTANTS.COMMIT_INITIATED) {
        item.commitStatus = CommitStatus.notInitiated;
      }
    });
    dispatch(updateBasket(preUpdateBasket(items)));
  }, [basketItems, dispatch]);

  const doCommit = useCallback(
    async (items: BasketItemPayload[]) => {
      try {
        const clientCnFResponse = await clientCnF;
        let basketID;
        const { data } = await transactionAPI.getLastBasket();
        basketID = data?.basket?.basketCore?.basketID;
        const basketState = data?.basket?.basketCore?.basketState;
        if (basketState === BasketStateEnum.Bkc) {
          const response = await openBasket(basketState, basketID);
          basketID = response.basketId;
        }
        if (!basketID) {
          apiLogger.info({
            methodName: API_LOGS_FN.doCommit,
            message: API_LOGS_MSG.basketIdNotFound,
            data: {
              lastBasket: data,
            },
          });
          return;
        }
        return clientCnFResponse?.process(basketID, items);
      } catch (error) {
        apiLogger.error({
          methodName: API_LOGS_FN.doCommit,
          error: error as Error,
        });
        if (isNetworkError(error)) {
          resetCommitStatus();
          return ERROR.NETWORK_ERROR;
        }
        return;
      }
    },
    [apiLogger, clientCnF, openBasket, resetCommitStatus, transactionAPI],
  );

  const commitBasket = useCallback(
    async (data: CommitBasketProps) => {
      try {
        const dataToCommit = await getDataToCommit(
          data.basketItems,
          data.txStatus,
          data.paidAmount ?? 0,
        );
        if (!dataToCommit || !dataToCommit.length) {
          return;
        }
        return doCommit(dataToCommit);
      } catch (error) {
        apiLogger.error({
          methodName: "commitBasket",
          error: error as Error,
        });
        if (isNetworkError(error)) {
          resetCommitStatus();
          return ERROR.NETWORK_ERROR;
        }
        return;
      }
    },
    [apiLogger, doCommit, getDataToCommit, resetCommitStatus],
  );

  const commitAggregatedItems = useCallback(
    async (items: IbasketItem[]) => {
      try {
        const aggregatedItems = await getAggregatedItemsToCommit(items);

        if (!aggregatedItems || !aggregatedItems.length) {
          return;
        }
        return doCommit(aggregatedItems);
      } catch (error) {
        apiLogger.error({
          methodName: "commitAggregatedItems",
          error: error as Error,
        });
        if (isNetworkError(error)) {
          resetCommitStatus();
          return ERROR.NETWORK_ERROR;
        }
        return;
      }
    },
    [apiLogger, doCommit, getAggregatedItemsToCommit, resetCommitStatus],
  );

  const retryCommit = useCallback(
    (item: IbasketItem) => {
      const data = item?.journeyData?.transaction as BasketItemPayload;
      const resp = doCommit([data]);
      if (isNetworkError(resp)) {
        resetCommitStatus();
      }
      return resp;
    },
    [doCommit, resetCommitStatus],
  );

  const commitCashEntry = useCallback(
    async (cashpayload: BasketItemPayload[]) => {
      try {
        return doCommit(cashpayload);
      } catch (error) {
        apiLogger.error({
          methodName: "commitCashEntry",
          error: error as Error,
        });
        if (isNetworkError(error)) {
          resetCommitStatus();
          return ERROR.NETWORK_ERROR;
        }
        return;
      }
    },
    [apiLogger, doCommit, resetCommitStatus],
  );
  const commitCardEntry = useCallback(
    async (cardEntry: IbasketItem, basketArray: IbasketItem[]) => {
      try {
        const dataToCommit = await getCardEntryToCommit(cardEntry, basketArray);
        if (!dataToCommit) {
          return;
        }
        return doCommit([dataToCommit as BasketItemPayload]);
      } catch (error) {
        apiLogger.error({
          methodName: "commitCardEntry",
          error: error as Error,
        });
        if (isNetworkError(error)) {
          resetCommitStatus();
          return ERROR.NETWORK_ERROR;
        }
        return;
      }
    },
    [apiLogger, doCommit, getCardEntryToCommit, resetCommitStatus],
  );

  return {
    commitBasket,
    commitAggregatedItems,
    retryCommit,
    commitCashEntry,
    commitCardEntry,
  };
};
