import {
  CurrencyInput,
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
  SERVER_ROOT,
  cardPaymentPayload,
  getBasket,
  getBasketIdStatus,
  getFulfillmentData,
  getLoadingStatus,
  getPaymentStatus,
  getSalesReceipt,
  useAppDispatch,
  useAppSelector,
  useCloseBasket,
  useCommitBasket,
} from "@ct/common";
import { getTerminalId } from "@ct/common/helpers/getTerminalId";
import { multipleOf } from "@ct/common/helpers/validation";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { FulfillmentStatusEnum } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { updateHomeScreenStage } from "@ct/common/state/HomeScreen/updateHomeScreenStage.slice";
import { updatePaymentStatus } from "@ct/common/state/HomeScreen/updatePaymentStatus.slice";
import { pushNewReceipt } from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { SalesReceiptData, resetSalesReceipt } from "@ct/common/state/updateSalesReceipt.slice";
import { CardTransactionFailedModal, CustomModal, PinPadModal, StyledButton } from "@ct/components";
import { COLOR_CONSTANTS, TEXT, colorConstants, stringConstants } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces";
import { IPaymentDispatchPayload } from "@ct/interfaces/HomeInterface";
import { intToFloat, poundToPence, preUpdateBasket, uuid } from "@ct/utils";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { getUserName } from "@ct/utils/Services/auth";
import { authHeadersWithDeviceToken } from "@ct/utils/Services/authHeader";
import { Flex, InputGroup, Text, View } from "native-base";
import {
  IngenicoPedClient,
  MessagePrompt,
  PosDisplayEvent,
  ServiceEvent,
  SupportedServices,
  getEventTagMapping,
  setup,
} from "postoffice-peripheral-management-service";
import {
  PaymentSettlementTypes,
  TransactionIdResponse,
  TransactionModes,
  TransactionTypes,
  buildPaymentBankingServicesClient,
} from "postoffice-product-journey-api-clients";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { allItemsCommited, generateSalesReceiptContext } from "../../homeScreen.helper";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { PED_LOGS_MSG, PED_LOGS_FN, PED_LOGS_VARS } from "@ct/common/constants/PEDLogs";

const buttonStyles = StyleSheet.create({
  base: {
    width: 170,
    marginLeft: 27,
  },
  start: {
    width: 170,
  },
  backButton: {
    borderColor: colorConstants.blueBorder,
    width: "49%",
  },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMessagePrompt(value: unknown): value is MessagePrompt {
  return (
    isRecord(value) &&
    "id" in value &&
    typeof value.id === "string" &&
    "description" in value &&
    typeof value.description === "string"
  );
}
export const RefundScreen = () => {
  const { device } = useAppSelector((rootState) => rootState.auth);
  const { paidAmount, paidByCash, txStatus } = useAppSelector(getPaymentStatus);
  const { basketId } = useAppSelector(getBasketIdStatus);
  const { commitBasket } = useCommitBasket();
  const { updateTxCompleted } = useBasket();
  const { closeBasket } = useCloseBasket();
  const {
    basketItems,
    customerToPay,
    postOfficeToPay,
    journeyType,
    allItemFulfilled,
    basketValue,
  } = useAppSelector(getBasket);
  const dispatch = useAppDispatch();
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isTransactionCompleted, setTransactionCompleted] = useState<boolean>(false);
  const [pinPadErrorDescription, setPinPadErrorDescription] = useState<string | null>(null);
  const [pinPadErrorId, setPinPadErrorId] = useState<string | null>(null);
  const pinPadError = pinPadErrorDescription !== null || pinPadErrorId !== null;
  const [isReceiptModal, setIsRecieptModal] = useState(false);
  const [paymentProcessMsg, setPaymentProcessMsg] = useState<string>(
    stringConstants.paymentAlertMsg.waitWhileLoading,
  );
  const [pedActions, setPedActions] = useState<PosDisplayEvent[]>([]);
  const [paymentNeedsToCommit, setPaymentNeedsToCommit] = useState(false);
  const [paymentUUID, setPaymentUUID] = useState<string | null>(null);
  const [paymentDoneUsingCash, setPaymentDoneUsingCash] = useState(false);
  const [isPerformingAfterPaymentCommit, setIsPerformingAfterPaymentCommit] = useState(false);
  const [willBePerformingAfterPaymentCommit, setWillBePerformingAfterPaymentCommit] =
    useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const amount = inputAmount ? inputAmount : basketValue;
  const receiptData: SalesReceiptData = useAppSelector(getSalesReceipt);
  const { items: fulfillmentItems, fulfillmentStatus } = useAppSelector(getFulfillmentData);
  const receiptService = useReceiptService();
  const loadingStatus = useAppSelector(getLoadingStatus);
  const isLoading = loadingStatus.length > 0;
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);
  const pedLogger = logManager(LOGGER_TYPE.pmsLogger);

  const areButtonsDisabled =
    willBePerformingAfterPaymentCommit ||
    isProcessing ||
    isReceiptModal ||
    paymentUUID !== null ||
    isLoading;

  const devices = setup({
    deviceServerHost: POL_DEVICE_SERVER_HOST,
    disconnectAfterResponse: true,
    callbacks: {
      onDisplayUpdate: (event: ServiceEvent) => {
        if (event.service === SupportedServices.IngenicoPed) {
          const eventTag = getEventTagMapping(event.message);
          if (eventTag !== undefined) {
            setPaymentProcessMsg(`${eventTag.id} - ${eventTag.description}`);
          } else {
            setPaymentProcessMsg(stringConstants.paymentAlertMsg.waitWhileLoading);
          }
          if (event.availableEvents) {
            setPedActions(event.availableEvents);
          }
        }
      },
    },
  });
  const triggerPrintingReceipt = async () => {
    const context = await generateSalesReceiptContext(
      device,
      basketId ?? "Unknown",
      basketItems,
      Math.round(customerToPay * 100),
      Math.round(postOfficeToPay * 100),
      Math.round(basketValue * 100),
      receiptData.cardDetails ?? [],
    );
    const templateId = "counter-terminal/sales-receipt";
    dispatch(pushNewReceipt({ templateId, context }));
    await receiptService.printReceipt({
      template: templateId,
      context,
    });
    dispatch(resetSalesReceipt());
  };

  const terminalId = getTerminalId(device.branchID, device.nodeID);
  const pinPad = devices.buildClient(SupportedServices.IngenicoPed, {
    terminalId,
    clerkId: getUserName(),
    useMock: POL_DEVICE_SERVER_SIMULATED,
  }) as IngenicoPedClient;

  const paymentsBankingClient = buildPaymentBankingServicesClient({
    authHeaders: authHeadersWithDeviceToken,
    rootUrl: SERVER_ROOT,
  });

  const closePrintConfirmationModal = async () => {
    try {
      setIsRecieptModal(false);
      dispatch(
        setLoadingActive({
          id: LoadingId.TENDERING,
          modalProps: { title: TEXT.CTTXT00015 },
        }),
      );
      const status = await closeBasket();
      dispatch(setLoadingInactive(LoadingId.TENDERING));
      if (status) {
        updateTxCompleted();
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.completeAndCloseBasket,
          message: BASKET_PROCESS_LOGS_MSG.transactionFinishedSuccessfullyRS,
        });
      }
    } catch (error) {
      basketLogger.error({
        methodName: closePrintConfirmationModal,
        error: error as Error,
      });
    }
  };

  const printReceipt = async () => {
    setIsRecieptModal(false);
    if (basketItems.length) {
      await triggerPrintingReceipt();
    }
    closePrintConfirmationModal();
  };

  const amountInputChangeCallback = useCallback(
    (amountIn: number) => {
      if (amountIn < customerToPay * 10) {
        setInputAmount(amountIn);
      } else {
        setErrorMsg(!errorMsg);
      }
    },
    [customerToPay, errorMsg],
  );
  const backBtnCallback = () => {
    dispatch(
      updateHomeScreenStage({
        stage: "home",
      }),
    );
  };

  const dispatchPaymentStatus = useCallback(
    (cashPayment: number, cardPayment?: number, deductAmount = false) => {
      const localPaymentObj: IPaymentDispatchPayload = {
        completed: false,
        deductAmount,
      };
      if (cashPayment || deductAmount) {
        localPaymentObj.cashPayment = cashPayment;
        dispatch(updatePaymentStatus(localPaymentObj));
        if (paidAmount + cashPayment - paidByCash >= customerToPay || deductAmount) {
          setPaymentDoneUsingCash(true);
          basketLogger.info({
            methodName: BASKET_PROCESS_LOGS_FN.dispatchPaymentStatus,
            message: BASKET_PROCESS_LOGS_MSG.paymentCompletedCash,
          });
        }
        return;
      }
      if (cardPayment) {
        dispatch(updatePaymentStatus(localPaymentObj));
        if (paidAmount + cardPayment >= customerToPay) {
          basketLogger.info({
            methodName: BASKET_PROCESS_LOGS_FN.dispatchPaymentStatus,
            message: BASKET_PROCESS_LOGS_MSG.paymentCompletedCard,
          });
        }
      }
    },
    [customerToPay, dispatch, paidAmount, paidByCash],
  );

  useEffect(() => {
    if (!isTransactionCompleted || pinPadError) return;

    setTransactionCompleted(false);
    dispatchPaymentStatus(0, amount);
    setInputAmount(0);

    if (txStatus !== "completed") return;

    (async () => {
      dispatch(setLoadingActive());
      setWillBePerformingAfterPaymentCommit(true);
      await commitBasket({ basketItems });
      setIsPerformingAfterPaymentCommit(true);
    })();
  }, [
    amount,
    basketItems,
    commitBasket,
    dispatch,
    dispatchPaymentStatus,
    isTransactionCompleted,
    pinPadError,
    txStatus,
  ]);

  useEffect(() => {
    if (!isPerformingAfterPaymentCommit || !allItemsCommited(basketItems) || !allItemFulfilled) {
      return;
    }
    dispatch(setLoadingInactive());
    setIsPerformingAfterPaymentCommit(false);
    setWillBePerformingAfterPaymentCommit(false);

    if (
      ![FulfillmentStatusEnum.SUCCESS, FulfillmentStatusEnum.NOT_INITIATED].includes(
        fulfillmentStatus,
      )
    )
      return;
    setIsRecieptModal(true);
  }, [allItemFulfilled, basketItems, dispatch, fulfillmentStatus, isPerformingAfterPaymentCommit]);

  const acknowledgedPinPadErrorBtn = () => {
    setTransactionCompleted(false);
    setPinPadErrorId(null);
    setPinPadErrorDescription(null);
    setIsProcessing(false);
  };

  // TODO: turn into a hook
  const pedActionHandler = async (event: PosDisplayEvent) => {
    try {
      await pinPad.sendEvent(event.event);
    } catch (error) {
      pedLogger.error({
        methodName: "pedActionHandler",
        error: error as Error,
      });

      if (typeof error === "string") {
        setPinPadErrorId(null);
        setPinPadErrorDescription(error);
      } else if (isRecord(error) && "messsage" in error && typeof error.message === "string") {
        setPinPadErrorId(null);
        setPinPadErrorDescription(error.message);
      } else if (isRecord(error) && "prompt" in error && isMessagePrompt(error.prompt)) {
        setPinPadErrorId(error.prompt.id);
        setPinPadErrorDescription(error.prompt.description);
      } else {
        setPinPadErrorId(null);
        setPinPadErrorDescription("An unknown error occured.");
      }
    }
  };

  const cardClicked = useCallback(async () => {
    const processCardPayment = async (cardPaymentAmount: number) => {
      setIsProcessing(true);
      try {
        let transactionIdResult: TransactionIdResponse;
        try {
          transactionIdResult = (await paymentsBankingClient.getTransactionId({
            type: TransactionTypes.Payments,
          })) as TransactionIdResponse;
        } catch (error) {
          pedLogger.fatal({
            methodName: PED_LOGS_FN.pedActionHandler,
            message: PED_LOGS_MSG.unableToGetTransactionId,
            error: error as Error,
          });
          throw PED_LOGS_MSG.unableToGetTransactionId;
        }

        const transactionId = transactionIdResult?.transactionId;
        if (!transactionId) {
          pedLogger.info({
            methodName: PED_LOGS_FN.processCardPayment,
            message: PED_LOGS_MSG.transactionIDNotReceived,
          });
          return;
        }
        const orderXResult = await pinPad.refundCheck(
          poundToPence(cardPaymentAmount),
          transactionId,
        );

        pedLogger.info({ methodName: PED_LOGS_FN.processCardPayment, data: orderXResult });

        const referenceDataCheck = await paymentsBankingClient.paymentTokeniserLookup({
          maskedPan: orderXResult.pan as string,
          settlementType: PaymentSettlementTypes.Sale,
          transactionMode: TransactionModes.Refund,
        });
        pedLogger.info({
          methodName: PED_LOGS_FN.processCardPayment,
          message: PED_LOGS_VARS.amountCardPayment,
          data: referenceDataCheck,
        });

        if (!referenceDataCheck.item || !referenceDataCheck.item.itemID) {
          try {
            await pinPad.abort(transactionId);
          } catch (error) {
            pedLogger.fatal({
              methodName: PED_LOGS_FN.pedActionHandler,
              message: PED_LOGS_MSG.cardNotSupportedByCounter,
              error: error as Error,
            });
          }
          throw PED_LOGS_MSG.cardNotSupportedByCounter;
        }

        if (referenceDataCheck.item.maximumValue) {
          const maximumValue = Number(referenceDataCheck.item.maximumValue);
          const minimumValue = Number(referenceDataCheck.item.minimumValue);
          const multipleOfValue = Number(referenceDataCheck.item.multipleValue);
          if (cardPaymentAmount > maximumValue) {
            pedLogger.info({
              methodName: PED_LOGS_FN.processCardPayment,
              message: PED_LOGS_VARS.amountCardValidation(
                intToFloat(cardPaymentAmount),
                intToFloat(maximumValue),
                intToFloat(minimumValue),
                intToFloat(multipleOfValue),
              ),
            });
            try {
              await pinPad.abort(transactionId);
            } catch (error) {}
            throw PED_LOGS_VARS.amountCardValidation(
              intToFloat(cardPaymentAmount),
              intToFloat(maximumValue),
              intToFloat(minimumValue),
              intToFloat(multipleOfValue),
            );
          }
        }

        if (referenceDataCheck.item.multipleValue) {
          const refMultipleOfValue = Number(referenceDataCheck.item.multipleValue);
          const errorMessage = PED_LOGS_VARS.cardAmountMultipleOf(refMultipleOfValue);
          if (!multipleOf(cardPaymentAmount, refMultipleOfValue)) {
            try {
              await pinPad.abort(transactionId);
            } catch (error) {}
            pedLogger.error({
              methodName: PED_LOGS_FN.processCardPayment,
              message: errorMessage,
            });
            throw errorMessage;
          }
        }

        const basketArray: IbasketItem[] = Object.assign([], basketItems);
        const itemUUID = uuid();
        const basketItem: IbasketItem = await cardPaymentPayload(
          referenceDataCheck,
          orderXResult.pan as string,
          orderXResult.paymentId as string,
          cardPaymentAmount,
          transactionId,
          itemUUID,
          journeyType,
        );
        basketArray.push(basketItem);
        dispatch(updateBasket(preUpdateBasket(basketArray)));
        setPaymentNeedsToCommit(true);
        setPaymentUUID(itemUUID);
        dispatch(
          setLoadingActive({
            id: LoadingId.PIN_PAD,
            modalProps: { title: stringConstants.pinPadModalTitle, content: TEXT.CTTXT0007 },
          }),
        );
      } catch (error) {
        pedLogger.error({
          methodName: PED_LOGS_FN.processCardPayment,
          error: error as Error,
        });

        if (typeof error === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error);
        } else if (isRecord(error) && "messsage" in error && typeof error.message === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error.message);
        } else if (isRecord(error) && "prompt" in error && isMessagePrompt(error.prompt)) {
          setPinPadErrorId(error.prompt.id);
          setPinPadErrorDescription(error.prompt.description);
        } else {
          setPinPadErrorId(null);
          setPinPadErrorDescription("An unknown error occured.");
        }
      } finally {
        setIsProcessing(false);
      }
    };

    if (inputAmount <= basketValue) {
      setErrorMsg(false);
      await processCardPayment(amount);
    } else {
      setErrorMsg(true);
    }
  }, [
    amount,
    basketItems,
    basketValue,
    dispatch,
    inputAmount,
    journeyType,
    paymentsBankingClient,
    pinPad,
  ]);

  const cashClicked = useCallback(() => {
    if (!inputAmount) {
      dispatchPaymentStatus(amount + paidByCash, 0, true);
      setErrorMsg(false);
    } else if (inputAmount <= basketValue) {
      dispatchPaymentStatus(amount);
      setInputAmount(0);
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
  }, [amount, dispatchPaymentStatus, inputAmount, paidByCash, basketValue]);

  useEffect(() => {
    const needsToCommit = basketItems.some(
      (item) => item.type === "paymentMode" && item.commitStatus === "notInitiated",
    );

    if (needsToCommit && paymentNeedsToCommit) {
      commitBasket({ basketItems });
      setPaymentNeedsToCommit(false);
    }
  }, [basketItems, commitBasket, paymentNeedsToCommit]);

  useEffect(() => {
    if (paymentUUID === null) return;
    const fulfillmentItem = fulfillmentItems.find(({ id }) => id === paymentUUID);

    if (
      !fulfillmentItem ||
      fulfillmentItem.fulfillmentStatus === FulfillmentStatusEnum.NOT_INITIATED
    )
      return;
    setPaymentUUID(null);

    if (fulfillmentItem.fulfillmentStatus !== FulfillmentStatusEnum.SUCCESS) return;
    setTransactionCompleted(true);
  }, [fulfillmentItems, paymentUUID]);

  useEffect(() => {
    (async () => {
      if (paymentDoneUsingCash) {
        setPaymentDoneUsingCash(false);
        setWillBePerformingAfterPaymentCommit(true);
        await commitBasket({ basketItems });
        setIsPerformingAfterPaymentCommit(true);
      }
    })();
  }, [basketItems, commitBasket, paymentDoneUsingCash]);

  const chequeClicked = null;
  const currencyInputField = useMemo(() => {
    return <CurrencyInput value={inputAmount} onChangeText={amountInputChangeCallback} />;
  }, [amountInputChangeCallback, inputAmount]);
  return (
    <View testID="refundView">
      <Text testID={stringConstants.RefundScreen.AmountTxtTestId} variant="medium-bold" mt="40px">
        Amount
      </Text>
      <View mt="20px" testID={stringConstants.RefundScreen.AmountInputTestId}>
        <InputGroup h={"20"} w={"xl"}>
          {currencyInputField}
        </InputGroup>
        {errorMsg && (
          <Text mt="20px" color={COLOR_CONSTANTS.warningText}>
            Amount must be less then or Equals to Total Amount.
          </Text>
        )}
      </View>

      <Text variant="medium-bold" testID={stringConstants.RefundScreen.PaymentModeTestId} mt="40px">
        Payment Mode
      </Text>
      <Flex flexDirection={"row"} mt="20px">
        <StyledButton
          onPress={cashClicked}
          testID={stringConstants.RefundScreen.CashBtnTxtTestId}
          type="secondary"
          label="Cash"
          isDisabled={false}
          styles={buttonStyles.start}
        />
        <StyledButton
          onPress={cardClicked}
          testID={stringConstants.RefundScreen.CardBtnTxtTestId}
          type="secondary"
          label="Card"
          isDisabled={areButtonsDisabled}
          styles={buttonStyles.base}
        />
        <StyledButton
          onPress={chequeClicked}
          testID={stringConstants.RefundScreen.ChequeBtnTxtTestId}
          type="secondary"
          label="Cheque"
          isDisabled={true}
          styles={buttonStyles.base}
        />
      </Flex>
      <Flex flexDir={"row"} mt="20%" justifyContent={"flex-start"}>
        <StyledButton
          onPress={backBtnCallback}
          type="secondary"
          size={"slim"}
          testID={stringConstants.RefundScreen.BackBtnTestID}
          label="Back"
          isDisabled={false}
          styles={buttonStyles.backButton}
        />
      </Flex>

      <CardTransactionFailedModal
        description={pinPadErrorDescription}
        id={pinPadErrorId}
        onClose={acknowledgedPinPadErrorBtn}
      />

      <PinPadModal
        isVisible={isProcessing && !pinPadError}
        modalHeaderTitle={stringConstants.pinPadModalTitle}
        headerText={paymentProcessMsg}
        actions={pedActions}
        pedActionHandler={pedActionHandler}
      />

      <CustomModal
        testID={stringConstants.printReceiptConfirmation}
        title={stringConstants.printReceiptConfirmation}
        primaryButtonProps={{
          label: stringConstants.Button.BTN_YES,
          testID: stringConstants.Button.BTN_YES,
          onPress: printReceipt,
        }}
        secondaryButtonProps={{
          label: stringConstants.Button.BTN_NO,
          testID: stringConstants.Button.BTN_NO,
          onPress: closePrintConfirmationModal,
        }}
        isOpen={!isLoading && isReceiptModal}
      />
    </View>
  );
};
