import { getProductByProdNo, getStockUnitIdentifier } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { EntryType, IbasketItem } from "@ct/interfaces/basket.interface";
import { poundToPence } from "@ct/utils";
import {
  BasketItemPayload,
  EntryCore,
  FallBackModeFlagEnum,
  RefundFlagEnum,
} from "postoffice-commit-and-fulfill";
import { PaymentTokeniserResult } from "postoffice-product-journey-api-clients";

export type GetAmountCommitPayloadType =
  | typeof STATE_CONSTANTS.CASH
  | typeof STATE_CONSTANTS.CHEQUE
  | typeof STATE_CONSTANTS.CASH_TENDER_RECEIVED_AMOUNT
  | typeof STATE_CONSTANTS.CASH_TENDER_TENDERED_AMOUNT;

const DEBIT_TRANSACTION_TYPE_ID = 91;
const REFUND_TRANSACTION_TYPE_ID = 92;

export const cashItemID = "1";
export const chequeItemID = "2";
export const ircItemID = "2952";

export async function cashPaymentPayload(
  value: number,
  entryID: number,
  type: GetAmountCommitPayloadType,
  journeyType: string,
): Promise<EntryCore> {
  const { longName, itemType, existingReversalAllowed } = await getProductByProdNo(cashItemID);

  const commitCashAmountPayload: BasketItemPayload = {
    quantity: journeyType === JOURNEYENUM.REFUND ? 1 : -1,
    entryID: entryID,
    valueInPence: poundToPence(value),
    transactionStartTime: new Date().getTime(),
    itemID: cashItemID,
    additionalItems: [],
    stockunitIdentifier: getStockUnitIdentifier(),
    methodOfDataCapture: 1,
    refundFlag: RefundFlagEnum.N,
    fallBackModeFlag: FallBackModeFlagEnum.N,
    uniqueID: type,
    itemDescription: String(longName),
    tokens: {
      entryID: entryID.toString(),
      productDescription: String(longName),
      itemType: String(itemType),
      existingReversalAllowed: String(existingReversalAllowed),
    },
  };

  if (commitCashAmountPayload.valueInPence > 0) {
    commitCashAmountPayload.quantity = Math.abs(commitCashAmountPayload.quantity);
  }

  return commitCashAmountPayload;
}

export async function chequePaymentPayload(
  value: number,
  entryID: number,
  type: GetAmountCommitPayloadType,
  journeyType: string,
): Promise<EntryCore> {
  const { mediumName, itemType, existingReversalAllowed } = await getProductByProdNo(chequeItemID);

  const commitChequeAmountPayload: BasketItemPayload = {
    quantity: journeyType === JOURNEYENUM.REFUND ? 1 : -1,
    entryID: entryID,
    valueInPence: poundToPence(value),
    transactionStartTime: new Date().getTime(),
    itemID: chequeItemID,
    additionalItems: [],
    stockunitIdentifier: getStockUnitIdentifier(),
    methodOfDataCapture: 1,
    refundFlag: RefundFlagEnum.N,
    fallBackModeFlag: FallBackModeFlagEnum.N,
    uniqueID: type,
    tokens: {
      entryID: entryID.toString(),
      productDescription: String(mediumName),
      itemType: String(itemType),
      existingReversalAllowed: String(existingReversalAllowed),
    },
  };

  if (commitChequeAmountPayload.valueInPence > 0) {
    commitChequeAmountPayload.quantity = Math.abs(commitChequeAmountPayload.quantity);
  }

  return commitChequeAmountPayload;
}

export const cardPaymentPayload = async (
  referenceDataCheck: PaymentTokeniserResult,
  obfuscatedPan: string,
  paymentId: string,
  cardPaymentAmount: number,
  transactionId: string,
  uniqueID: string,
  journeyType: string,
): Promise<IbasketItem> => {
  const itemID = referenceDataCheck?.item?.itemID ?? "";

  const { longName, mediumName, itemType, existingReversalAllowed } = await getProductByProdNo(
    itemID,
  );

  const isRefund = journeyType === JOURNEYENUM.REFUND;

  return {
    name: typeof mediumName === "string" ? mediumName || "Card Payment" : "Card Payment",
    id: itemID + uniqueID,
    commitStatus: CommitStatus.notInitiated,
    price: 0,
    total: cardPaymentAmount,
    type: EntryType.paymentMode,
    stockunitIdentifier: getStockUnitIdentifier(),
    journeyData: {
      basket: {
        id: mediumName,
      },
      transaction: {
        transactionStartTime: Math.floor(new Date().getTime() / 1000),
        uniqueID,
        itemID: referenceDataCheck?.item?.itemID,
        quantity: 1,
        entryType: "paymentMode",
        receiptLine: "1",
        quantityFixed: "true",
        itemDescription: longName,
        tokens: {
          amountRequested: poundToPence(cardPaymentAmount).toFixed(0),
          horizonTransactionID: transactionId,
          fulfilmentType: "PED",
          fulfilmentAction: isRefund ? "refund" : "debit",
          pan: obfuscatedPan,
          paymentId,
          responseCode: "WILL_COME_FROM_FULFILLMENT",
          transactionResultCode: "WILL_COME_FROM_FULFILLMENT",
          transactionType: (isRefund
            ? REFUND_TRANSACTION_TYPE_ID
            : DEBIT_TRANSACTION_TYPE_ID
          ).toString(),
          productDescription: longName,
          itemType,
          existingReversalAllowed,
        },
        valueInPence: poundToPence(cardPaymentAmount),
      },
    },
    additionalItemsValue: 0,
    quantity: 1,
    source: "local",
    fulFillmentStatus: "fulfillmentNotInitiated",
  };
};

export async function ircPaymentPayload(
  value: number,
  entryID: number,
  uniqueID: string,
): Promise<BasketItemPayload> {
  const { longName, itemType, existingReversalAllowed } = await getProductByProdNo(ircItemID);

  return {
    quantity: -1,
    entryID: entryID,
    valueInPence: poundToPence(value),
    transactionStartTime: new Date().getTime(),
    itemID: chequeItemID,
    additionalItems: [],
    stockunitIdentifier: getStockUnitIdentifier(),
    methodOfDataCapture: 1,
    refundFlag: RefundFlagEnum.N,
    fallBackModeFlag: FallBackModeFlagEnum.N,
    uniqueID,
    tokens: {
      entryID: entryID.toString(),
      productDescription: String(longName),
      itemType: String(itemType),
      existingReversalAllowed: String(existingReversalAllowed),
    },
  };
}
