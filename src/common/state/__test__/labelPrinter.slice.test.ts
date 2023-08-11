import reducer, {
  ILabelPrinterState,
  resetState,
  updateLabel1SerialNo,
  updateLabel2SerialNo,
} from "../labelPrinter.slice";

const mockILabelPrinterState: ILabelPrinterState = {
  labelPrinter1SerialNo: "test-printer-serial-no1",
  labelPrinter2SerialNo: "test-printer-serial-no2",
};
const mockInitialState: ILabelPrinterState = {
  labelPrinter1SerialNo: "",
  labelPrinter2SerialNo: "",
};

describe("render label printer slice", () => {
  test("test updateLabel1SerialNo and resetState", () => {
    const updateAction = updateLabel1SerialNo(mockILabelPrinterState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.labelPrinter1SerialNo).toBe("test-printer-serial-no1");

    const action = resetState();
    const result = reducer(mockInitialState, action);
    expect(result.labelPrinter1SerialNo).toBe("");
  });

  test("test updateLabel2SerialNo and resetState", () => {
    const updateAction = updateLabel2SerialNo(mockILabelPrinterState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.labelPrinter2SerialNo).toBe("test-printer-serial-no2");

    const action = resetState();
    const result = reducer(mockInitialState, action);
    expect(result.labelPrinter2SerialNo).toBe("");
  });
});
