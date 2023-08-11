import reducer, {
  IState,
  resetFlag,
  updateSuspendBasketNotification,
} from "../updateSuspendBasketNotification";

const mockUpdateState: IState = {
  isVisible: true,
};

const mockInitialState: IState = {
  isVisible: false,
};

describe("render updateSuspendBasketNotification", () => {
  test("test updateSuspendBasketNotification and resetReceiptData", async () => {
    const action = updateSuspendBasketNotification(mockUpdateState);
    const result = reducer(mockInitialState, action);
    expect(result.isVisible).toBe(true);

    const resetAction = resetFlag();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.isVisible).toBe(false);
  });
});
