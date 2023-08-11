import { createSlice } from "@reduxjs/toolkit";

export interface IState {
  time: number;
  upClicked: boolean;
  disableUpClick: boolean;
  disableDownClick: boolean;
  downClicked: boolean;
}

const initialState: IState = {
  time: 0,
  upClicked: false,
  downClicked: false,
  disableUpClick: false,
  disableDownClick: false,
};

interface IValue {
  payload: {
    upClicked?: IState["upClicked"];
    downClicked?: IState["downClicked"];
    disableUpClick?: IState["disableUpClick"];
    disableDownClick?: IState["disableDownClick"];
  };
}

export const slice = createSlice({
  name: "updateUpDownArrow",
  initialState,
  reducers: {
    updateUpDownArrow: (state: IState, value: IValue) => {
      if (typeof value.payload.upClicked === "boolean") {
        state.upClicked = value.payload.upClicked;
      }
      if (typeof value.payload.downClicked === "boolean") {
        state.downClicked = value.payload.downClicked;
      }
      if (typeof value.payload.disableUpClick === "boolean") {
        state.disableUpClick = value.payload.disableUpClick;
      }
      if (typeof value.payload.disableDownClick === "boolean") {
        state.disableDownClick = value.payload.disableDownClick;
      }
      state.time = +new Date();
    },
    resetUpDownArrow: () => initialState,
  },
});

export const { updateUpDownArrow, resetUpDownArrow } = slice.actions;

export default slice.reducer;
