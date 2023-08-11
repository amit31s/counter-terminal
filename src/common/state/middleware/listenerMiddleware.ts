import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  authEffect,
  checkFederatedUser,
  federatedSignIn,
  setDeviceConfigToRefreshToken,
  setUserConfigToRefreshToken,
  signOutUser,
} from "../auth.slice";

import type { TypedStartListening } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listenerMiddleware.startListening as AppStartListening;

export function startAuthMiddlewareListening() {
  startAppListening({
    matcher: isAnyOf(
      checkFederatedUser,
      federatedSignIn,
      signOutUser,
      setDeviceConfigToRefreshToken,
      setUserConfigToRefreshToken,
    ),
    effect: authEffect,
  });
}
