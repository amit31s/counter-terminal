import { useAppDispatch, useCloseBasket } from "@ct/common";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { logManager } from "@pol/frontend-logger-web";
import { isNetworkError } from "@ct/utils";
import { Dispatch, SetStateAction, useCallback } from "react";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";

const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

export function useHandlePrintingFinished(
  isReceiptModalOpen: boolean,
  setIsReceiptModalOpen: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { updateTxCompleted } = useBasket();
  const { closeBasket } = useCloseBasket();

  return useCallback(async () => {
    try {
      if (!isReceiptModalOpen) {
        return;
      }
      setIsReceiptModalOpen(false);
      const status = await closeBasket();
      if (status) {
        updateTxCompleted();
        pmsLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.completeAndCloseBasket,
          message: BASKET_PROCESS_LOGS_MSG.transactionFinishedSuccessfully,
        });
      }
    } catch (error) {
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      }
      pmsLogger.error({
        methodName: BASKET_PROCESS_LOGS_FN.closePrintConfirmationModal,
        error: error as Error,
      });
    }
  }, [closeBasket, dispatch, isReceiptModalOpen, setIsReceiptModalOpen, updateTxCompleted]);
}
