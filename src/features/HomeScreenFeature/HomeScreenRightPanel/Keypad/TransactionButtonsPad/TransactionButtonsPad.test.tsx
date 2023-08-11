import { renderWithRedux } from "@ct/common";
import { stringConstants } from "@ct/constants";
import TransactionButtonsPad from "./TransactionButtonsPad";

describe("Render TransactionButtonsPad", () => {
  it("should render transaction buttons pad", () => {
    const { getByText } = renderWithRedux(<TransactionButtonsPad />, {
      updateNumpadFlagStatus: {
        flag: false,
      },
    });
    expect(getByText(stringConstants.Button.RemoveItem)).toBeTruthy();
  });
  it("should render transaction buttons pad numpad flag", () => {
    const { getByText } = renderWithRedux(<TransactionButtonsPad />, {
      updateNumpadFlagStatus: {
        flag: true,
      },
    });
    expect(getByText(stringConstants.Button.RemoveItem)).toBeTruthy();
  });
});
