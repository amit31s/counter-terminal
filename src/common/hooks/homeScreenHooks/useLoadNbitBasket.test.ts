import { renderHookWithRedux } from "@ct/common/helpers";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { useLoadNbitBasket } from "./useLoadNbitBasket";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

const useDispatchMock = useDispatch as jest.Mock;

describe("Testing useLoadNbitBasket hook", () => {
  const dispatchResultRecorder = {} as Record<string, unknown>;

  const fakeDispatch = (action: AnyAction) => {
    let payload = action.payload;
    if (payload === undefined) {
      payload = "void";
    }
    dispatchResultRecorder[action.type] = payload;
  };

  useDispatchMock.mockImplementation(() => fakeDispatch);

  test("useDispatch should called once on hook load", () => {
    renderHookWithRedux(() => useLoadNbitBasket(), {
      auth: {
        device: {
          nodeID: "38",
          deviceID: "",
          branchID: "246745",
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
        isDeviceRegistered: false,
        configStatus: AuthConfigType.DEVICE_CONFIG,
        authStatus: "idle",
        userLoginStarted: false,
      },
    });
    expect(useDispatchMock).toHaveBeenCalledTimes(1);
  });
});

// TODO need to add few more test case when will start on "https://pol-jira.atlassian.net/browse/BM-6972"
