import { render } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { LoadingComponent } from "../LoadingComponent";

describe("test Loading component Layout", () => {
  it("should render loading component layout", () => {
    const { getByText } = render(<LoadingComponent />);
    expect(getByText(stringConstants.LoginScreen.Loading)).toBeTruthy();
  });
});
