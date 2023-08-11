import reducer, {
  LabelFulfilmentStage,
  LabelFulfilmentState,
  resetLabelFulfilmentState,
  setLabelFulfilmentStage,
  updateLabelFulfilmentState,
} from "../labelFulfillment.slice";

const mockLabelFulfilmentStage: LabelFulfilmentStage = "SUCCESSFUL";

const mockLabelFulfilmentState: LabelFulfilmentState = {
  stage: "INITIATED",
};
const mockInitialState: LabelFulfilmentState = {
  stage: "NOT_REQUESTED",
};

describe("render label printer slice", () => {
  test("test updateLabelFulfilmentState and resetLabelFulfilmentState", () => {
    const updateAction = updateLabelFulfilmentState(mockLabelFulfilmentState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.stage).toBe("INITIATED");

    const action = resetLabelFulfilmentState();
    const result = reducer(mockInitialState, action);
    expect(result.stage).toBe("NOT_REQUESTED");
  });

  test("test setLabelFulfilmentStage", () => {
    const updateAction = setLabelFulfilmentStage(mockLabelFulfilmentStage);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.stage).toBe("SUCCESSFUL");
  });
});
