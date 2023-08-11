import { renderWithRedux } from "@ct/common";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../__mocks__/broadcastChannel";
import { DeeplinkRoutes } from "./DeeplinkRoutes";

stubBroadcastChannel();

describe("Deeplink Routes ", () => {
  afterEach(async () => {
    clearBroadcastChannelInstances();
  });

  it("should render deeplink routes with children", () => {
    const { container } = renderWithRedux(
      <DeeplinkRoutes>
        <div />
      </DeeplinkRoutes>,
      {
        auth: {
          device: {
            nodeID: "55",
            deviceID: "",
            branchID: "123456",
            deviceType: "",
            branchName: "",
            branchAddress: "",
            branchPostcode: "",
            branchUnitCode: "",
            branchUnitCodeVer: "",
          },
          session: null,
          error: null,
          deviceError: null,
          loading: true,
          user: null,
          userTokenData: {
            idToken: "mock-token",
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
          },
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: true,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    setTimeout(() => {
      const deepLinkChannel = new BroadcastChannel("deeplink_channel");
      deepLinkChannel.postMessage({ route: "mock_user" });
    }, 0);
    expect(container.children.length).toBe(1);
  });
  it("should render deeplink routes with outlet component", () => {
    const { container } = renderWithRedux(<DeeplinkRoutes />);
    setTimeout(() => {
      const signOutChannel = new BroadcastChannel("Signout");
      signOutChannel.postMessage({ signOut: true });
    }, 0);
    expect(container.children.length).toBe(1);
  });
});
