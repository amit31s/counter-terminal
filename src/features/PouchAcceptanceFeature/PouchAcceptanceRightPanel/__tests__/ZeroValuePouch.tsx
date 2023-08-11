import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { ZeroValuePouch } from "../ZeroValuePouch";

describe("Render ZeroValuePouch", () => {
  it("zero value pouch rendered successfully", async () => {
    const user = setupUser();
    const { getByText, getByTestId } = renderWithRedux(<ZeroValuePouch />);
    expect(getByText(stringConstants.Pouch.NoAssociationWithPouch)).toBeTruthy();
    expect(getByTestId("currency-field")).toBeTruthy();
    await user.clear(getByTestId("currency-field"));
    await user.type(getByTestId("currency-field"), "1");
    expect(getByTestId(stringConstants.Button.CashDrawer_Proceed)).toBeTruthy();
    await user.click(getByTestId(stringConstants.Button.CashDrawer_Proceed));
    expect(getByTestId(stringConstants.Button.Cancel_Button)).toBeTruthy();
    await user.click(getByTestId(stringConstants.Button.Cancel_Button));
  });
});
