import { createSlice } from "@reduxjs/toolkit";

export interface ScannedAccCardState {
  count: number;
  time: number;
}

const initialState: ScannedAccCardState = {
  count: 0,
  time: 0,
};

export const slice = createSlice({
  name: "countToShowAvailablePouchListToDispatch",
  initialState,
  reducers: {
    updateCountToShowAvailablePouchListToDispatch: (state: ScannedAccCardState) => {
      state.count = ++state.count;
      state.time = +new Date();
    },
    reset: () => initialState,
  },
});

export const { updateCountToShowAvailablePouchListToDispatch, reset } = slice.actions;

export default slice.reducer;
