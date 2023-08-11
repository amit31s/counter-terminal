import { createSlice } from "@reduxjs/toolkit";
import { FulfillerResponse } from "postoffice-commit-and-fulfill";

export type FulfillerResponseInternal = Omit<FulfillerResponse, "result"> & {
  result?: Record<string, unknown>;
};

export interface UpdateFulfillmentErrorState {
  uuid?: string | undefined;
  errorResponse: FulfillerResponseInternal;
}

const initialState: UpdateFulfillmentErrorState = {
  uuid: "",
  errorResponse: {},
};

export interface UpdateFulfillmentError {
  uuid: string | undefined;
  errorResponse: FulfillerResponseInternal;
}

interface IValue {
  payload: UpdateFulfillmentError;
}

export const slice = createSlice({
  name: "fulfillmentError",
  initialState,
  reducers: {
    updateFulfillmentError: (state: UpdateFulfillmentErrorState, value: IValue) => {
      if (value.payload?.errorResponse) {
        state.errorResponse = value.payload?.errorResponse;
      }
      if (value.payload?.uuid) {
        state.uuid = value.payload.uuid;
      }
    },
    resetFulfillmentError: () => initialState,
  },
});

export const { updateFulfillmentError, resetFulfillmentError } = slice.actions;

export default slice.reducer;
