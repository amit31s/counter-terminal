import {
  cashPaymentPayload,
  getBasket,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { CNF_LOGS_FN } from "@ct/common/constants/CNFLogs";
import { ERROR } from "@ct/common/enums";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { isNetworkError, transactionApiClient } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  prepareChequePayloadToCommit,
  prepareIrcPayloadToCommit,
} from "../../QuickTendering.helper";

export function useCommitCash(
  paymentDoneUsingCash: boolean,
  setPaymentDoneUsingCash: Dispatch<SetStateAction<boolean>>,
  setCashPaymentCompleted: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { commitCashEntry } = useCommitBasket();
  const { basketItems } = useAppSelector(getBasket);
  const { paidByCash } = useAppSelector(getPaymentStatus);
  const txApi = transactionApiClient();
  const commitAndFulfilLogger = logManager(LOGGER_TYPE.commitAndFulfilLogger);

  useEffect(() => {
    if (!paymentDoneUsingCash) {
      return;
    }
    setPaymentDoneUsingCash(false);
    (async () => {
      try {
        const journeyType = basketItems[0]?.journeyData?.transaction?.journeyType;
        const numberOfEntries = await txApi.getNumberOfEntries();
        let entryID = (numberOfEntries || 0) + 1;
        if (paidByCash) {
          const payload = await cashPaymentPayload(
            paidByCash,
            entryID,
            STATE_CONSTANTS.CASH,
            journeyType,
          );
          const resp = await commitCashEntry([payload] as BasketItemPayload[]);
          if (isNetworkError(resp)) {
            throw ERROR.NETWORK_ERROR;
          }
          entryID++;
        }

        const chequePayload = await prepareChequePayloadToCommit({ basketItems, entryID });
        if (chequePayload?.payloadToCommit.length) {
          const resp = await commitCashEntry(chequePayload.payloadToCommit);
          if (isNetworkError(resp)) {
            throw ERROR.NETWORK_ERROR;
          }
        }

        const irdPayload = await prepareIrcPayloadToCommit({
          basketItems,
          entryID: chequePayload?.entryID ?? entryID,
        });

        if (irdPayload?.payloadToCommit.length) {
          const resp = await commitCashEntry(irdPayload.payloadToCommit);
          if (isNetworkError(resp)) {
            throw ERROR.NETWORK_ERROR;
          }
        }

        setCashPaymentCompleted(true);
      } catch (error) {
        commitAndFulfilLogger.error({
          methodName: CNF_LOGS_FN.useCommitCash,
          error: error as Error,
        });
        if (isNetworkError(error)) {
          dispatch(showNoNetworkModal());
          return;
        }
      }
    })();
  }, [
    basketItems,
    commitAndFulfilLogger,
    commitCashEntry,
    dispatch,
    paidByCash,
    paymentDoneUsingCash,
    setCashPaymentCompleted,
    setPaymentDoneUsingCash,
    txApi,
  ]);
}
