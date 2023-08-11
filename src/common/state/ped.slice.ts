import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface IPedState {
  initialised: boolean;
}

const initialState: IPedState = {
  initialised: false,
};

export const slice = createSlice({
  name: "ped",
  initialState,
  reducers: {
    updateInitialisationStatus: (state: IPedState, value: PayloadAction<IPedState>) => {
      state.initialised = value.payload.initialised;
    },
    resetPedState: () => initialState,
  },
});

export const { updateInitialisationStatus, resetPedState } = slice.actions;

export default slice.reducer;
