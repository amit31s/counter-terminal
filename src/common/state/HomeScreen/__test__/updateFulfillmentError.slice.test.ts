import reducer, {
  resetFulfillmentError,
  updateFulfillmentError,
  UpdateFulfillmentError,
  UpdateFulfillmentErrorState,
} from "../updateFulfillmentError.slice";

const mockState: UpdateFulfillmentError = {
  uuid: "test-uuid",
  errorResponse: {},
};
const mockInitialState: UpdateFulfillmentErrorState = {
  uuid: "",
  errorResponse: {},
};

describe("render updateFulfillmentError slice", () => {
  test("test updateFulfillmentError and resetFulfillmentError", () => {
    const updateAction = updateFulfillmentError(mockState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.uuid).toBe("test-uuid");

    const action = resetFulfillmentError();
    const result = reducer(mockInitialState, action);
    expect(result.uuid).toBe("");
  });
});
