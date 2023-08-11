import { renderWithRedux } from "@ct/common";
import { authMock } from "@ct/utils/MockData/reduxMock";
import { stubBroadcastChannel } from "../../../__mocks__/broadcastChannel";
import stringConstants from "../../constants/StringsConstants";
import { LoginScreenPanel } from "./LoginScreenPanel";

stubBroadcastChannel();

describe("Application render correctly", () => {
  it("LoginScreenPanel Render Correctly", () => {
    const { getByTestId } = renderWithRedux(<LoginScreenPanel />, {
      auth: authMock,
    });
    expect(getByTestId(stringConstants.LoginScreenTestIds.LoginScreenPanel)).toBeTruthy();
  });
});
