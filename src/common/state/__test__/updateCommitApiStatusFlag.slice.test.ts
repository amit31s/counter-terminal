import reducer, {
  hideCommitFailureModal,
  ICommitStatusState,
  resetCommitApiStatus,
  resetCommitApiStatusFlag,
  setCommitApiStatus,
  setCommitErrorModal,
  showCommitFailureModal,
} from "../updateCommitApiStatusFlag.slice";
const mockInitialState: ICommitStatusState = {
  isErrorOccured: false,
  showModal: false,
};

describe("render updateCommitApiStatusState and resetCommitApiStatusFlag", () => {
  test("test setCommitErrorModal", () => {
    const updateAction = setCommitErrorModal();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.isErrorOccured).toBe(true);
    expect(updateResult.showModal).toBe(true);

    const resetAction = resetCommitApiStatusFlag();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.isErrorOccured).toBe(false);
    expect(resetResult.showModal).toBe(false);
  });

  test("test setCommitApiStatus", () => {
    const action = setCommitApiStatus();
    const result = reducer(mockInitialState, action);
    expect(result.isErrorOccured).toBe(true);
    expect(result.showModal).toBe(false);
  });

  test("test resetCommitApiStatus", () => {
    const updateAction = setCommitApiStatus();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.isErrorOccured).toBe(true);

    const resetAction = resetCommitApiStatus();
    const resetResult = reducer(mockInitialState, resetAction);
    expect(resetResult.isErrorOccured).toBe(false);
  });

  test("test showCommitFailureModal and hideCommitFailureModal", () => {
    const showAction = showCommitFailureModal();
    const showResult = reducer(mockInitialState, showAction);
    expect(showResult.isErrorOccured).toBe(false);
    expect(showResult.showModal).toBe(true);

    const hideAction = hideCommitFailureModal();
    const hideResult = reducer(mockInitialState, hideAction);
    expect(hideResult.isErrorOccured).toBe(false);
    expect(hideResult.showModal).toBe(false);
  });
});
