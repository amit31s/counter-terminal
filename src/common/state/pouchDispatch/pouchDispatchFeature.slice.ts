import { GetPouchDespatchResponseResponse } from "@ct/api/generator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InitialPouchDispatchState = {
  validatedData: GetPouchDespatchResponseResponse[];
  showAvailablePouches: boolean;
  failureCount: number;
  availablePouchData: GetPouchDespatchResponseResponse[];
};

export const initialpouchDispatchState: InitialPouchDispatchState = {
  validatedData: [],
  availablePouchData: [],
  showAvailablePouches: false,
  failureCount: 0,
};

export const slice = createSlice({
  name: "pouchDispatch",
  initialState: initialpouchDispatchState,
  reducers: {
    updateAvailablePouchData: (
      state: InitialPouchDispatchState,
      { payload }: PayloadAction<GetPouchDespatchResponseResponse[]>,
    ) => {
      state.availablePouchData = payload;
    },
    updateValidatedData: (
      state: InitialPouchDispatchState,
      value: PayloadAction<GetPouchDespatchResponseResponse[]>,
    ) => {
      state.validatedData = value.payload;
    },
    updateShowAvailablePouches: (
      state: InitialPouchDispatchState,
      value: PayloadAction<boolean>,
    ) => {
      state.showAvailablePouches = value.payload;
    },
    updateFailureCount: (state: InitialPouchDispatchState) => {
      state.failureCount = state.failureCount + 1;
    },
    resetFailureCount: (state: InitialPouchDispatchState) => {
      state.failureCount = 0;
    },
    resetPouchDispatchList: () => initialpouchDispatchState,
  },
});

export const {
  updateAvailablePouchData,
  updateValidatedData,
  updateShowAvailablePouches,
  resetPouchDispatchList,
  updateFailureCount,
  resetFailureCount,
} = slice.actions;
export default slice.reducer;
