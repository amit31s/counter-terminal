import { stringConstants } from "@ct/constants";
import { render, setupUser } from "../../common/helpers/test-utils";
import { LoginSelfRegister } from "./LoginSelfRegister";

jest.mock("@ct/constants/featureFlags", () => {
  return {
    featureFlags: {
      selfRegisterButtons: true,
    },
  };
});

describe("LoginSelfRegister", () => {
  it("renders the Register, Forgot password and Unlock buttons", async () => {
    const { getByText } = render(<LoginSelfRegister />);

    expect(getByText(stringConstants.Button.register)).toBeTruthy();
    expect(getByText(stringConstants.Button.forgotPassword)).toBeTruthy();
    expect(getByText(stringConstants.Button.unlock)).toBeTruthy();
  });

  it("renders the Register button and click", async () => {
    const { getByText } = render(<LoginSelfRegister />);

    const user = setupUser();
    const pressableText = getByText(stringConstants.Button.register);
    expect(pressableText).toBeTruthy();
    await user.click(pressableText);
  });
  it("renders the Forgot password button and click", async () => {
    const { getByText } = render(<LoginSelfRegister />);

    const user = setupUser();
    const pressableText = getByText(stringConstants.Button.forgotPassword);
    expect(pressableText).toBeTruthy();
    await user.click(pressableText);
  });
  it("renders the unlock button and click", async () => {
    const { getByText } = render(<LoginSelfRegister />);

    const user = setupUser();
    const pressableText = getByText(stringConstants.Button.unlock);
    expect(pressableText).toBeTruthy();
    await user.click(pressableText);
  });
});
