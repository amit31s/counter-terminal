import { deleteFulfillmentData, storeFulfillmentData } from "@ct/utils";
import { createSlice } from "@reduxjs/toolkit";

export enum FulfillmentStatusEnum {
  NOT_INITIATED = "notInitiated",
  SUCCESS = "success",
  FAILED = "failed",
  SKIPPED = "skipped",
}

export interface FulFillmentItem {
  id: string;
  fulfillmentStatus: FulfillmentStatusEnum;
  error?: string;
}

export interface UpdateFulfillmentState {
  fulfillmentRequired: boolean;
  item: FulFillmentItem[];
  fulfillmentStatus: FulfillmentStatusEnum;
  deviceId: string;
}

const initialState: UpdateFulfillmentState = {
  fulfillmentRequired: false,
  item: [],
  fulfillmentStatus: FulfillmentStatusEnum.NOT_INITIATED,
  deviceId: "",
};

export interface UpdateFulfillment {
  item?: FulFillmentItem[];
  fulfillmentStatus?: FulfillmentStatusEnum;
  fulfillmentRequired?: boolean;
  deviceId: string;
}

interface IValue {
  payload: UpdateFulfillment;
}

export const slice = createSlice({
  name: "Fulfillment",
  initialState,
  reducers: {
    updateFulfillment: (state: UpdateFulfillmentState, value: IValue) => {
      if (value.payload?.item) {
        state.item = value.payload.item;
      }
      if (value.payload.fulfillmentStatus) {
        state.fulfillmentStatus = value.payload.fulfillmentStatus;
      }
      if (value.payload.fulfillmentRequired !== undefined) {
        state.fulfillmentRequired = value.payload.fulfillmentRequired;
      }
      state.deviceId = value.payload.deviceId;
      storeFulfillmentData(state);
    },
    resetFulfillment: (_state: UpdateFulfillmentState, value: IValue) => {
      deleteFulfillmentData(value.payload.deviceId);
      return initialState;
    },
  },
});

export const { updateFulfillment, resetFulfillment } = slice.actions;

export default slice.reducer;
