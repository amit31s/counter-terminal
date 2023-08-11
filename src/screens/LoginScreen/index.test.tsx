import { renderWithRedux } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { LoginScreen } from "@ct/screens";
import { authMock } from "@ct/utils/MockData/reduxMock";
import { stubBroadcastChannel } from "../../../__mocks__/broadcastChannel";

stubBroadcastChannel();

describe("Device auth login ", () => {
  it("Login screen contains DeviceID and DeviceOTP textboxes", async () => {
    const { findByTestId } = renderWithRedux(<LoginScreen />, {
      auth: authMock,
    });

    expect(await findByTestId(stringConstants.LoginScreenTestIds.UserIdInput)).toBeTruthy();
    expect(await findByTestId("DeviceOTPLabel")).toBeTruthy();
  });
});
