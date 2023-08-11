import { renderHookWithReduxAndStore } from "@ct/common/helpers";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  it("should be deviceConfig when user is not login and device registered", () => {
    const { store } = renderHookWithReduxAndStore(
      () => {
        useAuth();
      },
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
          userTokenData: null,
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
    const { configStatus } = store.getState().auth;
    expect(configStatus).toEqual(AuthConfigType.USER_CONFIG);
  });
});
