import { render } from "@ct/common";
import stringConstants from "../../constants/StringsConstants";
import { LoginScreenBackGroundImage } from "./LoginScreenBackGroundImage";

describe("Application render correctly", () => {
  it("PostOffice BackgroundImage Render Correctly", () => {
    const { getByTestId } = render(<LoginScreenBackGroundImage />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.LoginScreenBackGroundImage)).toBeTruthy();
  });

  it("PostOffice ShadowImage Render Correctly", () => {
    const { getByTestId } = render(<LoginScreenBackGroundImage />);
    expect(getByTestId(stringConstants.LoginScreenTestIds.LoginScreenShadowImage)).toBeTruthy();
  });
});
