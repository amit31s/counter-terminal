import { AuthConfigType } from "@ct/common/state/auth.slice";
import { SCREENS } from "@ct/constants";
import { SerializedError } from "@reduxjs/toolkit";
import { DeviceAttributes, IAuthTokens } from "./device.interface";
import { User } from "./user.interface";

export type AuthStatus = "idle" | "checking" | "userChecked" | "deviceChecked";

export interface AuthSlice {
  user: User | null;
  userTokenData: IAuthTokens | null;
  device: DeviceAttributes;
  session: IAuthTokens | null;
  loading: boolean;
  error: SerializedError | null;
  deviceError: SerializedError | null;
  isUserLoggedIn: boolean;
  userLoading?: boolean;
  initialScreen: SCREENS | undefined;
  isDeviceRegistered: boolean;
  configStatus: AuthConfigType;
  authStatus?: "idle" | "checking" | "userChecked" | "deviceChecked";
  userLoginStarted: boolean;
}

export interface SignInProps {
  email: string;
  password: string;
  shouldUseFederatedSignIn: boolean;
}
