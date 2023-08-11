import { createSlice } from "@reduxjs/toolkit";

export type StateName = "home" | "tendering" | "completed" | "refund" | "repay";

export interface IState {
  stage: StateName;
  time: number;
  completeClicked: boolean;
}

const initialState: IState = {
  stage: "home",
  completeClicked: false,
  time: 0,
};

interface IValue {
  payload: {
    stage?: IState["stage"];
    completeClicked?: IState["completeClicked"];
  };
}

export const slice = createSlice({
  name: "updateHomeScreenStage",
  initialState,
  reducers: {
    updateHomeScreenStage: (state: IState, value: IValue) => {
      if (value.payload.stage) {
        state.stage = value.payload.stage;
      }
      if (value.payload.completeClicked !== undefined) {
        state.completeClicked = value.payload.completeClicked;
      }
      state.time = +new Date();
    },
    resetHomeScreenStage: () => initialState,
  },
});

export const { updateHomeScreenStage, resetHomeScreenStage } = slice.actions;

export default slice.reducer;
