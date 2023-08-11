import {
  cashPaymentPayload,
  chequePaymentPayload,
  ircPaymentPayload,
  useAppDispatch,
  useCommitBasket,
} from "@ct/common";
import { REDUX_LOGS_FN } from "@ct/common/constants/ReduxLogs";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { LoadingId, setLoadingActive } from "@ct/common/state/loadingStatus.slice";
import { STATE_CONSTANTS, TEXT } from "@ct/constants";
import { chequeUUID, ircUUID } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { IbasketItem } from "@ct/interfaces";
import { isNetworkError, transactionApiClient, uuid } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { Dispatch, SetStateAction } from "react";

export async function commitPayments(
  dispatch: ReturnType<typeof useAppDispatch>,
  basketArray: IbasketItem[],
  commitCashEntry: ReturnType<typeof useCommitBasket>["commitCashEntry"],
  setPaymentCompleted: Dispatch<SetStateAction<boolean>>,
  cashPaymentToCommit?: number,
) {
  const reduxLogger = logManager(LOGGER_TYPE.reduxLogger);
  const journeyType = basketArray[0]?.journeyData?.transaction?.journeyType;

  dispatch(
    setLoadingActive({
      id: LoadingId.TENDERING,
      modalProps: {
        title: TEXT.CTTXT00064,
      },
    }),
  );
  try {
    const txApi = transactionApiClient();
    const numberOfEntries = await txApi.getNumberOfEntries();
    let entryID = (numberOfEntries || 0) + 1;
    const payloadToCommit: BasketItemPayload[] = [];

    const cashPayment = basketArray.find(
      (entry) =>
        entry.id === STATE_CONSTANTS.CASH && entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
    );
    if (cashPayment) {
      const cashPayload = await cashPaymentPayload(
        cashPaymentToCommit ?? cashPayment.total,
        entryID,
        STATE_CONSTANTS.CASH,
        journeyType,
      );
      payloadToCommit.push(cashPayload);
      entryID++;
    }

    for (const element of basketArray) {
      if (element.id === chequeUUID(element)) {
        const chequePayload = await chequePaymentPayload(
          element.total,
          entryID,
          STATE_CONSTANTS.CHEQUE,
          journeyType,
        );
        payloadToCommit.push(chequePayload);
        entryID++;
      } else if (element.id === ircUUID(element)) {
        const ircPayload = await ircPaymentPayload(
          element.total,
          entryID,
          element.localUUID ?? uuid(),
        );
        payloadToCommit.push(ircPayload);
        entryID++;
      }
    }

    const resp = await commitCashEntry(payloadToCommit);
    if (isNetworkError(resp)) {
      dispatch(showNoNetworkModal());
      return;
    }
    setPaymentCompleted(true);
    reduxLogger.info({
      methodName: REDUX_LOGS_FN.commitPayments,
      message: TEXT.CTTXT00012,
    });
  } catch (error) {
    reduxLogger.fatal({
      methodName: REDUX_LOGS_FN.commitPayments,
      error: error as Error,
    });
    if (isNetworkError(error)) {
      dispatch(showNoNetworkModal());
      return;
    }
  }
}
