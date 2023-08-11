import reducer, { KeypadSlice, setButtonSize } from "../../keypad.slice";

describe("render keypad slice", () => {
  test("test keypad slice without threshold", async () => {
    const keySlice: KeypadSlice = {
      buttonSize: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
    const storeState: KeypadSlice["buttonSize"] = {
      x: 0,
      y: 0,
      width: 100,
      height: 0,
    };
    const action = setButtonSize(storeState);
    const result = await reducer(keySlice, action);
    expect(result.buttonSize.width).toBe(100);
  });

  test("test keypad slice with threshold", async () => {
    const keySlice: KeypadSlice = {
      buttonSize: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
    const storeState: KeypadSlice["buttonSize"] = {
      x: 0,
      y: 0,
      width: 1,
      height: 0,
    };
    const action = setButtonSize(storeState);
    const result = await reducer(keySlice, action);
    expect(result.buttonSize.width).toBe(0);
  });
});
