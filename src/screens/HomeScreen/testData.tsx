const basketCalc = [
  { id: "subtotal", text: "Sub Total", total: 93.6 },
  { id: "vat", text: "VAT", total: "0" },
  { id: "total", text: "TOTAL", total: 93.6 },
];

const basketItems = [
  { id: "1105E5405FE163940791601907160925284ef8", item: ["a"], price: 4.5, qty: "1", total: 4.5 },
  { id: "1105E5405FE1639474195987fba9a9af3465e", item: ["b"], price: 89.1, qty: "1", total: 89.1 },
];

export const basketData = {
  item: basketItems,
  calc: basketCalc,
};
const itemMock = [
  {
    entryID: "143",
    id: "Balance Enquiry HSBC16436388941714f7a8b745adcd",
    item: ["Card Balance Enquiry HSBC", "banking"],
    price: "10",
    quantity: "1",
    total: "10",
    voidable: "true",
    cardAllowed: true,
  },
  {
    entryID: "143",
    id: "1Balance Enquiry HSBC16436388941714f7a8b745adcd1",
    item: ["Bill Payment", "banking"],
    price: "10",
    quantity: "1",
    total: "10",
    voidable: "true",
    cardAllowed: false,
  },
];
const calcMock = [
  {
    id: "subtotal",
    text: "Sub Total",
    total: 20,
  },
  {
    id: "vat",
    text: "VAT",
    total: "0",
  },
  {
    id: "total",
    text: "TOTALp",
    total: 20,
  },
];

export const modifiedBasketDataMock = {
  item: itemMock,
  calc: calcMock,
};

const ids = {
  emptyBasket: "emptyBasket",
  notEmptyBasket: "notEmptyBasket",
  QuickTenderingBtn0: "TotalPayment",
  QuickTenderingBtn1: "5Pound",
  QuickTenderingBtn2: "10Pound",
  QuickTenderingBtn3: "20Pound",
  Card: "card",
  Cash: "Cash",
  Cheque: "Cheque",
  NumPad: "NumPad",
  LeftBottomBtn: "LeftBottomBtn",
  TenderingView: "TenderingView",
  PJEView: "PJEView",
  paymentSuccessView: "paymentSuccessView",
  paymentBtn: "paymentBtn",
  completeBtn: "completeBtn",
  tenderingComponent: "tenderingComponent",
  suspendBasket: "suspendBasket",
  recallBasket: "recallBasket",
};

export { basketItems, ids, basketCalc };
