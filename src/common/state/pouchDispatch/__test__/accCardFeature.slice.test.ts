import reducer, {
  resetAccFailureCount,
  resetAccSlice,
  ScannedAccCardState,
  updateAccCard,
  updateAccFailureCount,
} from "../accCardFeature.slice";

const mockUpdateState: ScannedAccCardState = {
  barcode: "test-barcode",
  scanned: true,
  failureCount: 10,
};
const mockInitialState: ScannedAccCardState = {
  barcode: "",
  scanned: false,
  failureCount: 0,
};

describe("render accCardFeature slice", () => {
  test("test accCardFeature and resetAccSlice", () => {
    const updateAction = updateAccCard(mockUpdateState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.barcode).toBe("test-barcode");

    const action = resetAccSlice();
    const result = reducer(mockInitialState, action);
    expect(result.barcode).toBe("");
  });

  test("test updateAccFailureCount and resetAccFailureCount", () => {
    const updateAction = updateAccFailureCount();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.failureCount).toBe(1);

    const action = resetAccFailureCount();
    const result = reducer(mockInitialState, action);
    expect(result.failureCount).toBe(0);
  });
});
