import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LabelFulfilmentStage = "NOT_REQUESTED" | "INITIATED" | "SUCCESSFUL" | "FAILED";

export type LabelFulfilmentState = {
  stage: LabelFulfilmentStage;
};

const initialState: LabelFulfilmentState = {
  stage: "NOT_REQUESTED",
};

export const slice = createSlice({
  name: "labelFulfilment",
  initialState,
  reducers: {
    updateLabelFulfilmentState: (
      _: LabelFulfilmentState,
      { payload }: PayloadAction<LabelFulfilmentState>,
    ) => payload,
    setLabelFulfilmentStage: (
      state: LabelFulfilmentState,
      { payload }: PayloadAction<LabelFulfilmentStage>,
    ) => {
      state.stage = payload;
    },
    resetLabelFulfilmentState: () => initialState,
  },
});

export const { updateLabelFulfilmentState, setLabelFulfilmentStage, resetLabelFulfilmentState } =
  slice.actions;

export default slice.reducer;
