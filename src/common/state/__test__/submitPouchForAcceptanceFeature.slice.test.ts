import reducer, {
  reset,
  ScannedPouchAcceptanceState,
  updateSubmitPouchForAcceptance,
} from "../submitPouchForAcceptanceFeature.slice";

const mockIValue = {
  submitted: true,
  msg: "test-message",
};
const mockInitialState: ScannedPouchAcceptanceState = {
  msg: "",
  time: 0,
  submitted: false,
};

describe("render submitPouchForAcceptanceFeature", () => {
  test("test updateSubmitPouchForAcceptance and reset", () => {
    const updateAction = updateSubmitPouchForAcceptance(mockIValue);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.msg).toBe("test-message");
    expect(updateResult.submitted).toBe(true);

    const action = reset();
    const result = reducer(mockInitialState, action);
    expect(result.msg).toBe("");
    expect(updateResult.submitted).toBe(true);
  });
});
