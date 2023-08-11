import reducer, {
  IReceiptDataState,
  ReceiptStatus,
  resetReceiptData,
  updateReceiptData,
} from "../updateRecieptData.slice";

const mockInitialState: IReceiptDataState = {
  data: "",
  receiptStatus: ReceiptStatus.notStarted,
};

describe("render updateReceiptData", () => {
  test("test updateReceiptData and resetReceiptData", async () => {
    const action = updateReceiptData("test-data");
    const result = reducer(mockInitialState, action);
    expect(result.data).toBe("test-data");

    const resetAction = resetReceiptData();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.data).toBe("");
  });
});
