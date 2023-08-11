import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Popup {
  None,
  Item,
  Basket,
}

export type VoidStatus = {
  activePopup: Popup;
};

const initialState: VoidStatus = {
  activePopup: Popup.None,
};

export const slice = createSlice({
  name: "updateVoidStatus",
  initialState,
  reducers: {
    updateActivePopup: (state: VoidStatus, { payload: activePopup }: PayloadAction<Popup>) => {
      state.activePopup = activePopup;
    },
    resetVoidStatus: () => initialState,
  },
});

export const { updateActivePopup, resetVoidStatus } = slice.actions;

export default slice.reducer;
