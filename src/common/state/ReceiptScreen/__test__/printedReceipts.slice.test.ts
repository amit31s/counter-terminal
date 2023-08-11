import reducer, {
  PrintedReceipts,
  resetPrintedReceipts,
  updatePrintedReceipts,
} from "../printedReceipts.slice";
const mockUpdateState: PrintedReceipts = [
  {
    templateId: "counter-terminal/sales-receipt",
    context: { branchId: "test" },
    id: "test-id",
    printTimestamp: 12345,
  },
];
const mockInitialState: PrintedReceipts = [];

describe("render printedReceipts slice", () => {
  test("test resetPrintedReceipts", () => {
    const updateAction = updatePrintedReceipts(mockUpdateState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult[0].templateId).toBe("counter-terminal/sales-receipt");

    const action = resetPrintedReceipts();
    const result = reducer(mockInitialState, action);
    expect(result.length).toBe(0);
  });
});
