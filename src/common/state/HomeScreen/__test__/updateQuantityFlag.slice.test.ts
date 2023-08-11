import reducer, {
  hideUpdateQuantity,
  IState,
  resetFlag,
  updateQuantityFlag,
} from "../updateQuantityFlag.slice";

const mockUpdateState: IState = {
  flag: true,
};

const mockInitialState: IState = {
  flag: false,
};

describe("render updateQuantityFlag", () => {
  test("test updateQuantityFlag and resetFlag", async () => {
    const action = updateQuantityFlag(mockUpdateState);
    const result = reducer(mockInitialState, action);
    expect(result.flag).toBe(true);

    const resetAction = resetFlag();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.flag).toBe(false);
  });

  test("test hideUpdateQuantity", async () => {
    const action = hideUpdateQuantity();
    const result = reducer(mockInitialState, action);
    expect(result.flag).toBe(false);
  });
});
