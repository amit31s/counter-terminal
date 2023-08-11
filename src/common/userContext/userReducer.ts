import { DeviceAttributes } from "../../interfaces/device.interface";

export enum ActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_AUTH_USER = "SET_AUTH_USER",
}

export type Action = Login | SetAuthenticatedUser | Logout;

export const initialState: UserState = { user: undefined };

export const reducer = (_state: UserState, action: Action): UserState => {
  switch (action.type) {
    case ActionType.LOGIN:
      return { user: action.payload.user };

    case ActionType.SET_AUTH_USER:
      return { user: action.payload.user };

    case ActionType.LOGOUT:
      return initialState;

    default:
      throw new Error(`unknown action: ${action}`);
  }
};

export interface Login {
  type: ActionType.LOGIN;
  payload: { user: DeviceAttributes };
}

export interface SetAuthenticatedUser {
  type: ActionType.SET_AUTH_USER;
  payload: { user: DeviceAttributes };
}

export interface Logout {
  type: ActionType.LOGOUT;
}

export interface UserState {
  user?: DeviceAttributes;
}

export type ValidActions = Login | Logout | SetAuthenticatedUser;
