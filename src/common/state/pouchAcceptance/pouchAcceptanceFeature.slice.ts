import { PouchAcceptanceDetails } from "@ct/api/generator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PouchAcceptanceState {
  data: PouchAcceptanceDetails | null;
  validatedData: PouchAcceptanceDetails[];
  showAvailablePouches: boolean;
  availablePouchData: PouchAcceptanceDetails[];
}

const initialState: PouchAcceptanceState = {
  data: null,
  validatedData: [],
  availablePouchData: [],
  showAvailablePouches: false,
};

const slice = createSlice({
  name: "pouchAcceptanceList",
  initialState,
  reducers: {
    setShowAvailablePouches: (state: PouchAcceptanceState, value: PayloadAction<boolean>) => {
      state.showAvailablePouches = value.payload;
    },
    setAvailablePouchData: (
      state: PouchAcceptanceState,
      value: PayloadAction<PouchAcceptanceDetails[]>,
    ) => {
      state.availablePouchData = value.payload;
    },
    setValidatedData: (
      state: PouchAcceptanceState,
      value: PayloadAction<PouchAcceptanceDetails[]>,
    ) => {
      state.validatedData = value.payload;
    },
    setZerovaluePouch: (
      state: PouchAcceptanceState,
      value: PayloadAction<PouchAcceptanceDetails | null>,
    ) => {
      state.data = value.payload;
    },
    resetPouchAcceptanceList: () => initialState,
  },
});

export const {
  setShowAvailablePouches,
  setAvailablePouchData,
  setValidatedData,
  resetPouchAcceptanceList,
  setZerovaluePouch,
} = slice.actions;

export default slice.reducer;
