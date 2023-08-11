import { useAppDispatch, useAppSelector } from "@ct/common";
import { signOutUser } from "@ct/common/state/auth.slice";
import { resetPedState } from "@ct/common/state/ped.slice";
import { setTouchKeyboardEnabled } from "@ct/common/state/touchKeyboard.slice";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { MISC_LOGS_FN, MISC_LOGS_VARS } from "../constants/MiscLogs";

type IdleState = "Active" | "Idle";

export const useIdleTimerHooks = (timer: number) => {
  const dispatch = useAppDispatch();
  const { isUserLoggedIn } = useAppSelector((rootState) => rootState.auth);
  const [currentState, setCurrentState] = useState<IdleState>("Active");
  const miscLogger = logManager(LOGGER_TYPE.miscLogger);

  const handleOnIdle = () => {
    if (currentState === "Active") {
      pause();
      dispatch(resetPedState());
      setTimeout(() => {
        setCurrentState("Idle");
        dispatch(setTouchKeyboardEnabled(false));
        dispatch(signOutUser());
      }, 500);
    }
    miscLogger.info({
      methodName: MISC_LOGS_FN.onIdle,
      message: MISC_LOGS_VARS.lastActiveTime(),
    });
  };

  const handleOnActive = () => {
    if (currentState === "Idle" && isUserLoggedIn) {
      activate();
      setCurrentState("Active");
    }
    miscLogger.info({
      methodName: MISC_LOGS_FN.onActive,
      message: MISC_LOGS_VARS.remainingTime(getLastActiveTime()),
    });
  };

  const handleOnAction = () => {
    if (currentState === "Idle" && isUserLoggedIn) {
      activate();
      setCurrentState("Active");
    }
    miscLogger.info({
      methodName: "onAction",
      message: MISC_LOGS_VARS.appActiveLast(getLastActiveTime()),
    });
  };

  const { getRemainingTime, getLastActiveTime, start, pause, activate } = useIdleTimer({
    crossTab: true,
    timeout: timer,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    syncTimers: 200,
    debounce: 500,
  });

  return { getRemainingTime, getLastActiveTime, start };
};
