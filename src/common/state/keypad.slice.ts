import { KEYPAD_BUTTON_DISPATCH_THRESHOLD } from "@ct/constants/KeypadConstants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayoutRectangle } from "react-native";

export interface KeypadSlice {
  buttonSize: LayoutRectangle;
}

export const initialState: KeypadSlice = {
  buttonSize: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

export const slice = createSlice({
  name: "keypad",
  initialState,
  reducers: {
    // TODO: Investigate - Shouldn't need to explicitly type state below. Something's going wrong here
    setButtonSize: (state: KeypadSlice, action: PayloadAction<LayoutRectangle>) => {
      // Below code checks whether the width difference is greater than the threshold before updating state. This is to prevent jitter
      const difference = Math.abs(state.buttonSize.width - action.payload.width);
      if (difference < KEYPAD_BUTTON_DISPATCH_THRESHOLD) {
        return;
      }
      state.buttonSize = action.payload;
    },
  },
});

export const { setButtonSize } = slice.actions;

export default slice.reducer;
