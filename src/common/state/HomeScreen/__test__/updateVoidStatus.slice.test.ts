import reducer, {
  Popup,
  resetVoidStatus,
  updateActivePopup,
  VoidStatus,
} from "../updateVoidStatus.slice";

const mockVoidStatus: Popup = Popup.Basket;
const mockInitialState: VoidStatus = {
  activePopup: Popup.None,
};

describe("render updateVoidStatus slice", () => {
  test("test updateActivePopup and resetVoidStatus", () => {
    const updateAction = updateActivePopup(mockVoidStatus);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.activePopup).toBe(Popup.Basket);

    const action = resetVoidStatus();
    const result = reducer(mockInitialState, action);
    expect(result.activePopup).toBe(Popup.None);
  });
});
