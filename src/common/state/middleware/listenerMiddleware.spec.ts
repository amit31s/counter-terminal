import { AnyAction, createAsyncThunk, ListenerEffectAPI } from "@reduxjs/toolkit";

import { assertNever, waitFor } from "@ct/common/helpers";
import { IAuthTokens } from "@ct/interfaces/device.interface";
import * as asyncThunks from "../auth.slice";
import {
  AuthConfigType,
  checkFederatedUser,
  checkFederatedUserAsyncThunk,
  DispatchAuthAsyncThunk,
  federatedSignIn,
  federatedSignInAsyncThunk,
  signOutUser,
  signOutUserAsyncThunk,
} from "../auth.slice";
import { refreshDeviceTokensAsyncThunk, refreshUserTokensAsyncThunk } from "../authAsyncThunk";
import { AppDispatch, RootState, store } from "../index";
import { defaultUserData } from "../initialStateData";
import { startAppListening } from "./listenerMiddleware";

const sessionData = {
  signInUserSession: {
    idToken: { jwtToken: "EJshdg111" },
    accessToken: { jwtToken: "EJshdg111" },
    refreshToken: { token: "EJshdg111" },
  },
};

const checkUserDataFulfillMock = createAsyncThunk("auth/checkFederatedUserAsyncThunk", async () => {
  const { idToken, accessToken, refreshToken } = sessionData.signInUserSession;
  const userTokenData: IAuthTokens = {
    idToken: idToken.jwtToken,
    accessToken: accessToken.jwtToken,
    refreshToken: refreshToken.token,
  };
  const user = defaultUserData();
  return { userTokenData, user };
});

const resolveMock = createAsyncThunk("auth/federatedSignInAsyncThunk", async () => {
  return Promise.resolve();
});

const checkUserDataRejectMock = createAsyncThunk("auth/checkFederatedUserAsyncThunk", async () => {
  throw (
    (new Error("User isn't authenticated"),
    {
      condition: () => false,
    })
  );
});

jest.spyOn(asyncThunks, "signOutUserAsyncThunk").mockImplementation(resolveMock);
jest.spyOn(asyncThunks, "federatedSignInAsyncThunk").mockImplementation(resolveMock);

const dispatchAuthAsyncThunk = async ({ type, listenerApi }: DispatchAuthAsyncThunk) => {
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

beforeEach(() => {
  jest.restoreAllMocks();
});

it("Triggers federatedSignIn when checkFederatedUser is rejected", async () => {
  startAppListening({
    type: "auth/checkFederatedUserAsyncThunk/rejected",
    effect: async (action: AnyAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
      // After dispatching an action, the config should be the user config
      expect(listenerApi.getState().auth.configStatus).toEqual(AuthConfigType.USER_CONFIG);

      listenerApi.cancelActiveListeners();

      expect(listenerApi.getState().auth.session).toBeNull();

      listenerApi.dispatch(federatedSignIn());

      // After dispatching AsyncThunk, the config should be the default
      await waitFor(() => {
        expect(listenerApi.getState().auth.configStatus).toBe(AuthConfigType.DEVICE_CONFIG);
      });
      // Store should not contain session data

      expect(store.getState().auth.loading).toBe(false);
      expect.assertions(6);
    },
  });

  startAppListening({
    actionCreator: federatedSignIn,
    effect: async (action: AnyAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
      // After dispatching an action, the config should be the user config
      expect(listenerApi.getState().auth.configStatus).toEqual(AuthConfigType.USER_CONFIG);
      listenerApi.cancelActiveListeners();

      await dispatchAuthAsyncThunk({ type: action.type, listenerApi });

      // After dispatching AsyncThunk, the config should be the default
      await waitFor(() => {
        expect(listenerApi.getState().auth.configStatus).toBe(AuthConfigType.DEVICE_CONFIG);
      });
      // Store should have been updated to contain session data
      expect(store.getState().auth.loading).toBe(false);
      expect.assertions(3);
    },
  });

  jest
    .spyOn(asyncThunks, "checkFederatedUserAsyncThunk")
    .mockImplementationOnce(checkUserDataRejectMock);

  store.dispatch(checkFederatedUser());
  await waitFor(() => store.getState().auth.loading === false);

  jest
    .spyOn(asyncThunks, "checkFederatedUserAsyncThunk")
    .mockImplementationOnce(checkUserDataFulfillMock);

  store.dispatch(checkFederatedUser());
});

it("Correctly executes checkFederatedUserAsyncThunk middleware after dispatching checkFederatedUser action. ", async () => {
  startAppListening({
    actionCreator: checkFederatedUser,
    effect: async (action: AnyAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
      // After dispatching an action, the config should be the user config
      expect(listenerApi.getState().auth.configStatus).toEqual(AuthConfigType.USER_CONFIG);
      listenerApi.cancelActiveListeners();

      await dispatchAuthAsyncThunk({ type: action.type, listenerApi });

      // After dispatching AsyncThunk, the config should be the default
      await waitFor(() => {
        expect(listenerApi.getState().auth.configStatus).toBe(AuthConfigType.DEVICE_CONFIG);
      });
      // Store should have been updated to contain session data
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.userTokenData).toEqual(sessionData.signInUserSession);
      expect.assertions(3);
    },
  });

  store.dispatch(checkFederatedUser());
});

it("Correctly executes SignOutUserAsyncThunk middleware after executing signOutUserAction", async () => {
  startAppListening({
    actionCreator: signOutUser,
    effect: async (action: AnyAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
      // After dispatching an action, the config should be the user config
      expect(listenerApi.getState().auth.configStatus).toEqual(AuthConfigType.USER_CONFIG);
      listenerApi.cancelActiveListeners();

      await dispatchAuthAsyncThunk({ type: action.type, listenerApi });

      // After dispatching AsyncThunk, the config should be the default
      await waitFor(() => {
        expect(listenerApi.getState().auth.configStatus).toBe(AuthConfigType.DEVICE_CONFIG);
      });
      expect(store.getState().auth.loading).toBe(false);
      expect(store.getState().auth.userTokenData).toEqual(null);
      expect.assertions(4);
    },
  });

  store.dispatch(signOutUser());
});
