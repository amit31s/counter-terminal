import reducer, {
  resetBasketIdStatus,
  updateBasketIdStatus,
  UpdateBasketIdStatus,
} from "../updateBasketIdStatus.slice";

const mockState: UpdateBasketIdStatus = {
  basketId: "test-id",
  isBasketOpened: true,
  time: 0,
  closeBasketFailed: true,
  basketClosed: true,
  errorCode: "test-errorCode",
};
const mockInitialState: UpdateBasketIdStatus = {
  basketId: "",
  isBasketOpened: false,
  time: 0,
  closeBasketFailed: false,
  basketClosed: false,
  errorCode: "",
};

describe("render updateBasketIdStatus slice", () => {
  test("test updateBasketIdStatus and resetVoidStatus", () => {
    const updateAction = updateBasketIdStatus(mockState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.basketId).toBe("test-id");

    const action = resetBasketIdStatus();
    const result = reducer(mockInitialState, action);
    expect(result.basketId).toBe("");
  });
});
