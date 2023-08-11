import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ILabelPrinterState {
  labelPrinter1SerialNo?: string;
  labelPrinter2SerialNo?: string;
}

const initialState: ILabelPrinterState = {
  labelPrinter1SerialNo: "",
  labelPrinter2SerialNo: "",
};

export const slice = createSlice({
  name: "labelPrinter",
  initialState,
  reducers: {
    updateLabel1SerialNo: (state: ILabelPrinterState, value: PayloadAction<ILabelPrinterState>) => {
      state.labelPrinter1SerialNo = value.payload.labelPrinter1SerialNo;
    },
    updateLabel2SerialNo: (state: ILabelPrinterState, value: PayloadAction<ILabelPrinterState>) => {
      state.labelPrinter2SerialNo = value.payload.labelPrinter2SerialNo;
    },
    resetState: () => initialState,
  },
});

export const { updateLabel1SerialNo, updateLabel2SerialNo, resetState } = slice.actions;

export default slice.reducer;
