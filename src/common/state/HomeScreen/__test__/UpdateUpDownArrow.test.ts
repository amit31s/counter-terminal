import reducer, { IState, resetUpDownArrow, updateUpDownArrow } from "../UpdateUpDownArrow";

const mockUpdateState: IState = {
  time: 0,
  upClicked: true,
  downClicked: true,
  disableUpClick: true,
  disableDownClick: true,
};

const mockInitialState: IState = {
  time: 0,
  upClicked: false,
  downClicked: false,
  disableUpClick: false,
  disableDownClick: false,
};
describe("Update up and down arrow redux state tests", () => {
  test("test up arrow update", async () => {
    const action = updateUpDownArrow(mockUpdateState);
    const result = reducer(mockInitialState, action);
    expect(result.upClicked).toBe(true);

    const resetAction = resetUpDownArrow();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.upClicked).toBe(false);
  });
});
