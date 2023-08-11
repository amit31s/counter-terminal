import { cashPaymentPayload } from "@ct/common";
import { useAppSelector } from "@ct/common/hooks";
import { getPaymentStatus } from "@ct/common/selectors";
import { CommitStatus, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { TxStatus } from "@ct/common/state/HomeScreen/updatePaymentStatus.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { poundToPence, preUpdateBasket, transactionApiClient } from "@ct/utils";
import { cloneDeep } from "lodash";
import { BasketItemPayload, CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import { useAppDispatch } from "../useAppDispatch";

const isValidItemToCommit = (item: IbasketItem) =>
  item.journeyData &&
  (item.commitStatus === STATE_CONSTANTS.NOTINITIATED ||
    item.commitStatus === STATE_CONSTANTS.FAIL);

export const isValidAggregatedItem = (
  isBeforeCommit: boolean,
  commitAndFulfillPoint: CommitAndFulfillPointEnum,
  price: number,
) => {
  return isBeforeCommit
    ? commitAndFulfillPoint === CommitAndFulfillPointEnum.Immediate ||
        (price <= 0 && commitAndFulfillPoint !== CommitAndFulfillPointEnum.Aggregated)
    : commitAndFulfillPoint === CommitAndFulfillPointEnum.Aggregated ||
        (price > 0 && commitAndFulfillPoint !== CommitAndFulfillPointEnum.Immediate);
};

export const calculatedPrice = (
  isPreparedData: boolean,
  transactionData: BasketItemPayload,
  itemPrice: number,
) => {
  let price = isPreparedData
    ? Number(transactionData?.valueInPence ?? itemPrice)
    : Number(transactionData?.valueInPence ?? itemPrice * 100);
  for (const additionalItem of transactionData?.additionalItems ?? []) {
    price += Number(additionalItem.valueInPence);
  }
  return price;
};

export const constructedItem = (basketItem: IbasketItem, entryCount: number) => {
  if (basketItem.commitStatus !== CommitStatus.commitInitiated) {
    basketItem.commitStatus = CommitStatus.commitInitiated;
  }
  if (basketItem.fulFillmentStatus !== STATE_CONSTANTS.FULFILLMENT_INITIATED) {
    basketItem.fulFillmentStatus = STATE_CONSTANTS.FULFILLMENT_INITIATED;
  }
  if (basketItem?.journeyData?.transaction && !basketItem?.journeyData?.transaction?.entryID) {
    basketItem.journeyData.transaction.entryID = entryCount;
    entryCount++;
  }
  return { basketItem, entryCount };
};

const uncommittedAggregatedItems = (basketItems: IbasketItem[]) => {
  const items = basketItems.filter((item) => {
    const transactionData = item.journeyData?.transaction;
    const price = calculatedPrice(false, transactionData, item.price);
    return (
      isValidAggregatedItem(false, transactionData?.commitAndFulfillPoint, price) &&
      isValidItemToCommit(item)
    );
  });
  return {
    count: items.length,
    items: cloneDeep(items),
  };
};

export const useGetBasketItemToCommit = () => {
  const { paidByCash, paidByCheque, paidByIRC } = useAppSelector(getPaymentStatus);
  const dispatch = useAppDispatch();
  const txApi = transactionApiClient();

  const prepareData = (
    basketItems: IbasketItem[],
    txStatus: TxStatus | undefined,
    paidAmount?: number,
  ) => {
    const basketItemsToCommitBeforePayment: IbasketItem[] = [];
    const basketItemsToCommitAfterPayment: IbasketItem[] = [];
    let basketItemsToCommit: IbasketItem[] = [];
    for (const item of basketItems) {
      if (!isValidItemToCommit(item)) {
        continue;
      }
      const transactionData = item.journeyData?.transaction;
      const price = calculatedPrice(true, transactionData, item.price);
      if (isValidAggregatedItem(true, transactionData?.commitAndFulfillPoint, price)) {
        basketItemsToCommitBeforePayment.push(item);
      }
      if (isValidAggregatedItem(false, transactionData?.commitAndFulfillPoint, price)) {
        basketItemsToCommitAfterPayment.push(item);
      }
    }

    if ((paidByCash || paidByCheque || paidByIRC) && txStatus === "completed") {
      // cash payment
      basketItemsToCommit = [
        ...basketItemsToCommitBeforePayment,
        ...basketItemsToCommitAfterPayment,
      ];
    } else if (txStatus === "completed" && paidAmount) {
      // card payment
      basketItemsToCommit = [
        ...basketItemsToCommitBeforePayment,
        ...basketItemsToCommitAfterPayment,
      ];
    } else {
      basketItemsToCommit = basketItemsToCommitBeforePayment;
    }
    return basketItemsToCommit;
  };

  const getDataToCommit = async (
    basketItems: IbasketItem[],
    txStatus: TxStatus | undefined,
    paidAmount: number,
  ) => {
    const basketItemsClone = cloneDeep(basketItems);
    const preparedData = prepareData(basketItemsClone, txStatus, paidAmount);

    if (!preparedData.length) {
      return;
    }

    const numberOfEntries = await txApi.getNumberOfEntries();

    // using numberOfEntries === undefined instead of !numberOfEntries
    // because numberOfEntries can be 0 for first basket
    if (numberOfEntries === undefined) {
      return;
    }
    const ids = preparedData.map((item) => item.id);
    let entryID = numberOfEntries ? numberOfEntries + 1 : 1;
    const data = basketItemsClone.map((item) => {
      if (!ids.includes(item.id)) {
        return item;
      }
      const { basketItem, entryCount } = constructedItem(item, entryID);
      entryID = entryCount;
      basketItem.journeyData.transaction.valueInPence = poundToPence(basketItem.total);
      return basketItem;
    });

    dispatch(updateBasket(preUpdateBasket(data)));
    const filteredBasketItems: BasketItemPayload[] = preparedData.reduce((result, item) => {
      if (item?.journeyData?.transaction) {
        result.push({
          ...item?.journeyData?.transaction,
          ...(item?.journeyData?.fulfilment && {
            fulfilment: item?.journeyData?.fulfilment,
          }),
        } as BasketItemPayload);
      }
      return result;
    }, [] as BasketItemPayload[]);
    return filteredBasketItems;
  };

  const getAggregatedItemsToCommit = async (basketItems: IbasketItem[]) => {
    const basketItemsClone = cloneDeep(basketItems);

    const { count, items } = uncommittedAggregatedItems(basketItemsClone);
    if (!count) {
      return;
    }
    const numberOfEntries = await txApi.getNumberOfEntries();
    // using numberOfEntries === undefined instead of !numberOfEntries
    // because numberOfEntries can be 0 for first basket
    if (numberOfEntries === undefined) {
      return;
    }

    let entryID = numberOfEntries ? numberOfEntries + 1 : 1;

    for (const item of items) {
      const { entryCount } = constructedItem(item, entryID);
      entryID = entryCount;
    }
    const basketItemCopy = [...basketItemsClone];
    for (let index = 0; index < basketItemCopy.length; index++) {
      const element = basketItemCopy[index];
      const aggregatedItem = items.find((item) => item.id === element.id);
      if (aggregatedItem) {
        basketItemCopy[index] = aggregatedItem;
      }
    }
    dispatch(updateBasket(preUpdateBasket(basketItemCopy)));
    return items
      .filter((item) => item?.journeyData?.transaction)
      .map((item) => {
        return item?.journeyData?.transaction as BasketItemPayload;
      });
  };

  const getCardEntryToCommit = async (
    cardEntry: IbasketItem,
    basketItems: IbasketItem[],
  ): Promise<BasketItemPayload | undefined> => {
    const numberOfEntries = await txApi.getNumberOfEntries();

    // using numberOfEntries === undefined instead of !numberOfEntries
    // because numberOfEntries can be 0 for first basket
    if (numberOfEntries === undefined) {
      return;
    }

    const entryID = numberOfEntries ? numberOfEntries + 1 : 1;

    const { basketItem } = constructedItem(cardEntry, entryID);

    basketItems.push(basketItem);
    dispatch(updateBasket(preUpdateBasket(basketItems)));
    return basketItem?.journeyData?.transaction;
  };

  const getTenderAmountToCommit = async (item: IbasketItem) => {
    const numberOfEntries = await txApi.getNumberOfEntries();
    const commitTenderAmount = item.price;
    // using numberOfEntries === undefined instead of !numberOfEntries
    // because numberOfEntries can be 0 for first basket
    if (numberOfEntries === undefined) {
      return;
    }
    const entryID = numberOfEntries ? numberOfEntries + 1 : 1;
    const payload = await cashPaymentPayload(
      commitTenderAmount,
      entryID,
      STATE_CONSTANTS.CASH_TENDER_RECEIVED_AMOUNT,
      item.journeyData?.transaction?.journeyType,
    );
    const payloadToCommit: BasketItemPayload[] = [];
    if (payload) {
      payloadToCommit.push(payload);
    }
    return payloadToCommit;
  };

  return {
    getDataToCommit,
    getAggregatedItemsToCommit,
    getTenderAmountToCommit,
    getCardEntryToCommit,
  };
};
