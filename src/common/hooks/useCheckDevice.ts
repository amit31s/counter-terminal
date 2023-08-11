import { useEffect } from "react";
import { useAppSelector } from ".";
import { checkDeviceSessionAsyncThunk } from "../state/auth.slice";
import { useAppDispatch } from "./useAppDispatch";

export const useCheckDevice = () => {
  const { isDeviceRegistered } = useAppSelector((rootState) => rootState.auth);
  const dispatch = useAppDispatch();

  /**
   * @remarks Checks if a device is registered
   */
  useEffect(() => {
    !isDeviceRegistered && dispatch(checkDeviceSessionAsyncThunk());
  }, [dispatch, isDeviceRegistered]);
};
