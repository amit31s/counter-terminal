import {
  getBasket,
  getBasketIdStatus,
  getStockUnitIdentifier,
  RootState,
  useAppSelector,
} from "@ct/common";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import {
  PrepareContext,
  prepareContextAndPrintReceipt,
  prepareSpoiltLabelContext,
  SpoiltLabelContext,
  prepareCharityReceipt,
  CharityLabelContext,
} from "postoffice-prepare-receipt-context";
import { useCallback } from "react";

export const usePrintOnCloseBasket = () => {
  const { basketId } = useAppSelector(getBasketIdStatus);
  const {
    device: { branchID, branchName, branchPostcode, branchAddress, deviceType, nodeID },
  } = useAppSelector((rootState: RootState) => rootState.auth);
  const { successItems } = useAppSelector(getBasket);
  const { printReceipt } = useReceiptService();
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);

  return useCallback(async () => {
    try {
      if (!basketId) {
        return;
      }
      const charityData = (await prepareCharityReceipt({
        branchID,
        branchName,
        branchPostcode,
        basketID: basketId,
        basketItems: successItems,
        branchAddress,
        deviceType,
        nodeID,
      })) as CharityLabelContext;
      if (charityData && Object.keys(charityData).length > 0) {
        await printReceipt({
          template: charityData.templateId,
          context: { item: charityData.context[charityData.context.length - 1] },
        });
      }

      const copData = (await prepareContextAndPrintReceipt(
        branchID,
        branchName,
        branchPostcode,
        basketId,
        successItems,
      )) as PrepareContext;
      if (copData && Object.keys(copData).length > 0) {
        await printReceipt({
          template: copData.templateId,
          context: copData.context,
        });
      }

      const stockUnit = getStockUnitIdentifier();
      const spoiltLabelData = (await prepareSpoiltLabelContext({
        branchID: branchID,
        branchName: branchName,
        branchPostcode: branchPostcode,
        basketID: basketId as string,
        stockUnit,
        basketItems: successItems,
      })) as SpoiltLabelContext;
      if (spoiltLabelData && Object.keys(spoiltLabelData).length > 0) {
        await printReceipt({
          template: spoiltLabelData.templateId,
          context: spoiltLabelData.context,
        });
      }
    } catch (err) {
      appLogger.error({
        methodName: "usePrintOnCloseBasket",
        error: err as Error,
      });
    }
  }, [
    appLogger,
    basketId,
    branchAddress,
    branchID,
    branchName,
    branchPostcode,
    deviceType,
    nodeID,
    printReceipt,
    successItems,
  ]);
};
