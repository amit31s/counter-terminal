import { createSlice } from "@reduxjs/toolkit";

export type SalesItem = {
  itemTitle: string;
  qty: number;
  price: string;
  total: string;
};

export type SalesReceiptData = {
  isSuccessReceipt?: boolean;
  isFailureReceipt?: boolean;
  isCardReceipt?: boolean;
  branchAddress?: string;
  fadCode?: string;
  vatRegNo?: string;
  DateOfIssue?: string;
  sessionId?: string;
  items?: SalesItem[];
  customerToPay?: string;
  postOfficeToPay?: string;
  amountPaidByCard?: string;
  amountPaidByCash?: string;
  balance?: string;
  empName?: string;
  cardDetails?: string[];
  recieptType?: "success" | "failure" | "";
};

const initialState: SalesReceiptData = {
  items: [],
};

interface IValue {
  payload: SalesReceiptData;
}

export const slice = createSlice({
  name: "updateSalesReceipt",
  initialState,
  reducers: {
    updateSalesReceipt: (state: SalesReceiptData, value: IValue) => {
      if (value.payload.recieptType) {
        state.recieptType = value.payload.recieptType;
      }
      if (value.payload.DateOfIssue) {
        state.DateOfIssue = value.payload.DateOfIssue;
      }
      if (value.payload.fadCode) {
        state.fadCode = value.payload.fadCode;
      }
      if (value.payload.vatRegNo) {
        state.vatRegNo = value.payload.vatRegNo;
      }
      if (value.payload.branchAddress) {
        state.branchAddress = value.payload.branchAddress;
      }
      if (value.payload.amountPaidByCard) {
        state.amountPaidByCard = value.payload.amountPaidByCard;
      }
      if (value.payload.amountPaidByCash) {
        state.amountPaidByCash = value.payload.amountPaidByCash;
      }
      if (value.payload.balance) {
        state.balance = value.payload.balance;
      }
      if (value.payload.cardDetails) {
        state.cardDetails = value.payload.cardDetails;
      }
      if (value.payload.customerToPay) {
        state.customerToPay = value.payload.customerToPay;
      }
      if (value.payload.empName) {
        state.empName = value.payload.empName;
      }
      if (value.payload.isFailureReceipt) {
        state.isFailureReceipt = value.payload.isFailureReceipt;
      }
      if (value.payload.isSuccessReceipt) {
        state.isSuccessReceipt = value.payload.isSuccessReceipt;
      }
      if (value.payload.isCardReceipt) {
        state.isCardReceipt = value.payload.isCardReceipt;
      }
      if (value.payload.items) {
        state.items = value.payload.items;
      }
      if (value.payload.postOfficeToPay) {
        state.postOfficeToPay = value.payload.postOfficeToPay;
      }
      if (value.payload.sessionId) {
        state.sessionId = value.payload.sessionId;
      }
    },
    resetSalesReceipt: () => initialState,
  },
});

export const { updateSalesReceipt, resetSalesReceipt } = slice.actions;

export default slice.reducer;
