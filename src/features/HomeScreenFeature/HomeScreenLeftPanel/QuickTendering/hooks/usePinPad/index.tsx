import { stringConstants } from "@ct/constants";
import { PosDisplayEvent } from "postoffice-peripheral-management-service";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import useCardClicked from "./useCardClicked";
import useCreatePinPad from "./useCreatePinPad";
import usePedActionHandler from "./usePedActionHandler";

export function usePinPad(
  amount: number,
  inputAmount: number,
  setInputAmount: Dispatch<SetStateAction<number>>,
  setPaymentUUID: Dispatch<SetStateAction<string | null>>,
  isProcessing: boolean,
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  setValidInputForCard: Dispatch<SetStateAction<boolean>>,
  setWillPerformAfterPaymentCommit: Dispatch<SetStateAction<boolean>>,
  setPaymentDoneUsingCash: Dispatch<SetStateAction<boolean>>,
  setTransactionCompletedByCard: Dispatch<SetStateAction<boolean>>,
) {
  const [paymentProcessMsg, setPaymentProcessMsg] = useState<string>(
    stringConstants.paymentAlertMsg.waitWhileLoading,
  );
  const [pedActions, setPedActions] = useState<PosDisplayEvent[]>([]);
  const [pinPadErrorDescription, setPinPadErrorDescription] = useState<string | null>(null);
  const [pinPadErrorId, setPinPadErrorId] = useState<string | null>(null);
  const pinPadError = pinPadErrorDescription !== null || pinPadErrorId !== null;

  const pinPad = useCreatePinPad(setPaymentProcessMsg, setPedActions);

  const pedActionHandler = usePedActionHandler(pinPad, setPinPadErrorId, setPinPadErrorDescription);

  const handleAcknowledgePinPadError = useCallback(() => {
    setPinPadErrorId(null);
    setPinPadErrorDescription(null);
    setIsProcessing(false);
  }, [setIsProcessing]);

  const cardClicked = useCardClicked(
    pinPad,
    amount,
    inputAmount,
    setInputAmount,
    setPaymentUUID,
    setIsProcessing,
    setValidInputForCard,
    setWillPerformAfterPaymentCommit,
    setPaymentDoneUsingCash,
    setTransactionCompletedByCard,
    setPinPadErrorId,
    setPinPadErrorDescription,
  );

  return useMemo(
    () => ({
      cardClicked,
      pinPadModalProps: {
        isVisible: isProcessing && !pinPadError,
        headerText: paymentProcessMsg,
        actions: pedActions,
        pedActionHandler,
      },
      cardFailedModalProps: {
        description: pinPadErrorDescription,
        id: pinPadErrorId,
        onClose: handleAcknowledgePinPadError,
      },
    }),
    [
      cardClicked,
      handleAcknowledgePinPadError,
      isProcessing,
      paymentProcessMsg,
      pedActionHandler,
      pedActions,
      pinPadError,
      pinPadErrorDescription,
      pinPadErrorId,
    ],
  );
}
