import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { JourneyInputData } from "postoffice-spm-journey-engine/dist/typescript/src/template/inputData";

export const mockBsktData = [
  { id: "subtotal", text: "Sub Total", total: 345.67 },
  { id: "vat", text: "VAT", total: 0 },
  { id: "total", text: "TOTAL", total: 345.67 },
  { id: "cash", text: "CASH", total: 0 },
  { id: "card", text: "Card", total: 0 },
  { id: "balanceDue", text: "Balance Due", total: 345.67 },
];

export const basketItemsArray: IbasketItem[] = [
  {
    id: "QL13123",
    item: ["Return to Carrier"],
    quantity: 1,
    total: 0,
    voidable: false,
    price: 0,
    commitStatus: CommitStatus.success,
    fulFillmentStatus: "success",
    source: "local",
    additionalItemsValue: 0,
  },
  {
    id: "TW12313123",
    item: ["Return To Carrier"],
    quantity: 1,
    total: 0,
    voidable: false,
    price: 0,
    commitStatus: CommitStatus.success,
    fulFillmentStatus: "success",
    source: "local",
    additionalItemsValue: 0,
  },
];

export const mockBasketDataList: JourneyInputData = {
  transaction: {
    transactionStartTime: "924234234",
    itemID: "wfefe",
    quantity: "1",
    entryID: "234243",
    valueInPence: "0",
  },
  basketDataList: [
    {
      basket: {
        id: "Return to Carrier TW121234567890 ",
      },
      transaction: {
        entryType: "mails",
        itemID: "47026",
        quantity: "1",
        receiptLine: "1",
        transactionStartTime: "NEED_TO_IMPLEMENT",
        valueInPence: "0",
        NumberOfItems: "1",
      },
    },
    {
      basket: {
        id: "Return to Carrier QL125436711OF ",
      },
      transaction: {
        entryType: "mails",
        itemID: "47026",
        quantity: "1",
        receiptLine: "1",
        transactionStartTime: "NEED_TO_IMPLEMENT",
        valueInPence: "0",
        NumberOfItems: "1",
      },
    },
  ],
};

export const newMockBasketDataList: JourneyInputData = {
  transaction: {
    transactionStartTime: "924234234",
    itemID: "wfefe",
    quantity: "1",
    entryID: "234243",
    valueInPence: "10",
  },
  basketDataList: [
    {
      basket: {
        id: "Return to Carrier TW121234567890 ",
      },
      transaction: {
        entryType: "mails",
        itemID: "47026",
        journeyType: "refund",
        quantity: "10",
        receiptLine: "1",
        transactionStartTime: "NEED_TO_IMPLEMENT",
        valueInPence: "1000",
        NumberOfItems: "1",
      },
    },
  ],
};
