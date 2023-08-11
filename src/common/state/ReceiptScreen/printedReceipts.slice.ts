import { uuid } from "@ct/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PrintedReceipt = {
  id: string;
  templateId: string;
  context: Record<string, unknown>;
  printTimestamp: number;
};

export type PrintedReceipts = PrintedReceipt[];

const initialState: PrintedReceipts = [];
const receiptLifetime = 30 * 60 * 1000;

export const slice = createSlice({
  name: "printedReceipts",
  initialState,
  reducers: {
    resetPrintedReceipts: () => initialState,
    updatePrintedReceipts: (_: PrintedReceipts, { payload }: PayloadAction<PrintedReceipts>) =>
      payload,
    purgeOutdatedReceipts: (state: PrintedReceipts) => {
      const timestamp = (Date.now() - receiptLifetime) / 1000;
      return state.filter(({ printTimestamp }) => printTimestamp >= timestamp);
    },
    pushNewReceipt: (
      state: PrintedReceipts,
      {
        payload: { templateId, context },
      }: PayloadAction<Omit<PrintedReceipt, "id" | "printTimestamp">>,
    ) => {
      state.push({
        id: uuid(),
        templateId,
        context,
        printTimestamp: Date.now() / 1000,
      });
    },
  },
});

export const {
  purgeOutdatedReceipts,
  updatePrintedReceipts,
  resetPrintedReceipts,
  pushNewReceipt,
} = slice.actions;

export default slice.reducer;
