import { createSlice } from "@reduxjs/toolkit";

export interface IState {
  flag: boolean;
}

const initialState: IState = {
  flag: true,
};

interface IValue {
  payload: IState;
}

export const slice = createSlice({
  name: "updateNumpadFlagStatus",
  initialState,
  reducers: {
    updateNumpadFlagStatus: (state: IState, value: IValue) => {
      state.flag = value.payload.flag;
    },
    resetFlagStatus: () => initialState,
  },
});

export const { updateNumpadFlagStatus, resetFlagStatus } = slice.actions;

export default slice.reducer;
