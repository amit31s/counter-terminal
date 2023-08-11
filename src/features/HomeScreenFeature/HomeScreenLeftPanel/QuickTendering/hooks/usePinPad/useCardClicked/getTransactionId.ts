import {
  Client,
  TransactionIdResponse,
  TransactionTypes,
} from "postoffice-product-journey-api-clients";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { API_LOGS_FN, API_LOGS_MSG } from "@ct/common/constants/APILogs";
import { logManager } from "@pol/frontend-logger-web";

export default async function getTransactionId(paymentsBankingClient: Client) {
  const apiLogger = logManager(LOGGER_TYPE.apiLogger);
  try {
    const transactionIdResult = (await paymentsBankingClient.getTransactionId({
      type: TransactionTypes.Payments,
    })) as TransactionIdResponse;

    return transactionIdResult?.transactionId;
  } catch (error) {
    apiLogger.fatal({
      methodName: API_LOGS_FN.getTransactionId,
      error: API_LOGS_MSG.unableToGetTransactionID,
    });
    throw API_LOGS_MSG.unableToGetTransactionID;
  }
}
