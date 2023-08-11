import { PED_LOGS_FN, PED_LOGS_MSG } from "@ct/common/constants/PEDLogs";
import { useAppDispatch, useAppSelector, useCheckInternet } from "@ct/common/hooks";
import { getBasket, getBasketIdStatus, getSalesReceipt } from "@ct/common/selectors";
import {
  ReceiptStatus,
  updateReceiptStatus,
} from "@ct/common/state/HomeScreen/updateRecieptData.slice";
import { pushNewReceipt } from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { SalesReceiptData, resetSalesReceipt } from "@ct/common/state/updateSalesReceipt.slice";
import { CustomModal } from "@ct/components";
import { TEXT, stringConstants } from "@ct/constants";
import { generateSalesReceiptContext } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { transactionApiClient } from "@ct/utils";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
export type SalesReceiptModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onPrintingFinished: () => void;
};

export default function SalesReceiptModal({
  isOpen,
  setIsOpen,
  onPrintingFinished,
}: SalesReceiptModalProps) {
  const dispatch = useAppDispatch();
  const { isOnline } = useCheckInternet();
  const receiptService = useReceiptService();
  const { device } = useAppSelector((rootState) => rootState.auth);
  const { basketId } = useAppSelector(getBasketIdStatus);
  const receiptData: SalesReceiptData = useAppSelector(getSalesReceipt);
  const { basketItems, absolutePostOfficeTenderingAmount, customerToPay, basketValue } =
    useAppSelector(getBasket);
  const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);
  const { getLastBasket } = transactionApiClient();

  const triggerPrintingReceipt = useCallback(
    async (doPhysicalPrint = true) => {
      try {
        const receiptCustomerToPay = Math.max(0, customerToPay - absolutePostOfficeTenderingAmount);
        const receiptPostOfficeToPay = Math.max(
          0,
          absolutePostOfficeTenderingAmount - customerToPay,
        );

        const context = await generateSalesReceiptContext(
          device,
          typeof basketId === "string" && basketId.length > 0
            ? basketId
            : (
                await getLastBasket()
              ).data.basket.basketCore.basketID,
          basketItems,
          Math.round(receiptCustomerToPay * 100),
          Math.round(receiptPostOfficeToPay * 100),
          Math.round(basketValue * 100),
          receiptData.cardDetails ?? [],
        );
        dispatch(pushNewReceipt({ templateId: "counter-terminal/sales-receipt", context }));
        if (doPhysicalPrint) {
          await receiptService.printReceipt({
            template: "counter-terminal/sales-receipt",
            context,
          });
        }
        dispatch(resetSalesReceipt());
        pmsLogger.info({
          methodName: PED_LOGS_FN.triggerPrintingReceipt,
          message: PED_LOGS_MSG.salesReceiptTriggered,
        });
      } catch (error) {
        pmsLogger.error({
          methodName: PED_LOGS_FN.triggerPrintingReceipt,
          error: error as Error,
        });
      }
    },
    [
      absolutePostOfficeTenderingAmount,
      pmsLogger,
      basketId,
      basketItems,
      basketValue,
      customerToPay,
      device,
      dispatch,
      getLastBasket,
      receiptData.cardDetails,
      receiptService,
    ],
  );

  const handleLoadingView = useCallback(
    (show: boolean) => {
      if (show) {
        dispatch(
          setLoadingActive({
            id: LoadingId.START_COMMIT,
            modalProps: { title: TEXT.CTTXT00064 },
          }),
        );
        return;
      }
      dispatch(setLoadingInactive(LoadingId.START_COMMIT));
    },
    [dispatch],
  );

  const printReceipt = useCallback(async () => {
    if (!isOpen) {
      return;
    }
    dispatch(updateReceiptStatus(ReceiptStatus.started));
    setIsOpen(false);
    handleLoadingView(true);
    try {
      if (basketItems.length) {
        await triggerPrintingReceipt();
        dispatch(updateReceiptStatus(ReceiptStatus.printed));
      }
    } catch (error) {
      pmsLogger.error({
        methodName: PED_LOGS_FN.printReceipt,
        logData: { component: "SalesReceiptModal" },
        error: error as string,
      });
    } finally {
      handleLoadingView(false);
      await onPrintingFinished();
    }
  }, [
    isOpen,
    dispatch,
    setIsOpen,
    handleLoadingView,
    basketItems.length,
    triggerPrintingReceipt,
    pmsLogger,
    onPrintingFinished,
  ]);

  const skipPrintingReceipt = useCallback(async () => {
    dispatch(updateReceiptStatus(ReceiptStatus.skiped));
    try {
      if (!isOpen) {
        return;
      }
      setIsOpen(false);
      handleLoadingView(true);
      if (basketItems.length) {
        await triggerPrintingReceipt(false);
      }
      await onPrintingFinished();
    } catch (error) {
      pmsLogger.error({
        methodName: PED_LOGS_FN.skipPrintingReceipt,
        logData: { component: "SalesReceiptModal" },
        error: error as string,
      });
    } finally {
      handleLoadingView(false);
    }
  }, [
    dispatch,
    isOpen,
    setIsOpen,
    handleLoadingView,
    basketItems.length,
    onPrintingFinished,
    triggerPrintingReceipt,
    pmsLogger,
  ]);

  useEffect(() => {
    if (!isOnline) {
      setIsOpen(false);
    }
  }, [isOnline, setIsOpen]);

  return (
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
        onPress: skipPrintingReceipt,
      }}
      isOpen={isOpen}
    />
  );
}
