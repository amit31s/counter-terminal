import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { NotAllowedOnThisBranch } from "./NotAllowedOnThisBranch";

describe("NotAllowedOnThisBranch tests", () => {
  it("OK button should be enabled when signOutTriggeredBy === lockscreen", () => {
    const { getByTestId } = renderWithRedux(<NotAllowedOnThisBranch />);
    expect(getByTestId(stringConstants.Button.Ok)).toBeEnabled();
  });
  it("On click of OK button window.open should be triggered to logout user", async () => {
    jest.useFakeTimers();
    const user = setupUser(true);
    const { getByTestId } = renderWithRedux(<NotAllowedOnThisBranch />);
    expect(getByTestId(stringConstants.Button.Ok)).toBeEnabled();
    const spyWindowOpen = jest.spyOn(window, "open").mockImplementation(jest.fn());
    await user.click(getByTestId(stringConstants.Button.Ok));
    jest.runAllTimers();
    expect(spyWindowOpen).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
