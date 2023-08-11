import reducer, {
  IState,
  resetFlagStatus,
  updateNumpadFlagStatus,
} from "../updateNumpadFlag.slice";

const mockState: IState = {
  flag: false,
};
const mockInitialState: IState = {
  flag: true,
};

describe("render updateNumpadFlag slice", () => {
  test("test updateNumpadFlagStatus and resetFlagStatus", () => {
    const updateAction = updateNumpadFlagStatus(mockState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.flag).toBe(false);

    const action = resetFlagStatus();
    const result = reducer(mockInitialState, action);
    expect(result.flag).toBe(true);
  });
});
