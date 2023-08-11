import { BasketClosedBasketState, useGetLastBasketHook } from "@ct/api/generator";
import { cashItemID } from "@ct/common";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { STORAGE_KEYS } from "@ct/common/enums";
import { EntryType, IbasketItem } from "@ct/interfaces/basket.interface";
import { calculateAdditionalItemsValue, getItem, penceToPound, setItem } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PEDFulfillerActions } from "postoffice-commit-and-fulfill";
import { CommitStatus, FulfillmentStatus } from "../updateBasket.slice";
import { FulfillmentStatusEnum } from "../updateFulfillment.slice";

type LoadNbitBasket = {
  branchID: string;
  nodeID: number;
};

export const loadNbitBasket = createAsyncThunk(
  "basket/loadNbitBasket",
  async ({ branchID, nodeID }: LoadNbitBasket) => {
    const basketLogger = logManager(LOGGER_TYPE.basketLogger);
    const getLastBasket = useGetLastBasketHook();
    const localBasket = getItem(STORAGE_KEYS.CTSTK0001);
    const nbitBasket = await getLastBasket(branchID, nodeID);

    if (localBasket) {
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.loadNbitBasket,
        data: {
          localBasket,
        },
        message: BASKET_PROCESS_LOGS_MSG.retrievedLocalBasket,
      });
    }
    if (
      !nbitBasket.basket.basketCore.NumberOfEntries ||
      nbitBasket.basket.basketCore.basketState === BasketClosedBasketState.BKC
    ) {
      return;
    }
    const basketId = nbitBasket?.basket?.basketCore?.basketID;
    if (!basketId) {
      return;
    }
    const entries: IbasketItem[] = [];
    let fulfilledAmountToNbit = 0;
    let cashDeposit = 0;
    let cashWithdrawal = 0;

    for (const entry of nbitBasket.entries) {
      const quantity = entry.entryCore?.quantity ?? 0;
      const valueInPence = entry.entryCore?.valueInPence ?? 0;
      const price = quantity > 1 && valueInPence > 0 ? valueInPence / quantity : valueInPence;
      const fulfilmentAction = entry.entryCore?.tokens?.fulfilmentAction;
      const fulfilmentState = entry.fulfilment?.fulfilmentState;
      const itemID = entry.entryCore?.itemID;

      const isPaymentEntry =
        (fulfilmentAction === PEDFulfillerActions.Debit &&
          fulfilmentState === FulfillmentStatusEnum.SUCCESS) ||
        itemID === cashItemID;

      if (isPaymentEntry) {
        fulfilledAmountToNbit += penceToPound(Math.abs(valueInPence));
      } else if (
        fulfilmentAction === PEDFulfillerActions.CashDeposit &&
        fulfilmentState === FulfillmentStatusEnum.SUCCESS
      ) {
        cashDeposit += penceToPound(Math.abs(valueInPence));
      } else if (
        fulfilmentAction === PEDFulfillerActions.CashWithdrawal &&
        fulfilmentState === FulfillmentStatusEnum.SUCCESS
      ) {
        cashWithdrawal += penceToPound(Math.abs(valueInPence));
      }
      const entryObj: IbasketItem = {
        id: entry.entryCore?.itemDescription + crypto.randomUUID(),
        name: entry.entryCore?.itemDescription,
        commitStatus: CommitStatus.success,
        fulFillmentStatus: fulfilmentState as FulfillmentStatus,
        total: penceToPound(valueInPence),
        quantity,
        price: penceToPound(price),
        source: "nbit",
        additionalItemsValue: calculateAdditionalItemsValue(entry.entryCore?.additionalItems ?? []),
        journeyData: {
          transaction: {
            additionalItems: entry.entryCore?.additionalItems,
            entryID: entry?.entryID,
            itemID: itemID,
            tokens: {
              itemDescription: entry.entryCore?.itemDescription,
              fulfilmentAction: fulfilmentAction,
              fulfilmentType: entry.fulfilmentType,
              methodOfPayment: entry.entryCore?.tokens?.methodOfPayment,
            },
          },
        },
      };
      if (isPaymentEntry) {
        entryObj.type = EntryType.paymentMode;
      }
      entries.push(entryObj);
    }

    fulfilledAmountToNbit = fulfilledAmountToNbit - cashDeposit - cashWithdrawal;
    if (fulfilledAmountToNbit) {
      fulfilledAmountToNbit = Number(fulfilledAmountToNbit.toFixed(2));
    }
    setItem(STORAGE_KEYS.CTSTK0002, "n");
    return { entries, fulfilledAmountToNbit, cashDeposit, basketId };
  },
);
