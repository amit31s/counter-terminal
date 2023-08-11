import reducer, {
  IState,
  resetHomeScreenStage,
  updateHomeScreenStage,
} from "../updateHomeScreenStage.slice";

const mockState: IState = {
  stage: "completed",
  completeClicked: true,
  time: 0,
};
const mockInitialState: IState = {
  stage: "home",
  completeClicked: false,
  time: 0,
};

describe("render updateFulfillment slice", () => {
  test("test updateHomeScreenStage and resetFulfillment", () => {
    const updateAction = updateHomeScreenStage(mockState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.stage).toBe("completed");

    const action = resetHomeScreenStage();
    const result = reducer(mockInitialState, action);
    expect(result.stage).toBe("home");
  });
});
