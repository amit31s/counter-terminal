import reducer, {
  reset,
  ScannedAccCardState,
  updateCountToShowAvailablePouchListToDispatch,
} from "../countToShowAvailablePouchListToDispatch.slice";

const mockInitialState: ScannedAccCardState = {
  count: 0,
  time: 0,
};

describe("render countToShowAvailablePouchListToDispatch slice", () => {
  test("test updateCountToShowAvailablePouchListToDispatch and reset", () => {
    const updateAction = updateCountToShowAvailablePouchListToDispatch();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.count).toBe(1);

    const action = reset();
    const result = reducer(mockInitialState, action);
    expect(result.count).toBe(0);
  });
});
