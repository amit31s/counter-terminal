import { useGetBasketHook, useGetTransactionsHook } from "@ct/api/generator";
import { API_LOGS_FN, API_LOGS_MSG } from "@ct/common/constants/APILogs";
import { useGetUser } from "@ct/common/hooks/useGetUser";
import { DeviceAttributes } from "@ct/interfaces/device.interface";
import { priceToRender } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";

type RefundPayload = {
  RequestUDID: string;
  itemID: string;
  quantity: number;
  entryID: number;
  valueInPence: number;
  total: string;
  productDescription: string;
  transactionID: string;
  valueInPound?: string;
  entryType: string;
  existingReversalAllowed: string;
};

const getPriceOfSingleIteam = (valueInPence = 0, quantity = 0): number => {
  return valueInPence / quantity;
};

export const useGetTransactionsForRefundJourney = () => {
  const { device }: { device: DeviceAttributes } = useGetUser();
  const apiLogger = logManager(LOGGER_TYPE.apiLogger);

  const getBasket = useGetBasketHook();
  const getTransactions = useGetTransactionsHook();

  const basketTransactions = async (basketId: string) => {
    if (!device?.branchID) {
      apiLogger.info({
        methodName: API_LOGS_FN.basketTransactions,
        message: API_LOGS_MSG.fadCodeNotFound,
      });
      return [];
    }
    let basketData;
    try {
      basketData = await getBasket(basketId);
    } catch (error) {
      apiLogger.fatal({
        methodName: API_LOGS_FN.basketTransactions,
        error: error as Error,
      });
    }
    const from = basketData?.basket?.BasketCreatedTime ?? 0;
    const to = basketData?.basket?.BasketClosedTime ?? 0; // 204
    if (!basketData) {
      apiLogger.info({
        methodName: API_LOGS_FN.basketTransactions,
        message: API_LOGS_MSG.fromToGetBasketAPI,
        data: basketData,
      });
      return [];
    }
    if (!from || !to) {
      apiLogger.info({
        methodName: API_LOGS_FN.basketTransactions,
        message: API_LOGS_MSG.fromToGetBasketAPI,
        data: basketData,
      });
      return [];
    }

    let data;
    try {
      data = await getTransactions(device.branchID, from, to, { BasketID: basketId });
    } catch (error) {
      apiLogger.error({
        methodName: API_LOGS_FN.getTransactions,
        error: error as Error,
      });
    }
    const entries = basketData?.entries ?? [];
    const transactions = data?.Transactions ?? [];

    const refundPayload: RefundPayload[] = [];
    const newTxnData = entries.filter((entry) => {
      return entry.entryCore?.tokens?.existingReversalAllowed === "Y";
    });

    newTxnData.forEach((entry) => {
      if (!entry?.entryCore) {
        return;
      }
      const txDetail = transactions.find(
        (transaction) => transaction.itemID === entry.entryCore?.itemID,
      );
      const priceOfSingleItem = entry.entryCore?.valueInPence / entry.entryCore?.quantity;
      // use line 76 condition based on TransactionID response
      if (txDetail) {
        refundPayload.push({
          RequestUDID: entry.RequestUDID ?? "",
          itemID: entry.entryCore?.itemID ?? "",
          productDescription: entry.entryCore?.tokens?.productDescription ?? "",
          quantity: entry.entryCore?.quantity ?? "",
          entryID: entry.entryCore?.entryID ?? "",
          entryType: entry?.entryCore?.tokens?.itemType ?? "",
          existingReversalAllowed: "N",
          valueInPound: priceToRender(priceOfSingleItem),
          valueInPence: getPriceOfSingleIteam(
            entry.entryCore?.valueInPence,
            entry.entryCore?.quantity,
          ),
          total: priceToRender(priceOfSingleItem * entry.entryCore?.quantity),
          transactionID: txDetail?.TransactionID ?? "",
        });
      }
    });

    return refundPayload;
  };

  return { basketTransactions };
};
