import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { UserLogin } from "./UserLogin";

describe("UserLogin", () => {
  it("should trigger login from logoff", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<UserLogin />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.LoginScreenPanel)).toBeTruthy();
    await user.click(getByTestId(stringConstants.LoginScreenTestIds.LoginClick));
  });
});
