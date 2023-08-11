import { renderHookWithRedux } from "@ct/common/helpers";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import { defaultDeviceData } from "@ct/common/state/initialStateData";
import { getUserIdToken } from "@ct/utils/Services/auth";
import { sampleUserToken } from "../sampleUserToken";
import { useCheckBranchPermission } from "../useCheckBranchPermission";

jest.mock("@ct/utils/Services/auth");
const mGetUserToken = jest.mocked(getUserIdToken);

describe("Testing useCheckBranchPermission hook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return false if fadcode not found from device login", async () => {
    const device = defaultDeviceData();
    const { result } = renderHookWithRedux(
      () => {
        return useCheckBranchPermission();
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    const status = await result.current;
    expect(status).toEqual(false);
  });
  test("should return false if user token not found ", async () => {
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        return useCheckBranchPermission();
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    const status = await result.current;
    expect(status).toEqual(false);
  });

  test("should return false if user fadcode does not match with device fadcode: You do not have permission to log on in this branch", async () => {
    mGetUserToken.mockReturnValue(sampleUserToken.withSingleFadcode);
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        return useCheckBranchPermission();
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    const status = await result.current;
    expect(status).toEqual(false);
  });

  test("should return true if user fadcode (only allowed with one fadcode) match with device fadcode", async () => {
    mGetUserToken.mockReturnValue(sampleUserToken.withSingleFadcode);
    const device = defaultDeviceData();
    device.branchID = "4161378";
    const { result } = renderHookWithRedux(
      () => {
        return useCheckBranchPermission();
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: true,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    const status = await result.current;
    expect(status).toEqual(true);
  });

  test("should return true if user fadcode (allowed with more than one fadcode) match with device fadcode", async () => {
    mGetUserToken.mockReturnValue(sampleUserToken.withMoreThanFadcode);
    const device = defaultDeviceData();
    device.branchID = "234299";
    const { result } = renderHookWithRedux(
      () => {
        return useCheckBranchPermission();
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: true,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );
    const status = await result.current;
    expect(status).toEqual(true);
  });
});
