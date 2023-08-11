import { getBasket, getLoadingStatus, SalesReceiptModal, useAppSelector } from "@ct/common";
import { CardTransactionFailedModal, PinPadModal } from "@ct/components";
import { stringConstants } from "@ct/constants";
import { View } from "native-base";
import { useState } from "react";
import { AmountInput, BackButton, CashQuickTendering, PaymentModes } from "./components";
import {
  useCheckCardPaymentCompleted,
  useCommitAfterCardPayment,
  useCommitAfterCashPayment,
  useCommitAfterChequePayment,
  useCommitCash,
  useHandleDispatchAfterCashClick,
  useHandleDispatchAfterChequeClick,
  useHandleDispatchAfterIRCClick,
  useHandlePrintingFinished,
  usePinPad,
  useResetTenderingActionsAfterNetworkError,
  useTriggerShowReceiptModal,
} from "./hooks";

// TODO: use single state called isInvalidInput for isInvalidCardInput and isInvalidChequeAmount
export type InitialInvalidInputStates = {
  invalidIRC?: boolean;
  invalidCheque?: boolean;
  invalidCard?: boolean;
};

export const QuickTendering = () => {
  const initialInvalidInputStates: InitialInvalidInputStates = { invalidIRC: false };

  const { basketValue } = useAppSelector(getBasket);
  const loadingStatus = useAppSelector(getLoadingStatus);

  const [isInvalidCardInput, setIsInvalidCardInput] = useState(false);
  // TODO: use single state called isInvalidInput for isInvalidCardInput and isInvalidChequeAmount
  const [isInvalidInput, setInvalidInput] =
    useState<InitialInvalidInputStates>(initialInvalidInputStates);
  const [isInvalidChequeAmount, setInvalidChequeAmount] = useState(false);
  const [inputAmount, setInputAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isTransactionCompletedByCard, setTransactionCompletedByCard] = useState(false);
  const [paymentUUID, setPaymentUUID] = useState<string | null>(null);
  const [paymentDoneUsingCash, setPaymentDoneUsingCash] = useState(false);
  const [willPerformAfterPaymentCommit, setWillPerformAfterPaymentCommit] = useState(false);
  const [cashPaymentCompleted, setCashPaymentCompleted] = useState(false);
  const [chequePaymentCompleted, setChequePaymentCompleted] = useState(false);
  const [showSaleReceiptModal, setShowSaleReceiptModal] = useState(true);
  const amount = inputAmount ? inputAmount : basketValue;

  const isLoading = loadingStatus.length > 0;
  const areButtonsDisabled =
    willPerformAfterPaymentCommit ||
    isProcessing ||
    isReceiptModalOpen ||
    paymentUUID !== null ||
    isLoading ||
    basketValue === 0;

  const { cardClicked, pinPadModalProps, cardFailedModalProps } = usePinPad(
    amount,
    inputAmount,
    setInputAmount,
    setPaymentUUID,
    isProcessing,
    setIsProcessing,
    setIsInvalidCardInput,
    setWillPerformAfterPaymentCommit,
    setPaymentDoneUsingCash,
    setTransactionCompletedByCard,
  );

  const handleDispatchAfterCashClick = useHandleDispatchAfterCashClick(setCashPaymentCompleted);
  const handleDispatchAfterChequeClick =
    useHandleDispatchAfterChequeClick(setChequePaymentCompleted);
  const handleDispatchAfterIRCClick = useHandleDispatchAfterIRCClick(setCashPaymentCompleted);

  useResetTenderingActionsAfterNetworkError({
    setWillPerformAfterPaymentCommit,
    setIsProcessing,
  });
  useTriggerShowReceiptModal(
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    setWillPerformAfterPaymentCommit,
  );
  useCommitAfterCardPayment(isTransactionCompletedByCard, setTransactionCompletedByCard);
  useCheckCardPaymentCompleted(paymentUUID, setPaymentUUID);
  useCommitCash(paymentDoneUsingCash, setPaymentDoneUsingCash, setCashPaymentCompleted);
  useCommitAfterCashPayment(cashPaymentCompleted, setCashPaymentCompleted);
  useCommitAfterChequePayment(chequePaymentCompleted, setChequePaymentCompleted);
  return (
    <View testID="QuickTenderingView">
      <CashQuickTendering
        areButtonsDisabled={areButtonsDisabled}
        handleDispatchAfterCashClick={handleDispatchAfterCashClick}
      />
      <PaymentModes
        areButtonsDisabled={areButtonsDisabled}
        inputAmount={inputAmount}
        amount={amount}
        cardClicked={cardClicked}
        setInvalidInputForCard={setIsInvalidCardInput}
        setInputAmount={setInputAmount}
        handleDispatchAfterCashClick={handleDispatchAfterCashClick}
        handleDispatchAfterChequeClick={handleDispatchAfterChequeClick}
        handleDispatchAfterIRCClick={handleDispatchAfterIRCClick}
        setWillPerformAfterPaymentCommit={setWillPerformAfterPaymentCommit}
        setInvalidChequeAmount={setInvalidChequeAmount}
        setInvalidInput={setInvalidInput}
      />
      <AmountInput
        isInvalidCardInput={isInvalidCardInput}
        isInvalidChequeAmount={isInvalidChequeAmount}
        setInvalidChequeAmount={setInvalidChequeAmount}
        setIsInvalidCardInput={setIsInvalidCardInput}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        amount={amount}
        isInvalidInput={isInvalidInput}
        setInvalidInput={setInvalidInput}
      />
      <BackButton isDisabled={areButtonsDisabled} />

      <CardTransactionFailedModal {...cardFailedModalProps} />
      <PinPadModal modalHeaderTitle={stringConstants.pinPadModalTitle} {...pinPadModalProps} />
      <SalesReceiptModal
        isOpen={!isLoading && isReceiptModalOpen && showSaleReceiptModal}
        setIsOpen={(flag) => {
          if (!flag) {
            setIsReceiptModalOpen(flag);
            setShowSaleReceiptModal(flag);
          }
        }}
        onPrintingFinished={useHandlePrintingFinished(isReceiptModalOpen, setIsReceiptModalOpen)}
      />
    </View>
  );
};
