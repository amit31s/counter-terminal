import { createSlice } from "@reduxjs/toolkit";

export interface IState {
  isVisible: boolean;
}

const initialState: IState = {
  isVisible: false,
};

interface IValue {
  payload: IState;
}

export const slice = createSlice({
  name: "updateSuspendBasketNotification",
  initialState,
  reducers: {
    updateSuspendBasketNotification: (state: IState, value: IValue) => {
      state.isVisible = value.payload.isVisible;
    },
    resetFlag: () => initialState,
  },
});

export const { updateSuspendBasketNotification, resetFlag } = slice.actions;

export default slice.reducer;
