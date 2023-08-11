import jwtDecode from "jwt-decode";
import { useEffect, useRef } from "react";
import { setDeviceConfigToRefreshToken, setUserConfigToRefreshToken } from "../state/auth.slice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";

// Amount of time that should be left on the active token before refreshing it.
const REFRESH_TIMER_DURATION = 30 * 60 * 1000; // 30 minutes
export const useRefreshTokens = () => {
  const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);
  const dispatch = useAppDispatch();
  const { userTokenData } = useAppSelector((rootState) => rootState.auth);
  const lastUserToken = useRef<string | null>(null);

  useEffect(() => {
    if (!userTokenData?.idToken) {
      return;
    }
    const token = jwtDecode<{ exp: number }>(userTokenData?.idToken);
    const timeToNext = Math.max(
      0,
      Math.min(REFRESH_TIMER_DURATION, token.exp * 1000 - REFRESH_TIMER_DURATION - Date.now()),
    );

    const handle = setTimeout(() => {
      applicationLogger.info({
        methodName: APP_LOGS_FN.useEffect,
        service: APP_LOGS_FN.useRefreshTokens,
        message: APP_LOGS_MSG.startedRefreshUserToken,
      });
      dispatch(setUserConfigToRefreshToken());
    }, timeToNext);

    return () => clearTimeout(handle);
  }, [dispatch, userTokenData?.idToken]);

  useEffect(() => {
    if (lastUserToken.current === null || lastUserToken.current === userTokenData?.idToken) {
      lastUserToken.current = userTokenData?.idToken ?? null;
      return;
    }
    applicationLogger.info({
      methodName: APP_LOGS_FN.useEffect,
      service: APP_LOGS_FN.useRefreshTokens,
      message: APP_LOGS_MSG.startedRefreshDeviceToken,
    });
    dispatch(setDeviceConfigToRefreshToken());
  }, [dispatch, userTokenData?.idToken]);
};
