import {
  getBasket,
  getPaymentStatus,
  SERVER_ROOT,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { PED_LOGS_FN } from "@ct/common/constants/PEDLogs";
import { isMessagePrompt, isRecord } from "@ct/common/helpers/validation";
import { updateCardPayment, updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { LoadingId, setLoadingActive } from "@ct/common/state/loadingStatus.slice";
import { STATE_CONSTANTS, TEXT } from "@ct/constants";
import { chequeUUID, ircUUID } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { poundToPence } from "@ct/utils";
import { authHeadersWithDeviceToken } from "@ct/utils/Services/authHeader";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { IngenicoPedClient } from "postoffice-peripheral-management-service";
import { buildPaymentBankingServicesClient } from "postoffice-product-journey-api-clients";
import { Dispatch, SetStateAction, useCallback } from "react";
import addCardToBasket from "./addCardToBasket";
import checkRefData from "./checkRefData";
import getTransactionId from "./getTransactionId";

export default function useCardClicked(
  pinPad: IngenicoPedClient,
  amount: number,
  inputAmount: number,
  setInputAmount: Dispatch<SetStateAction<number>>,
  setPaymentUUID: Dispatch<SetStateAction<string | null>>,
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  setValidInputForCard: Dispatch<SetStateAction<boolean>>,
  setWillPerformAfterPaymentCommit: Dispatch<SetStateAction<boolean>>,
  setPaymentDoneUsingCash: Dispatch<SetStateAction<boolean>>,
  setTransactionCompletedByCard: Dispatch<SetStateAction<boolean>>,
  setPinPadErrorId: Dispatch<SetStateAction<string | null>>,
  setPinPadErrorDescription: Dispatch<SetStateAction<string | null>>,
) {
  const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);
  const dispatch = useAppDispatch();
  const { commitCardEntry } = useCommitBasket();
  const { isRepayMode, isCustomerToPay } = useAppSelector(getPaymentStatus);
  const { journeyType, basketItems, basketValue } = useAppSelector(getBasket);
  const paymentsBankingClient = buildPaymentBankingServicesClient({
    authHeaders: authHeadersWithDeviceToken,
    rootUrl: SERVER_ROOT,
  });

  const processCardPayment = useCallback(
    async (cardPaymentAmountUpdated: number) => {
      setIsProcessing(true);
      try {
        const transactionId = await getTransactionId(paymentsBankingClient);
        if (!transactionId) {
          pmsLogger.info({ methodName: PED_LOGS_FN.processCardPayment, message: TEXT.CTTXT00020 });
          return;
        }

        const orderXResult = !isRepayMode
          ? await pinPad.debitCheck(poundToPence(cardPaymentAmountUpdated), transactionId)
          : await pinPad.refundCheck(poundToPence(cardPaymentAmountUpdated), transactionId);

        pmsLogger.info({ methodName: PED_LOGS_FN.processCardPayment, data: orderXResult });

        const pan = orderXResult.pan ?? "";

        const referenceDataCheck = await checkRefData(
          paymentsBankingClient,
          pan,
          cardPaymentAmountUpdated,
          isRepayMode,
          pinPad,
          transactionId,
        );

        const cardSuccess = await addCardToBasket(
          basketItems,
          referenceDataCheck,
          pan,
          orderXResult.paymentId as string,
          cardPaymentAmountUpdated,
          transactionId,
          journeyType,
          commitCardEntry,
          setPaymentUUID,
          dispatch,
        );

        if (cardSuccess) {
          dispatch(updateCardPayment(cardPaymentAmountUpdated));
          setIsProcessing(false);
          setInputAmount(0);
          const cashPayment = basketItems.find(
            (entry: IbasketItem) =>
              entry.id === STATE_CONSTANTS.CASH &&
              entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
          );
          const chequePayment = basketItems.find(
            (entry: IbasketItem) =>
              entry.id === chequeUUID(entry) && entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
          );
          const ircPayment = basketItems.find(
            (entry: IbasketItem) =>
              entry.id === ircUUID(entry) && entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
          );
          if (basketValue + cardPaymentAmountUpdated !== 0) {
            return;
          }
          setWillPerformAfterPaymentCommit(true);
          dispatch(
            setLoadingActive({
              id: LoadingId.TENDERING,
              modalProps: {
                title: TEXT.CTTXT00064,
              },
            }),
          );
          if (cashPayment || chequePayment || ircPayment) {
            setPaymentDoneUsingCash(true);
            return;
          }
          setTransactionCompletedByCard(true);
        }
      } catch (error) {
        pmsLogger.info({
          methodName: PED_LOGS_FN.processCardPayment,
          error: error as Error,
        });

        if (typeof error === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error);
        } else if (isRecord(error) && "message" in error && typeof error.message === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error.message);
        } else if (isRecord(error) && "prompt" in error && isMessagePrompt(error.prompt)) {
          setPinPadErrorId(error.prompt.id);
          setPinPadErrorDescription(error.prompt.description);
        } else {
          setPinPadErrorId(null);
          setPinPadErrorDescription("An unknown error occurred.");
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [
      setIsProcessing,
      paymentsBankingClient,
      isRepayMode,
      pinPad,
      pmsLogger,
      basketItems,
      journeyType,
      commitCardEntry,
      setPaymentUUID,
      dispatch,
      setInputAmount,
      basketValue,
      setWillPerformAfterPaymentCommit,
      setTransactionCompletedByCard,
      setPaymentDoneUsingCash,
      setPinPadErrorId,
      setPinPadErrorDescription,
    ],
  );

  return useCallback(async () => {
    dispatch(
      updatePaymentStatus({
        cashTenderReceivedAmountTxCommited: true,
        cashTenderTenderedAmountTxCommited: true,
      }),
    );

    if (inputAmount > basketValue) {
      setValidInputForCard(true);
    } else {
      setValidInputForCard(false);
      await processCardPayment(isCustomerToPay ? -amount : amount);
    }
  }, [
    amount,
    dispatch,
    inputAmount,
    isCustomerToPay,
    processCardPayment,
    basketValue,
    setValidInputForCard,
  ]);
}
