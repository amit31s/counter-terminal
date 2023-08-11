import { Auth } from "@aws-amplify/auth";
import { federationConfig } from "@ct/configs/federationConfig";
import { featureFlags, SCREENS } from "@ct/constants";
import { AuthSlice, SignInProps } from "@ct/interfaces/auth.interface";
import {
  DeviceAttributes,
  IAuthTokens,
  RawDeviceAttributes,
} from "@ct/interfaces/device.interface";
import { setItem } from "@ct/utils";
import { decodeJWTToken } from "@ct/utils/jwt";
import {
  fromCognitoUser,
  getInitialLoggedInScreen,
  parseCognitoAttributes,
  parseUserIdentities,
} from "@ct/utils/Services/auth/helper";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { AnyAction, createAsyncThunk, createSlice, ListenerEffectAPI } from "@reduxjs/toolkit";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { AppDispatch, RootState } from ".";
import { FEDERATION_MANAGER_URL } from "../backendUrl";
import { APP_LOGS_FN, APP_LOGS_MSG, APP_LOGS_VARS } from "../constants/AppLogger";
import { STORAGE_KEYS } from "../enums";
import { assertNever, constructQueryString } from "../helpers";
import { envProvider } from "../platformHelper";
import { refreshDeviceTokensAsyncThunk, refreshUserTokensAsyncThunk } from "./authAsyncThunk";
import { defaultDeviceData, defaultUserData } from "./initialStateData";
export enum AuthConfigType {
  USER_CONFIG = "userConfig",
  DEVICE_CONFIG = "deviceConfig",
}
const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);

export type DispatchAuthAsyncThunk = {
  type:
    | "auth/checkFederatedUser"
    | "auth/federatedSignIn"
    | "auth/signOutUser"
    | "auth/setDeviceConfigToRefreshToken"
    | "auth/setUserConfigToRefreshToken";

  listenerApi: ListenerEffectAPI<RootState, AppDispatch>;
};

const initialState: AuthSlice = {
  device: defaultDeviceData(),
  session: null,
  error: null,
  deviceError: null,
  loading: true,
  user: defaultUserData(),
  userTokenData: null,
  isUserLoggedIn: false,
  userLoading: false,
  initialScreen: undefined,
  isDeviceRegistered: false,
  configStatus: AuthConfigType.DEVICE_CONFIG,
  authStatus: "idle",
  userLoginStarted: false,
};

/**
 * @remarks Checks for a federated user, user data is stored in the redux store until we know what will be used from the user data.
 * @remarks If no user is returned (rejected), then we sign in with Auth.federatedSignInAsyncThunk()
 */
const checkFederatedUserAsyncThunk = createAsyncThunk(
  "auth/checkFederatedUserAsyncThunk",
  async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const { idToken, accessToken, refreshToken } = userData.signInUserSession;
    const userTokenData: IAuthTokens = {
      idToken: idToken.jwtToken,
      accessToken: accessToken.jwtToken,
      refreshToken: refreshToken.token,
    };
    const user = defaultUserData();
    const sysRole = idToken.payload?.["custom:SysRole"];
    const { id, provider, createdAt } = parseUserIdentities(idToken.payload?.identities);
    user.id = id;
    user.provider = provider;
    user.createdAt = createdAt;
    if (sysRole) {
      user.roles = JSON.parse(decodeURIComponent(sysRole.replace(/\+/g, "")));
    }
    return { userTokenData, user };
  },
);

const federatedSignInAsyncThunk = createAsyncThunk("auth/federatedSignInAsyncThunk", async () => {
  if (typeof window?.open !== "function") {
    return;
  }

  const windowProxy = window.open(
    constructQueryString(
      `${FEDERATION_MANAGER_URL}${featureFlags.useLocalFederationManager ? "" : "/index.html"}`,
      federationConfig,
    ),
    envProvider.REACT_APP_USING_WEB === "true" ? "_top" : "_blank",
  );

  if (envProvider.REACT_APP_USING_WEB !== "true" && windowProxy !== null) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!windowProxy?.closed) {
          return;
        }

        clearInterval(interval);
        resolve();
      }, 500);
    });
  }
});

/**
 * @remark Triggered by useCheckDevice hook when we get a user
 * token after a user has successfully signed in with federatedSignInAsyncThunk and a userToken is returned.
 */
const checkDeviceSessionAsyncThunk = createAsyncThunk(
  "auth/checkDeviceSessionAsyncThunk",
  async () => {
    const session: CognitoUserSession = await Auth.currentSession();
    const idTokenPayload = session.getIdToken().payload as RawDeviceAttributes;
    const initialScreen = await getInitialLoggedInScreen();
    const response: {
      device: DeviceAttributes;
      initialScreen: SCREENS;
    } & IAuthTokens = {
      device: parseCognitoAttributes(idTokenPayload),
      idToken: session.getIdToken().getJwtToken(),
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
      initialScreen,
    };
    // set fadcode and nodeid to storage if need to access it outside of react hook and components
    setItem(STORAGE_KEYS.CTSTK0004, response.device.branchID);
    setItem(STORAGE_KEYS.CTSTK0005, response.device.nodeID);

    return response;
  },
);
const { DEVICE_CONFIG, USER_CONFIG } = AuthConfigType;

export const dispatchAuthAsyncThunk = async ({ type, listenerApi }: DispatchAuthAsyncThunk) => {
  switch (type) {
    case "auth/checkFederatedUser":
      return await listenerApi.dispatch(checkFederatedUserAsyncThunk());
    case "auth/federatedSignIn":
      return await listenerApi.dispatch(federatedSignInAsyncThunk());
    case "auth/signOutUser":
      return await listenerApi.dispatch(signOutUserAsyncThunk());
    case "auth/setDeviceConfigToRefreshToken":
      return await listenerApi.dispatch(refreshDeviceTokensAsyncThunk());
    case "auth/setUserConfigToRefreshToken":
      return await listenerApi.dispatch(refreshUserTokensAsyncThunk());
    default:
      return assertNever(type);
  }
};

export const authEffect = async (
  action: AnyAction,
  listenerApi: ListenerEffectAPI<RootState, AppDispatch>,
) => {
  listenerApi.cancelActiveListeners();

  await dispatchAuthAsyncThunk({ type: action.type, listenerApi });
};

const registerDevice = createAsyncThunk(
  "auth/registerDevice",
  async ({ email, password, shouldUseFederatedSignIn }: SignInProps) => {
    const device: CognitoUser = await Auth.signIn(email, password);
    const cognitoUser = await fromCognitoUser(device);
    const initialScreen = await getInitialLoggedInScreen();
    applicationLogger.info({
      methodName: APP_LOGS_FN.registerDevice,
      message: APP_LOGS_VARS.deviceCognitoLoggedIn(cognitoUser.deviceID),
    });
    await window.electronAPI?.saveLoginDetails?.({
      serialNumber: email,
      fad: cognitoUser.branchID,
      node: String(cognitoUser.nodeID),
    });
    return { device: cognitoUser, initialScreen, shouldUseFederatedSignIn };
  },
);

const signOutUserAsyncThunk = createAsyncThunk("auth/signOutUserAsyncThunk", async () => {
  typeof window?.open === "function" &&
    window.open(
      constructQueryString(
        `${FEDERATION_MANAGER_URL}/logout${featureFlags.useLocalFederationManager ? "" : ".html"}`,
        federationConfig,
      ),
      envProvider.REACT_APP_USING_WEB === "true" ? "_top" : "_blank",
    );
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * @remark Triggered by hub event in useAuth when a user has successfully signed in with federatedSignInAsyncThunk,
     */
    setDeviceConfigToRefreshToken: (state: AuthSlice) => {
      state.configStatus = DEVICE_CONFIG;
    },
    setUserConfigToRefreshToken: (state: AuthSlice) => {
      state.configStatus = USER_CONFIG;
    },
    federatedSignInSuccess: (state: AuthSlice) => {
      state.error = null;
      state.userLoading = false;
      state.isUserLoggedIn = true;
      state.configStatus = DEVICE_CONFIG;
    },
    checkFederatedUser: (state: AuthSlice) => {
      state.configStatus = USER_CONFIG;
    },
    federatedSignIn: (state: AuthSlice) => {
      state.configStatus = USER_CONFIG;
      state.userLoginStarted = true;
    },
    signOutUser: (state: AuthSlice) => {
      state.configStatus = USER_CONFIG;
    },
    clearError: (state: AuthSlice) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshDeviceTokensAsyncThunk.fulfilled, (state, action) => {
      state.session = action.payload;
      applicationLogger.info({
        methodName: APP_LOGS_FN.refreshDeviceTokensAsyncThunkfulfilled,
        message: APP_LOGS_MSG.deviceTokenRefreshedSuccessFully,
        data: decodeJWTToken(action.payload.idToken),
      });
    });
    builder.addCase(refreshUserTokensAsyncThunk.fulfilled, (state, action) => {
      state.userTokenData = action.payload;
      state.configStatus = DEVICE_CONFIG;
      applicationLogger.info({
        methodName: APP_LOGS_FN.refreshUserTokensAsyncThunkfulfilled,
        message: APP_LOGS_MSG.userTokenRefreshedSuccessFully,
        data: decodeJWTToken(action.payload.idToken),
      });
    });
    builder.addCase(refreshUserTokensAsyncThunk.rejected, (state) => {
      state.configStatus = DEVICE_CONFIG;
    });
    builder.addCase(federatedSignInAsyncThunk.pending, (state) => {
      state.userLoading = true;
      state.authStatus = "checking";
      state.error = null;
    });
    builder.addCase(federatedSignInAsyncThunk.fulfilled, (state) => {
      state.configStatus = DEVICE_CONFIG;
      state.userLoading = false;
      state.error = null;
      state.authStatus = "userChecked";
      state.userLoginStarted = false;
    });

    builder.addCase(checkFederatedUserAsyncThunk.pending, (state) => {
      state.userLoading = true;
      state.authStatus = "checking";
      state.isUserLoggedIn = false;
      state.error = null;
    });
    builder.addCase(checkFederatedUserAsyncThunk.fulfilled, (state, action) => {
      state.configStatus = DEVICE_CONFIG;
      const { userTokenData, user } = action.payload;
      state.error = null;
      state.isUserLoggedIn = true;
      state.userLoading = false;
      state.authStatus = "userChecked";
      state.userTokenData = userTokenData;
      state.user = user;
    });
    builder.addCase(checkFederatedUserAsyncThunk.rejected, (state, _action) => {
      state.configStatus = USER_CONFIG;
      state.userLoading = false;
      state.authStatus = "userChecked";
      state.isUserLoggedIn = false;
    });

    builder.addCase(checkDeviceSessionAsyncThunk.pending, (state) => {
      state.configStatus = DEVICE_CONFIG;
      state.loading = true;
      state.authStatus = "checking";
      state.error = null;
    });
    builder.addCase(checkDeviceSessionAsyncThunk.fulfilled, (state, action) => {
      state.configStatus = DEVICE_CONFIG;
      const { device, initialScreen, ...sessionData } = action.payload;
      state.authStatus = "deviceChecked";

      state.error = null;
      state.device = device;
      state.loading = false;
      state.session = { ...sessionData };
      state.initialScreen = initialScreen;
      state.isDeviceRegistered = true;
    });
    builder.addCase(checkDeviceSessionAsyncThunk.rejected, (state) => {
      state.configStatus = DEVICE_CONFIG;
      state.session = null;
      state.loading = false;
      state.initialScreen = SCREENS.LOGIN;
      state.authStatus = "deviceChecked";
    });

    builder.addCase(registerDevice.pending, (state) => {
      state.loading = true;
      state.authStatus = "checking";
      state.error = null;
      state.deviceError = null;
    });
    builder.addCase(registerDevice.fulfilled, (state, action) => {
      const { device, initialScreen } = action.payload;
      state.error = null;
      state.deviceError = null;
      state.device = device;
      state.loading = false;
      state.isDeviceRegistered = true;
      state.initialScreen = initialScreen;
      state.authStatus = "deviceChecked";
    });
    builder.addCase(registerDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.deviceError = action.error;
      state.authStatus = "deviceChecked";
    });

    builder.addCase(signOutUserAsyncThunk.pending, (state) => {
      state.configStatus = USER_CONFIG;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOutUserAsyncThunk.fulfilled, (state) => {
      state.configStatus = DEVICE_CONFIG;
      state.error = null;
      state.loading = false;
      state.initialScreen = undefined;
      state.isUserLoggedIn = false;
      state.user = null;
      state.userTokenData = null;
    });
  },
});

export {
  checkDeviceSessionAsyncThunk,
  checkFederatedUserAsyncThunk,
  federatedSignInAsyncThunk,
  registerDevice,
  signOutUserAsyncThunk,
};
export const {
  federatedSignInSuccess,
  federatedSignIn,
  signOutUser,
  checkFederatedUser,
  clearError,
  setDeviceConfigToRefreshToken,
  setUserConfigToRefreshToken,
} = authSlice.actions;
export default authSlice.reducer;
