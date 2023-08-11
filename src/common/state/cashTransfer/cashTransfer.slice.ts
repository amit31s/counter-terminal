import { AssociationListItems } from "@ct/api/generator";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type CashLocation = Partial<AssociationListItems> & {
  entityType: string;
};

export interface InitialStateCashTransfer {
  selectedItem: CashLocation;
  transferred: boolean;
}

const initialState: InitialStateCashTransfer = {
  selectedItem: { entityType: "" },
  transferred: false,
};

export const slice = createSlice({
  name: "cashTransfer",
  initialState,
  reducers: {
    setSelectedCashLocation: (
      state: InitialStateCashTransfer,
      { payload }: PayloadAction<CashLocation>,
    ) => {
      state.selectedItem = payload;
    },
    setCashTransferred: (state: InitialStateCashTransfer) => {
      state.transferred = true;
    },
    resetCashTransferred: (state: InitialStateCashTransfer) => {
      state.transferred = false;
    },
    resetCashTransfer: () => initialState,
  },
});

export const {
  setSelectedCashLocation,
  setCashTransferred,
  resetCashTransferred,
  resetCashTransfer,
} = slice.actions;

export default slice.reducer;
