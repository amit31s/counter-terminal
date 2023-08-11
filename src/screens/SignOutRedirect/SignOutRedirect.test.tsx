import { renderWithRedux } from "@ct/common";
import { SignOutRedirect } from "./SignOutRedirect";

describe("SignOutRedirect", () => {
  it("should trigger signout", () => {
    const { getByText } = renderWithRedux(<SignOutRedirect />);
    expect(getByText("Signing off...")).toBeTruthy();
  });
});
