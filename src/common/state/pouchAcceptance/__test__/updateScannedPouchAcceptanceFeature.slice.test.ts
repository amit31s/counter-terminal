import reducer, {
  resetFailureCount,
  resetScannedPouchForAcceptance,
  ScannedPouchAcceptanceState,
  updateFailureCount,
  updateScannedPouchForAcceptance,
} from "../updateScannedPouchAcceptanceFeature.slice";

const mockInitialState: ScannedPouchAcceptanceState = {
  msg: "",
  data: null,
  error: null,
  statusCode: 0,
  isLoading: false,
  barcode: "",
  duplicate: false,
  time: 0,
  failureCount: 0,
};

describe("render updateScannedPouchForAcceptance slice", () => {
  test("test updateFailureCount and resetScannedPouchForAcceptance", () => {
    const updateAction = updateFailureCount();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.failureCount).toBe(1);

    const action = resetScannedPouchForAcceptance();
    const result = reducer(mockInitialState, action);
    expect(result.failureCount).toBe(0);
  });

  test("test updateFailureCount and resetFailureCount", () => {
    const updateAction = updateFailureCount();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.failureCount).toBe(1);

    const action = resetFailureCount();
    const result = reducer(mockInitialState, action);
    expect(result.failureCount).toBe(0);
  });

  test("test updateScannedPouchForAcceptance", () => {
    const updateAction = updateScannedPouchForAcceptance({
      data: {
        isBranchValid: "test",
        isPouchValid: "test",
        isPouchValueAssociated: "test",
        pouchID: "test",
        pouchType: "cash",
        status: "expected",
        transactionID: "test",
        updatedBy: {},
        items: {},
      },
      barcode: "test",
      duplicate: true,
      time: +new Date(),
      status: 200,
    });
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.barcode).toBe("test");
  });
});
