import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum ReceiptStatus {
  notStarted = "notStarted",
  started = "started",
  skiped = "skiped",
  printed = "printed",
  failed = "failed",
}

export interface IReceiptDataState {
  data: string;
  receiptStatus: ReceiptStatus;
}

const initialState: IReceiptDataState = {
  data: "",
  receiptStatus: ReceiptStatus.notStarted,
};

export const slice = createSlice({
  name: "updateReceiptData",
  initialState,
  reducers: {
    updateReceiptData: (state: IReceiptDataState, { payload }: PayloadAction<string>) => {
      state.data = payload;
    },
    updateReceiptStatus: (state: IReceiptDataState, { payload }: PayloadAction<ReceiptStatus>) => {
      state.receiptStatus = payload;
    },
    resetReceiptData: () => initialState,
  },
});

export const { updateReceiptData, resetReceiptData, updateReceiptStatus } = slice.actions;

export default slice.reducer;
