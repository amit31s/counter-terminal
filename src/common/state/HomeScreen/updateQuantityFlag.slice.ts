import { createSlice } from "@reduxjs/toolkit";

export interface IState {
  flag: boolean;
}

const initialState: IState = {
  flag: false,
};

interface IValue {
  payload: IState;
}

export const slice = createSlice({
  name: "updateQuantityFlag",
  initialState,
  reducers: {
    updateQuantityFlag: (state: IState, value: IValue) => {
      state.flag = value.payload.flag;
    },

    hideUpdateQuantity: (state: IState) => {
      state.flag = false;
    },
    resetFlag: () => initialState,
  },
});

export const { updateQuantityFlag, hideUpdateQuantity, resetFlag } = slice.actions;

export default slice.reducer;
