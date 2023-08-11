import { multipleOf } from "@ct/common/helpers/validation";
import { intToFloat } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { IngenicoPedClient } from "postoffice-peripheral-management-service";
import {
  Client,
  PaymentSettlementTypes,
  TransactionModes,
} from "postoffice-product-journey-api-clients";
import { PED_LOGS_FN, PED_LOGS_MSG, PED_LOGS_VARS } from "@ct/common/constants/PEDLogs";

export default async function checkRefData(
  paymentsBankingClient: Client,
  pan: string,
  cardPaymentAmountUpdated: number,
  isRepayMode: boolean,
  pinPad: IngenicoPedClient,
  transactionId: string,
) {
  const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

  const doAbort = async () => {
    try {
      await pinPad.abort(transactionId);
    } catch (error) {
      pmsLogger.fatal({
        methodName: PED_LOGS_FN.processCardPayment,
        message: PED_LOGS_MSG.errorAbortCardPayment,
        data: error,
      });
    }
  };

  const referenceDataCheck = await paymentsBankingClient.paymentTokeniserLookup({
    maskedPan: pan,
    settlementType: PaymentSettlementTypes.Sale,
    transactionMode: isRepayMode ? TransactionModes.Refund : TransactionModes.Sale,
  });
  pmsLogger.info({
    methodName: PED_LOGS_FN.processCardPayment,
    message: PED_LOGS_VARS.amountUpdated(cardPaymentAmountUpdated),
    data: referenceDataCheck,
  });
  const { item } = referenceDataCheck;

  if (!item || !item.itemID) {
    doAbort();
    throw PED_LOGS_MSG.cardNotSupportedByCounter;
  }

  if (item?.maximumValue) {
    const maximumValue = Number(item.maximumValue);
    const minimumValue = Number(item.minimumValue);
    const multipleOfValue = Number(item.multipleValue);
    if (cardPaymentAmountUpdated > maximumValue && !isRepayMode) {
      pmsLogger.info({
        methodName: PED_LOGS_FN.processCardPayment,
        message: PED_LOGS_VARS.amountCardValidation(
          intToFloat(cardPaymentAmountUpdated),
          intToFloat(maximumValue),
          intToFloat(minimumValue),
          intToFloat(multipleOfValue),
        ),
      });

      doAbort();

      throw PED_LOGS_VARS.amountCardValidation(
        intToFloat(cardPaymentAmountUpdated),
        intToFloat(maximumValue),
        intToFloat(minimumValue),
        intToFloat(multipleOfValue),
      );
    }
  }

  if (item?.multipleValue) {
    const refMultipleOfValue = Number(item.multipleValue);
    const errorMessage = PED_LOGS_VARS.cardAmountMultipleOf(refMultipleOfValue);
    if (!multipleOf(cardPaymentAmountUpdated, refMultipleOfValue)) {
      doAbort();

      pmsLogger.error({
        methodName: PED_LOGS_FN.processCardPayment,
        message: errorMessage,
      });
      throw errorMessage;
    }
  }

  return referenceDataCheck;
}
