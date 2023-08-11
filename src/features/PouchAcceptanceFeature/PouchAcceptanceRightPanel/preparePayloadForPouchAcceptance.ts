import { AdditionalItem, Item, PouchAcceptanceDetails, TransferCore } from "@ct/api/generator";
import { getStockUnitIdentifier } from "@ct/common";
import { APP_CONSTANTS } from "@ct/constants";
import { getAdditionalItems } from "@ct/utils";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { APP_LOGS_FN, APP_LOGS_MSG, APP_LOGS_VARS } from "@ct/common/constants/AppLogger";

type PayloadType = "acceptance" | "despatch";

const appLogger = logManager(LOGGER_TYPE.applicationLogger);

const valueBasedOnPouchType = (type: PayloadType, value: number) => {
  const isAcceptance = type === "acceptance";

  if (isAcceptance) {
    return -Math.abs(value);
  }
  return Math.abs(value);
};

const prepareAdditionalItems = (
  additionalItems: Item[] | undefined,
  type: PayloadType,
): AdditionalItem[] | undefined => {
  if (Array.isArray(additionalItems) && additionalItems.length) {
    return additionalItems.map((item: Item | undefined) => {
      return {
        itemID: item?.itemID?.toString() ?? "",
        valueInPence: valueBasedOnPouchType(type, item?.itemValue ?? 0),
        quantity: valueBasedOnPouchType(type, item?.itemQuantity ?? 0),
        tokens: {
          denominationValue: item?.denomination,
          currencyCode: item?.currency,
          materialType: item?.materialType,
        },
      };
    });
  }
  appLogger.info({
    methodName: APP_LOGS_FN.prepareAdditionalItems,
    message: APP_LOGS_MSG.additionalItemNotRec,
  });
  return;
};

const validatePouchPayloadBeforeSubmit = (pouch: PouchAcceptanceDetails): boolean => {
  if (!pouch?.totalValue) {
    appLogger.info({
      methodName: APP_LOGS_FN.validatePouchPayloadBeforeSubmit,
      message: APP_LOGS_VARS.valueNotReceived("totalValue"),
    });
    return true;
  }
  if (!pouch?.assignedBranchID) {
    appLogger.info({
      methodName: APP_LOGS_FN.validatePouchPayloadBeforeSubmit,
      message: APP_LOGS_VARS.valueNotReceived("assignedBranchID"),
    });
    return true;
  }
  if (!pouch?.pouchType) {
    appLogger.error({
      methodName: APP_LOGS_FN.validatePouchPayloadBeforeSubmit,
      message: APP_LOGS_VARS.valueNotReceived("pouchType"),
      error: APP_LOGS_VARS.valueNotReceived("pouchType"),
    });
    return true;
  }
  if (!pouch?.pouchID) {
    appLogger.error({
      methodName: APP_LOGS_FN.validatePouchPayloadBeforeSubmit,
      message: APP_LOGS_VARS.valueNotReceived("pouchID"),
      error: Error(APP_LOGS_VARS.valueNotReceived("pouchID")),
    });
    return true;
  }
  if (!pouch?.itemID) {
    appLogger.error({
      methodName: APP_LOGS_FN.validatePouchPayloadBeforeSubmit,
      message: APP_LOGS_VARS.valueNotReceived("itemID"),
      error: Error(APP_LOGS_VARS.valueNotReceived("itemID")),
    });
    return true;
  }

  return false;
};

export const validateAndPreparePayloadForPouchAcceptance = (
  pouch: PouchAcceptanceDetails,
  fadCode: string,
  type: PayloadType,
): TransferCore | undefined => {
  const additionalItems = prepareAdditionalItems(getAdditionalItems(pouch.items), type);

  if (!additionalItems) {
    return;
  }
  const isInvalid = validatePouchPayloadBeforeSubmit(pouch);
  if (isInvalid) {
    return;
  }
  const isAcceptance = type === "acceptance";

  return {
    id: `${pouch.pouchID}#${type}`,
    stockunitIdentifier: getStockUnitIdentifier(),
    accountReferenceID: pouch.pouchID,
    quantity: isAcceptance ? 1 : -1,
    valueInPence: isAcceptance ? Math.abs(pouch.totalValue ?? 0) : -Math.abs(pouch.totalValue ?? 0),
    additionalItems,
    itemID: pouch.itemID ?? "",
    transactionMode: isAcceptance ? APP_CONSTANTS.CONST0002 : APP_CONSTANTS.CONST0008,
    fadCode,
    tokens: {
      assignedBranchID: pouch.assignedBranchID,
      pouchType: pouch.pouchType,
      pouchBarcode: pouch.pouchID,
      userName: pouch?.updatedBy?.userName ?? "",
    },
  };
};
