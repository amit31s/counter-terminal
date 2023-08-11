import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TouchKeyboardState = {
  enabled: boolean;
};

export const initialState = {
  enabled: false,
};

export const slice = createSlice({
  name: "touchKeyboard",
  initialState,
  reducers: {
    setTouchKeyboardEnabled: (state, { payload }: PayloadAction<boolean>) => {
      state.enabled = payload;
    },
    toggleTouchKeyboardEnabled: (state) => {
      state.enabled = !state.enabled;
    },
  },
});

export const { setTouchKeyboardEnabled, toggleTouchKeyboardEnabled } = slice.actions;

export default slice.reducer;
