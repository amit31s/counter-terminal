import reducer, { IPedState, resetPedState, updateInitialisationStatus } from "../ped.slice";

const mockIPedState: IPedState = {
  initialised: true,
};
const mockInitialState: IPedState = {
  initialised: false,
};

describe("render ped slice", () => {
  test("test updateInitialisationStatus", () => {
    const updateAction = updateInitialisationStatus(mockIPedState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.initialised).toBe(true);

    const action = resetPedState();
    const result = reducer(mockInitialState, action);
    expect(result.initialised).toBe(false);
  });
});
