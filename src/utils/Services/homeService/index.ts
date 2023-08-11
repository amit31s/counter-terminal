import { getProductByProdNo, getStockUnitIdentifier } from "@ct/common";
import { generateBackOfficeURL } from "@ct/common/backOfficeUrl";
import { BASKET_PROCESS_LOGS_FN } from "@ct/common/constants/BasketLogs";
import { ERROR } from "@ct/common/enums";
import { envProvider } from "@ct/common/platformHelper";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { UpdateFulfillment } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { APP_CONFIG } from "@ct/configs";
import { STATE_CONSTANTS } from "@ct/constants";
import * as homeInterface from "@ct/interfaces/HomeInterface";
import {
  IInternalJourneyData,
  IbasketItem,
  PrepareBasketItemData,
  SuspendBasket,
} from "@ct/interfaces/basket.interface";
import { isNetworkError, openUrl, penceToPound, uuid } from "@ct/utils";
import { getItem, removeItem, setItem } from "@ct/utils/Storage";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { AdditionalItem, BasketItemPayload } from "postoffice-commit-and-fulfill";
import { Alert } from "react-native";

const suspendedBasketKey = "suspendedBasketId";
const basketLogger = logManager(LOGGER_TYPE.basketLogger);

const getTitle = (data: IInternalJourneyData) =>
  data?.basket?.title ? data.basket.title : data?.basket?.id;

export const pjeScreenBtn: homeInterface.IEnableDisableHomeScreenBtns = {
  logOff: true,
  lock: true,
  branchHub: true,
  more: true,
};

export const enableAllBtn: homeInterface.IEnableDisableHomeScreenBtns = {
  logOff: false,
  lock: false,
  branchHub: envProvider.REACT_APP_USING_ELECTRON !== "true",
  more: false,
};

export const tenderingScreenBtn: homeInterface.IEnableDisableHomeScreenBtns = {
  logOff: true,
  lock: true,
  branchHub: true,
  more: true,
};

export const lockBackOfficeDisabledBtn: homeInterface.IEnableDisableHomeScreenBtns = {
  logOff: false,
  lock: false,
  branchHub: false,
  more: false,
};

export const isNonVoidableItemInBasket = (basket: IbasketItem[]) => {
  for (let index = 0; index < basket.length; index++) {
    const element = basket[index];
    if (!element.voidable) {
      return true;
    }
  }

  return false;
};

export type preUpdateBasketResult = {
  basketValue: number;
  customerToPay: number;
  postOfficeTenderingAmount: number;
  items: Array<IbasketItem>;
};

export const preUpdateBasket = (items: Array<IbasketItem>): preUpdateBasketResult => {
  let basketValue = 0;
  let customerToPay = 0;
  let postOfficeTenderingAmount = 0;
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    const additionalItemsValue = element.additionalItemsValue ?? 0;
    const total = element.total + additionalItemsValue;
    basketValue += total;
    basketValue = Number(basketValue.toFixed(2));
    if (element.type === "paymentMode") continue;
    if (total > 0) {
      customerToPay += total;
    }
    if (total < 0) {
      postOfficeTenderingAmount += total;
    }
  }
  return { basketValue, customerToPay, postOfficeTenderingAmount, items };
};

export const calculateAdditionalItemsValue = (additionalItems: Array<AdditionalItem>): number => {
  let total = 0;
  if (!additionalItems || !additionalItems.length) {
    return 0;
  }
  for (const item of additionalItems) {
    total += item.valueInPence / 100;
  }
  return total;
};

const convertBasketFields = async (
  item: IInternalJourneyData,
  uniqueID: string,
): Promise<IbasketItem | undefined | ERROR.NETWORK_ERROR> => {
  try {
    let productName = item?.basket?.id;
    if (item?.transaction?.itemID) {
      const { itemType, existingReversalAllowed, longName } = await getProductByProdNo(
        item.transaction.itemID,
      );

      // Cover cases where basket.id is not provided for TA-2187
      productName = productName || longName;

      // Cover cases where additional item's itemDescription is not provided for TA-2187
      await Promise.all(
        item.transaction.additionalItems?.map(async (additionalItem: AdditionalItem) => {
          const { itemID, itemDescription } = additionalItem;
          if (!itemID || itemDescription) return;

          const { longName: additionalLongName } = await getProductByProdNo(itemID);
          if (typeof additionalLongName !== "string") return;
          additionalItem.itemDescription = additionalLongName;
        }) ?? [],
      );

      // Ensure stable itemDescription for TA-2189
      item.transaction.itemDescription = longName;
      item.transaction.tokens = {
        ...(item.transaction?.tokens ?? {}),
        itemType,
        existingReversalAllowed,
      };
    }

    item.transaction.stockunitIdentifier = await getStockUnitIdentifier();

    const valueInPence = item?.transaction?.valueInPence
      ? Number(item?.transaction?.valueInPence)
      : 0;

    const price = penceToPound(valueInPence);
    const quantity = Number(item?.transaction?.quantity ?? 1);
    const total = penceToPound(valueInPence * Math.abs(quantity));

    const savedItem: IbasketItem = {
      name: productName,
      id: productName + uniqueID,
      item: getTitle(item),
      total: total,
      voidable: item?.transaction?.voidable ? item?.transaction?.voidable === "true" : true,
      journeyData: item,
      commitStatus: CommitStatus.notInitiated,
      fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_INITIATED,
      quantity,
      source: "local",
      price,
      additionalItemsValue: calculateAdditionalItemsValue(item.transaction?.additionalItems),
      stockunitIdentifier: item.transaction.stockunitIdentifier,
    };
    return savedItem;
  } catch (e) {
    basketLogger.error({
      methodName: BASKET_PROCESS_LOGS_FN.convertBasketFields,
      error: e as Error,
      data: item,
    });
    if (isNetworkError(e)) {
      return ERROR.NETWORK_ERROR;
    }
    return;
  }
};

const modifyInitialJourneyData = (
  data: IInternalJourneyData,
  uniqueID: string,
): IInternalJourneyData => {
  if ("basketDataList" in data && data.basketDataList?.length) {
    data?.basketDataList?.forEach(
      (item: { transaction: Partial<BasketItemPayload> }, index: number) => {
        item.transaction.uniqueID = uniqueID;
        item.transaction.transactionStartTime = new Date().getTime() + index;
        item.transaction.originalQuantity = "" + item.transaction.quantity;
      },
    );
    return data;
  }
  data.transaction.uniqueID = uniqueID;
  data.transaction.transactionStartTime = new Date().getTime();

  return data;
};

export const prepareBasketItemData = async (
  initialData: IInternalJourneyData,
  basket: IbasketItem[],
): Promise<PrepareBasketItemData | ERROR.NETWORK_ERROR> => {
  const uniqueID = uuid();
  const data = modifyInitialJourneyData(initialData, uniqueID);
  const basketArray: IbasketItem[] = Object.assign([], basket);

  if ("basketDataList" in data && data.basketDataList?.length) {
    const items = await Promise.all(
      data.basketDataList.map(
        async (item: IbasketItem) =>
          await convertBasketFields(item as IInternalJourneyData, uniqueID),
      ),
    );
    items.forEach((savedItem) => {
      if (savedItem) {
        basketArray.push(savedItem);
      }
    });
    if (items.includes(ERROR.NETWORK_ERROR)) {
      return ERROR.NETWORK_ERROR;
    }
  } else {
    const savedItem = await convertBasketFields(data, uniqueID);
    if (savedItem === ERROR.NETWORK_ERROR) {
      return ERROR.NETWORK_ERROR;
    }
    if (savedItem) {
      basketArray.push(savedItem);
    }
  }

  return {
    basketArray,
  };
};

export const handleBackOfficeClick = async () => {
  try {
    openUrl(generateBackOfficeURL());
  } catch (e) {
    Alert.alert("Failed to open page");
  }
};

const fulfillmentStorageKey = (id: string) => `${id}fulfillment`;

export const storeFulfillmentData = async (data: UpdateFulfillment) => {
  if (data && data?.deviceId) {
    setItem(fulfillmentStorageKey(data.deviceId), JSON.stringify(data));
  }
};

export const deleteFulfillmentData = (deviceId: string) => {
  if (deviceId) {
    removeItem(fulfillmentStorageKey(deviceId));
  }
};

export const suspendBasket = async (basket: IbasketItem[]): Promise<boolean> => {
  try {
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} ${
      APP_CONFIG.SUSPEND_BASKET_EXPIRE_AT
    }`;
    const expireAt = Date.parse(dateStr);
    const dataToSuspend: SuspendBasket = {
      item: basket,
      time: +new Date(),
      expireAt,
    };
    await setItem(suspendedBasketKey, dataToSuspend);
    return true;
  } catch (error) {
    basketLogger.error({
      methodName: BASKET_PROCESS_LOGS_FN.suspendBasket,
      error: error as Error,
    });
    return false;
  }
};

export const getSuspendedBasket = () => {
  try {
    const data = getItem(suspendedBasketKey);
    if (data) {
      return JSON.parse(data) as SuspendBasket;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const clearSuspendedBasket = async () => {
  try {
    await removeItem(suspendedBasketKey);
    return true;
  } catch (error) {
    basketLogger.error({
      methodName: BASKET_PROCESS_LOGS_FN.clearSuspendedBasket,
      error: error as Error,
    });
    return false;
  }
};
