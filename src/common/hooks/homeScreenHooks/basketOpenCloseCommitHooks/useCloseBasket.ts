import { getBasket, useAppDispatch, useAppSelector } from "@ct/common";
import { UpdateBasketIdStatus, updateBasketIdStatus } from "@ct/common/state/HomeScreen";
import { isNetworkError, transactionApiClient } from "@ct/utils";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import { BasketStateEnum } from "postoffice-commit-and-fulfill";
import { useCallback } from "react";
import { usePrintOnCloseBasket } from "../usePrintOnCloseBasket";
import {
  BASKET_PROCESS_LOGS_FN,
  BASKET_PROCESS_LOGS_MSG,
  BASKET_PROCESS_LOGS_VARS,
} from "@ct/common/constants/BasketLogs";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";

const basketLogger = logManager(LOGGER_TYPE.basketLogger);

type UpdateBasketCloseStatusParams = {
  closeBasketFailedStatus?: boolean;
  closeBasketSuccessStatus?: boolean;
  errorCode?: string;
};

export const useCloseBasket = () => {
  const dispatch = useAppDispatch();
  const transactionAPI = transactionApiClient();
  const triggerPrintAfterCloseBasket = usePrintOnCloseBasket();
  const { basketItemCount } = useAppSelector(getBasket);

  const updateBasketCloseStatus = useCallback(
    ({
      closeBasketFailedStatus,
      closeBasketSuccessStatus,
      errorCode,
    }: UpdateBasketCloseStatusParams) => {
      const updateBasketIdPayload: UpdateBasketIdStatus = {
        closeBasketFailed: closeBasketFailedStatus,
        basketClosed: closeBasketSuccessStatus,
      };
      if (closeBasketSuccessStatus) {
        triggerPrintAfterCloseBasket();
      }
      if (errorCode) {
        updateBasketIdPayload.errorCode = errorCode;
      }
      dispatch(updateBasketIdStatus(updateBasketIdPayload));
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.updateBasketCloseStatus,
        message: closeBasketFailedStatus
          ? BASKET_PROCESS_LOGS_MSG.basketClosedFailed
          : BASKET_PROCESS_LOGS_MSG.basketClosed,
      });
    },
    [dispatch, triggerPrintAfterCloseBasket],
  );

  const closeBasket = useCallback(async (): Promise<boolean> => {
    try {
      if (basketItemCount === 0) {
        return false;
      }
      const { data } = await transactionAPI.getLastBasket();
      if (!data) {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
          message: BASKET_PROCESS_LOGS_MSG.noValueGetLastBasketAPI,
          data,
        });
        updateBasketCloseStatus({ closeBasketFailedStatus: true });
        return false;
      }
      const basketCore = data?.basket?.basketCore;
      const basketID = basketCore?.basketID;
      const basketState = basketCore?.basketState;
      const numberOfEntries = basketCore?.NumberOfEntries;
      const lastSeqNumber = Number(basketID.split("-").pop());

      if (!basketID) {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
          message: BASKET_PROCESS_LOGS_MSG.basketIDNotSpecifiedLastBasketAPI,
          data,
        });
        updateBasketCloseStatus({ closeBasketFailedStatus: true });
        return false;
      }

      if (basketState === BasketStateEnum.Bkc) {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
          message: BASKET_PROCESS_LOGS_VARS.basketAlreadyClosedWithBasketIDEntries(
            basketID,
            numberOfEntries,
          ),
          data,
        });
        return true;
      }

      if (typeof numberOfEntries !== "number") {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
          message: BASKET_PROCESS_LOGS_MSG.noeNotSpecifiedLastBasketAPI,
          data,
        });
        updateBasketCloseStatus({ closeBasketFailedStatus: true });
        return false;
      }

      await transactionAPI.closeBasket(lastSeqNumber, numberOfEntries);

      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
        message: BASKET_PROCESS_LOGS_VARS.basketClosedSuccessEntries(numberOfEntries),
        data,
      });
      updateBasketCloseStatus({ closeBasketFailedStatus: false, closeBasketSuccessStatus: true });
      return true;
    } catch (error) {
      if (isNetworkError(error)) {
        throw error;
      }
      const errorCode = get(error, "response.data.errorCode");
      basketLogger.error({
        methodName: BASKET_PROCESS_LOGS_FN.closeBasket,
        message: BASKET_PROCESS_LOGS_VARS.closeBasketFailedErrorCode(errorCode),
        error: error as Error,
      });
      updateBasketCloseStatus({ closeBasketFailedStatus: true, errorCode });
    }
    updateBasketCloseStatus({ closeBasketFailedStatus: true });
    return false;
  }, [basketItemCount, transactionAPI, updateBasketCloseStatus]);

  return {
    closeBasket,
  };
};
