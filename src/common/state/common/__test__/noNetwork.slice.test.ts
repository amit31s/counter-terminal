import reducer, {
  hideNoNetworkModal,
  NoNetworkInitialState,
  showNoNetworkModal,
} from "../noNetwork.slice";

const mockInitialState: NoNetworkInitialState = {
  isVisible: false,
  isVisibleNetworkRestored: false,
};

describe("render noNetwork slice", () => {
  test("test showNoNetworkModal and hideNoNetworkModal", () => {
    const updateAction = showNoNetworkModal();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.isVisible).toBe(true);

    const action = hideNoNetworkModal();
    const result = reducer(mockInitialState, action);
    expect(result.isVisible).toBe(false);
  });
});
