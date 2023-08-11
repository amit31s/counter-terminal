import reducer, {
  InitialStateCashTransfer,
  resetCashTransfer,
  resetCashTransferred,
  setCashTransferred,
  setSelectedCashLocation,
} from "./cashTransfer.slice";

describe("Cash Transfer Redux slice", () => {
  let initialState: InitialStateCashTransfer;

  beforeEach(() => {
    initialState = {
      selectedItem: { entityType: "" },
      transferred: false,
    };
  });

  it("should handle setSelectedCashLocation", () => {
    const newSelectedItem = {
      entityType: "someEntity",
      someOtherProperty: "someValue",
    };
    const action = setSelectedCashLocation(newSelectedItem);
    const newState = reducer(initialState, action);

    expect(newState.selectedItem).toEqual(newSelectedItem);
  });

  it("should handle setCashTransferred", () => {
    const action = setCashTransferred();
    const newState = reducer(initialState, action);

    expect(newState.transferred).toBe(true);
  });

  it("should handle resetCashTransferred", () => {
    initialState.transferred = true;

    const action = resetCashTransferred();
    const newState = reducer(initialState, action);

    expect(newState.transferred).toBe(false);
  });

  it("should handle resetCashTransfer", () => {
    const action = resetCashTransfer();
    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
