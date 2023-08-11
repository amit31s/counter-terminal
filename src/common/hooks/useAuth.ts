import { useEffect } from "react";
import { checkFederatedUser } from "../state/auth.slice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { useCheckDevice } from "./useCheckDevice";

export const useAuth = () => {
  const { user, isDeviceRegistered } = useAppSelector((rootState) => rootState.auth);
  const dispatch = useAppDispatch();
  useCheckDevice();

  useEffect(() => {
    if (isDeviceRegistered && !user?.id) {
      dispatch(checkFederatedUser());
    }
  }, [dispatch, isDeviceRegistered, user]);
};
