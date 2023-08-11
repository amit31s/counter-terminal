import { CashTender } from "@ct/interfaces/basket.interface";
import { IPaymentDispatchPayload } from "@ct/interfaces/HomeInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultPaymentStatusData } from "../initialStateData";

export type TxStatus = "completed" | "";

export interface UpdatePaymentInitialStatus extends IPaymentDispatchPayload, CashTender {
  isRepayMode: boolean;
  time: number;
  paidByCash: number;
  paidByCard: number;
  deductAmount: boolean;
  cashTenderReceivedAmountTxCommited: boolean;
  cashTenderTenderedAmountTxCommited: boolean;
  txStatus: TxStatus;
}

const initialPaymentStatusState: UpdatePaymentInitialStatus = defaultPaymentStatusData();

interface IValue {
  payload: {
    cashPayment?: UpdatePaymentInitialStatus["cashPayment"];
    completed?: UpdatePaymentInitialStatus["completed"];
    deductAmount?: UpdatePaymentInitialStatus["deductAmount"];
    cashTenderReceivedAmount?: UpdatePaymentInitialStatus["cashTenderReceivedAmount"];
    cashTenderTenderedAmount?: UpdatePaymentInitialStatus["cashTenderTenderedAmount"];
    cashTenderReceivedAmountTxCommited?: UpdatePaymentInitialStatus["cashTenderReceivedAmountTxCommited"];
    cashTenderTenderedAmountTxCommited?: UpdatePaymentInitialStatus["cashTenderTenderedAmountTxCommited"];
    isRepayMode?: UpdatePaymentInitialStatus["isRepayMode"];
  };
}

export const updatePaymentStatusSlice = createSlice({
  name: "updatePaymentStatus",
  initialState: initialPaymentStatusState,
  reducers: {
    updatePaymentStatus: (state: UpdatePaymentInitialStatus, value: IValue) => {
      if (typeof value.payload.completed === "boolean") {
        state.completed = value.payload.completed;
      }

      if (typeof value.payload.deductAmount === "boolean") {
        state.deductAmount = value.payload.deductAmount;
      }

      if (value?.payload?.cashTenderReceivedAmount !== undefined) {
        state.cashTenderReceivedAmount = value.payload.cashTenderReceivedAmount;
      }
      if (value?.payload?.cashTenderTenderedAmount !== undefined) {
        state.cashTenderTenderedAmount = value.payload.cashTenderTenderedAmount;
      }
      if (value?.payload?.cashTenderReceivedAmountTxCommited !== undefined) {
        state.cashTenderReceivedAmountTxCommited = value.payload.cashTenderReceivedAmountTxCommited;
      }

      if (value?.payload?.cashTenderTenderedAmountTxCommited !== undefined) {
        state.cashTenderTenderedAmountTxCommited = value.payload.cashTenderTenderedAmountTxCommited;
      }
      state.time = +new Date();
    },
    updateTxStatus: (state: UpdatePaymentInitialStatus) => {
      state.txStatus = "completed";
    },
    updateCashPayment: (state: UpdatePaymentInitialStatus, amount: PayloadAction<number>) => {
      state.paidByCash = amount.payload;
    },
    updateCardPayment: (state: UpdatePaymentInitialStatus, amount: PayloadAction<number>) => {
      state.paidByCard += amount.payload;
    },
    setRepayModeStatus: (state: UpdatePaymentInitialStatus, amount: PayloadAction<boolean>) => {
      state.isRepayMode = amount.payload;
    },
    resetPaymentStatus: () => initialPaymentStatusState,
  },
});

export const {
  updatePaymentStatus,
  resetPaymentStatus,
  updateCardPayment,
  setRepayModeStatus,
  updateCashPayment,
  updateTxStatus,
} = updatePaymentStatusSlice.actions;

export default updatePaymentStatusSlice.reducer;
