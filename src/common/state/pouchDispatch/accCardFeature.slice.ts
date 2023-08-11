import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UpdateAccCardPayload {
  barcode: string;
  scanned: boolean;
}

export interface ScannedAccCardState extends UpdateAccCardPayload {
  failureCount: number;
}

const initialState: ScannedAccCardState = {
  barcode: "",
  scanned: false,
  failureCount: 0,
};

export const slice = createSlice({
  name: "updateAccCard",
  initialState,
  reducers: {
    updateAccCard: (state: ScannedAccCardState, value: PayloadAction<UpdateAccCardPayload>) => {
      state.barcode = value.payload.barcode;
      state.scanned = value.payload.scanned;
    },
    updateAccFailureCount: (state: ScannedAccCardState) => {
      state.failureCount += 1;
    },
    resetAccFailureCount: (state: ScannedAccCardState) => {
      state.failureCount = 0;
    },
    resetAccSlice: () => initialState,
  },
});

export const { updateAccCard, resetAccSlice, updateAccFailureCount, resetAccFailureCount } =
  slice.actions;

export default slice.reducer;
