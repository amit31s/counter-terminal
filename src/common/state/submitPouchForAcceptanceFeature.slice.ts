import { createSlice } from "@reduxjs/toolkit";

interface IPayload {
  submitted: boolean;
  msg: string;
}
export interface ScannedPouchAcceptanceState {
  time: number;
  submitted: boolean;
  msg: string;
}

const initialState: ScannedPouchAcceptanceState = {
  msg: "",
  time: 0,
  submitted: false,
};

interface Ivalue {
  payload: IPayload;
}

export const slice = createSlice({
  name: "updateSubmitPouchForAcceptance",
  initialState,
  reducers: {
    updateSubmitPouchForAcceptance: (state: ScannedPouchAcceptanceState, value: Ivalue) => {
      state.time = +new Date();
      state.submitted = value.payload.submitted;
      state.msg = value.payload.msg;
    },
    reset: () => initialState,
  },
});

export const { updateSubmitPouchForAcceptance, reset } = slice.actions;

export default slice.reducer;
