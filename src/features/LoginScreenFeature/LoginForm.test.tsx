import { renderWithRedux, setupUser } from "@ct/common";
import stringConstants from "../../constants/StringsConstants";
import { LoginForm } from "./LoginForm";

jest.mock("@ct/common/platformHelper", () => {
  return {
    ...jest.requireActual("@ct/common/platformHelper"),
    envProvider: {
      REACT_APP_USING_ELECTRON: "true",
    },
  };
});
const handleLoginMock = jest.fn();

describe("Application render correctly", () => {
  it("LoginForm Please Login Text Render Correctly", () => {
    const { getByText } = renderWithRedux(<LoginForm handleLogin={handleLoginMock} />);
    expect(getByText(new RegExp(stringConstants.LoginScreen.PleaseLogin, "i"))).toBeTruthy();
  });
  it("LoginForm User Input and Password Render Correctly", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<LoginForm handleLogin={handleLoginMock} />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.UserIdInput)).toBeTruthy();
    await user.type(getByTestId(stringConstants.LoginScreenTestIds.UserIdInput), "user");
    expect(getByTestId(stringConstants.LoginScreenTestIds.PasswordInput)).toBeTruthy();
    await user.type(getByTestId(stringConstants.LoginScreenTestIds.PasswordInput), "pwd");
  });
  it("LoginForm Button Render Correctly", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<LoginForm handleLogin={handleLoginMock} />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.LoginClick)).toBeTruthy();
    await user.click(getByTestId(stringConstants.LoginScreenTestIds.LoginClick));
    expect(handleLoginMock).toHaveBeenCalledTimes(1);
  });
});
