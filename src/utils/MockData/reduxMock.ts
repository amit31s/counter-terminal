import { AuthConfigType } from "@ct/common/state/auth.slice";
import { defaultDeviceData } from "@ct/common/state/initialStateData";
import { SCREENS } from "@ct/constants";
import { AuthStatus } from "@ct/interfaces/auth.interface";
const device = defaultDeviceData();

export const authMock = {
  device: {
    nodeID: "56",
    deviceID: "test",
    deviceType: "counter",
    branchID: "123456L",
    branchName: "Test",
    branchAddress: "Test",
    branchPostcode: "L1 8DX",
    branchUnitCode: "",
    branchUnitCodeVer: "",
  },
  session: {
    accessToken: "",
    refreshToken: "",
    idToken: "",
  },
  deviceError: null,
  error: null,
  loading: false,
  user: null,
  userTokenData: null,
  isUserLoggedIn: false,
  userLoading: false,
  initialScreen: SCREENS.HOME,
  isDeviceRegistered: false,
  configStatus: AuthConfigType.DEVICE_CONFIG,
  authStatus: "idle" as AuthStatus,
  userLoginStarted: false,
};

export const authFlowMock = {
  device,
  session: {
    accessToken: "",
    refreshToken: "",
    idToken: "",
  },
  error: null,
  loading: false,
  user: null,
  userTokenData: null,
  isUserLoggedIn: true,
  initialScreen: undefined,
  isDeviceRegistered: false,
  configStatus: AuthConfigType.DEVICE_CONFIG,
};

export const updatePouchDispatchListMock = {
  data: {
    dispatch_txn_id: "test-transaction-id",
  },
  time: 123456,
  availablePouchData: [],
  initialAvailablePouchData: [],
  showAvailablePouches: true,
  validatedData: [],
};
