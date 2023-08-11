import { render } from "@ct/common";
import stringConstants from "../../constants/StringsConstants";
import { LoginScreenPostOfficeLogo } from "./LoginScreenPostOfficeLogo";

describe("Application render correctly", () => {
  it("PostOfficeLogo logo componet Render Correctly", () => {
    const { getByTestId } = render(<LoginScreenPostOfficeLogo />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.PostOfficeLogoComponent)).toBeTruthy();
  });
  it("PostOfficeLogo Render Correctly", () => {
    const { getByTestId } = render(<LoginScreenPostOfficeLogo />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.PostOfficeLogo)).toBeTruthy();
  });
  it("PostOfficeLogo welcome text render correctly", () => {
    const { getByText } = render(<LoginScreenPostOfficeLogo />);
    expect(getByText(stringConstants.LoginScreen.WELCOME)).toBeTruthy();
  });
});
