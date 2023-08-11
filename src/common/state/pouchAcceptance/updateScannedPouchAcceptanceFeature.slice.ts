import { ReactQueryGetResponse } from "@ct/api";
import { PouchAcceptanceDetails } from "@ct/api/generator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IPayload = PayloadAction<
  ReactQueryGetResponse & {
    data: PouchAcceptanceDetails;
    barcode: string;
    duplicate?: boolean;
    time: number;
    msg?: string;
  }
>;

export interface ScannedPouchAcceptanceState {
  data: PouchAcceptanceDetails | null;
  error: null | Error;
  statusCode: number;
  isLoading: boolean;
  barcode: string;
  duplicate: boolean;
  time: number;
  failureCount: number;
  msg: string;
}

const initialState: ScannedPouchAcceptanceState = {
  msg: "",
  data: null,
  error: null,
  statusCode: 0,
  isLoading: false,
  barcode: "",
  duplicate: false,
  time: 0,
  failureCount: 0,
};

export const slice = createSlice({
  name: "updateScannedPouchForAcceptance",
  initialState,
  reducers: {
    updateScannedPouchForAcceptance: (state: ScannedPouchAcceptanceState, value: IPayload) => {
      state.data = value.payload.data;
      state.statusCode = value.payload.status;
      state.barcode = value.payload.barcode;
      if (value.payload.duplicate !== undefined) {
        state.duplicate = value.payload.duplicate;
      }
      state.time = +new Date();
      state.msg = value.payload.msg || "";
    },

    updateFailureCount: (state: ScannedPouchAcceptanceState) => {
      state.failureCount = state.failureCount + 1;
    },
    resetFailureCount: (state: ScannedPouchAcceptanceState) => {
      state.failureCount = 0;
    },
    resetScannedPouchForAcceptance: () => initialState,
  },
});

export const {
  updateScannedPouchForAcceptance,
  updateFailureCount,
  resetFailureCount,
  resetScannedPouchForAcceptance,
} = slice.actions;

export default slice.reducer;
