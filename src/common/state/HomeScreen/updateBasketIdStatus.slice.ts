import { createSlice } from "@reduxjs/toolkit";

const initialState: UpdateBasketIdStatus = {
  basketId: "",
  isBasketOpened: false,
  time: 0,
  closeBasketFailed: false,
  basketClosed: false,
  errorCode: "",
};

export interface UpdateBasketIdStatus {
  basketId?: string;
  isBasketOpened?: boolean;
  closeBasketFailed?: boolean;
  basketClosed?: boolean;
  time?: number;
  errorCode?: string;
}

interface IValue {
  payload: UpdateBasketIdStatus;
}

export const basketIdStatusSlice = createSlice({
  name: "basketIdStatus",
  initialState,
  reducers: {
    updateBasketIdStatus: (state: UpdateBasketIdStatus, value: IValue) => {
      if (value?.payload?.isBasketOpened !== undefined) {
        state.isBasketOpened = value?.payload?.isBasketOpened;
      }

      if (value?.payload?.closeBasketFailed !== undefined) {
        state.closeBasketFailed = value?.payload?.closeBasketFailed;
      }

      if (value?.payload?.basketId) {
        state.basketId = value.payload.basketId;
      }

      if (value?.payload?.errorCode) {
        state.errorCode = value?.payload?.errorCode;
      }

      if (value?.payload?.basketClosed !== undefined) {
        state.basketClosed = value?.payload?.basketClosed;
      }

      state.time = +new Date();
    },
    resetBasketIdStatus: () => initialState,
  },
});

export const { updateBasketIdStatus, resetBasketIdStatus } = basketIdStatusSlice.actions;

export default basketIdStatusSlice.reducer;
