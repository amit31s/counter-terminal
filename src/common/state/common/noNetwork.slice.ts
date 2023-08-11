import { createSlice } from "@reduxjs/toolkit";
export interface NoNetworkInitialState {
  isVisible: boolean;
  isVisibleNetworkRestored: boolean;
}

const noNetworkInitialState: NoNetworkInitialState = {
  isVisible: false,
  isVisibleNetworkRestored: false,
};

export const slice = createSlice({
  name: "noNetwork",
  initialState: noNetworkInitialState,
  reducers: {
    showNoNetworkModal: (state: NoNetworkInitialState) => {
      state.isVisible = true;
      state.isVisibleNetworkRestored = false;
    },
    hideNoNetworkModal: (state: NoNetworkInitialState) => {
      state.isVisible = false;
    },
    showNetworkRestoredModal: (state: NoNetworkInitialState) => {
      state.isVisibleNetworkRestored = true;
      state.isVisible = false;
    },
    hideNetworkRestoredModal: (state: NoNetworkInitialState) => {
      state.isVisibleNetworkRestored = false;
    },
  },
});

export const {
  showNoNetworkModal,
  hideNoNetworkModal,
  showNetworkRestoredModal,
  hideNetworkRestoredModal,
} = slice.actions;

export default slice.reducer;
