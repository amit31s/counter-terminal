import { STORAGE_KEYS } from "@ct/common/enums";
import { STATE_CONSTANTS } from "@ct/constants";
import { JOURNEY_CONSTANT } from "@ct/constants/JourneyConstant";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { preUpdateBasket, preUpdateBasketResult, setItem } from "@ct/utils";
import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { defaultBasketData } from "../initialStateData";
import { loadNbitBasket } from "./asyncThunk/basketAsyncThunk";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";

export enum CommitStatus {
  success = "success",
  fail = "fail",
  notInitiated = "notInitiated",
  commitInitiated = "commitInitiated",
}

export type FulfillmentStatus =
  | "success"
  | "failure"
  | "pending"
  | "indeterminate"
  | "fulfillmentNotInitiated"
  | "fulfillmentInitiated"
  | "notRequired"
  | "fulfilledAndCalculated";

export interface IUpdateBasketState {
  selectedItem?: IbasketItem;
  items: IbasketItem[];
  customerToPay: number;
  postOfficeToPay: number;
  basketValue: number;
  fulfilledAmountToNbit: number;
  postOfficeTenderingAmount: number;
  basketId: string;
}

export const initialBasketState: IUpdateBasketState = defaultBasketData();

export type UpdateFulFillmentStatusValuePayload = {
  [key: string]: FulfillmentStatus;
};
interface updateCommitStatusValue {
  id: string | undefined;
  commitStatus: CommitStatus;
}
type updateFulFillmentStatusValue = {
  payload: UpdateFulFillmentStatusValuePayload;
};
const basketLogger = logManager(LOGGER_TYPE.basketLogger);

export const slice = createSlice({
  name: "basket",
  initialState: initialBasketState,
  reducers: {
    updateCommitStatus: (
      state: IUpdateBasketState,
      { payload }: PayloadAction<updateCommitStatusValue>,
    ) => {
      state.items = state.items.map((item) => {
        if (payload.id && item.id.includes(payload.id)) {
          item.commitStatus = payload.commitStatus;
        }
        return item;
      });
      // storing state to storage directly instead of redux-persist
      // because we need this state to compare with NBIT basket in createAsyncThunk
      setItem(STORAGE_KEYS.CTSTK0001, current(state));
    },
    updateFulFillmentStatus: (state: IUpdateBasketState, value: updateFulFillmentStatusValue) => {
      state.items = state.items.map((item) => {
        const id = item.id;
        if (id && value.payload.hasOwnProperty(id)) {
          item.fulFillmentStatus = value.payload[id];
        }
        if (
          item?.journeyData?.transaction?.tokens?.fulfilmentAction ===
            JOURNEY_CONSTANT.CASH_WITHDRAWL &&
          item.fulFillmentStatus === STATE_CONSTANTS.FULFILLMENT_SUCCESS
        ) {
          item.fulFillmentStatus = STATE_CONSTANTS.FULFILLED_AND_CALCULATED;
          state.postOfficeToPay += item.total;
        }
        return item;
      });
      // storing state to storage directly instead of redux-persist
      // because we need this state to compare with NBIT basket in createAsyncThunk
      setItem(STORAGE_KEYS.CTSTK0001, current(state));
    },
    updateBasket: (
      state: IUpdateBasketState,
      { payload }: PayloadAction<preUpdateBasketResult>,
    ) => {
      const { basketValue, customerToPay, postOfficeTenderingAmount, items } = payload;
      state.selectedItem = state.items[0];
      state.basketValue = basketValue;
      state.items = items;
      state.customerToPay = customerToPay;
      state.postOfficeTenderingAmount = postOfficeTenderingAmount;
    },
    setSelectedItem: (stage: IUpdateBasketState, { payload }: PayloadAction<IbasketItem>) => {
      stage.selectedItem = payload;
    },
    resetBasket: () => initialBasketState,
  },
  extraReducers: (builder) => {
    builder.addCase(loadNbitBasket.pending, (_state, _action) => {
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.loadNbitBasketPending,
        message: BASKET_PROCESS_LOGS_MSG.loadBasketPending,
      });
    });
    builder.addCase(loadNbitBasket.fulfilled, (state, { payload }) => {
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.loadNbitBasketFulfilled,
        message: BASKET_PROCESS_LOGS_MSG.loadBasketSuccess,
        data: {
          payload,
        },
      });
      if (!payload) {
        return;
      }
      state.fulfilledAmountToNbit = payload.fulfilledAmountToNbit;
      state.basketId = payload.basketId;
      slice.caseReducers.updateBasket(state, {
        payload: preUpdateBasket(payload.entries),
        type: "",
      });
    });
    builder.addCase(loadNbitBasket.rejected, (_, action) => {
      basketLogger.error({
        methodName: BASKET_PROCESS_LOGS_FN.loadNbitBasketRejected,
        message: BASKET_PROCESS_LOGS_MSG.loadBasketFailed,
        error: action.error as Error,
      });
    });
  },
});

export const {
  updateBasket,
  resetBasket,
  updateCommitStatus,
  updateFulFillmentStatus,
  setSelectedItem,
} = slice.actions;

export default slice.reducer;
