import { useAppDispatch, useAppSelector, useAuth } from "@ct/common";
import { useIdleTimerHooks } from "@ct/common/hooks/useIdleTimer";
import { signOutUser } from "@ct/common/state/auth.slice";
import { LoadingComponent } from "@ct/components/LoadingComponent";
import { AppConstants, featureFlags, SCREENS, STATE_CONSTANTS } from "@ct/constants";
import isElectron from "is-electron";
import { ReactNode, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCheckBranchPermission } from "./useCheckBranchPermission";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";

export const AuthRoutes = ({ children }: { children?: ReactNode }) => {
  useAuth();
  const useIdleTimer = useIdleTimerHooks(STATE_CONSTANTS.IDLE_TIMEOUT); // set idle timeout for 15 mins
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { authStatus, loading, isUserLoggedIn, isDeviceRegistered, device } = useAppSelector(
    (rootState) => rootState.auth,
  );

  const allowedOnThisBranch = useCheckBranchPermission();
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);

  useEffect(() => {
    useIdleTimer.start();
  }, [useIdleTimer]);

  // If app reloads from shutdown, user will be logged off

  useEffect(() => {
    if (!isElectron()) return;
    const handle = setInterval(() => {
      if (
        window.localStorage.getItem(AppConstants.AppKeys.APP_LAUNCHED) === "true" &&
        featureFlags.shouldSignOutOnAppLaunch
      ) {
        window.localStorage.setItem(AppConstants.AppKeys.APP_LAUNCHED, "false");
        dispatch(signOutUser());
        clearInterval(handle);
      }
    }, 1000);
    useIdleTimer.start();
    return () => clearInterval(handle);
  }, [dispatch, useIdleTimer]);

  if (loading || authStatus === "checking") {
    return <LoadingComponent />;
  }

  if (!isDeviceRegistered) {
    return <Navigate to={SCREENS.LOGIN} state={{ from: location }} replace />;
  }

  if (!isUserLoggedIn && authStatus === "userChecked") {
    return <Navigate to={SCREENS.USER_LOGIN} state={{ from: location }} replace />;
  }

  // if user is not allowed on logged in branch
  if (isUserLoggedIn && !allowedOnThisBranch) {
    appLogger.info({
      methodName: APP_LOGS_FN.AuthRoutes,
      data: { isDeviceRegistered, authStatus, isUserLoggedIn, deviceBranchID: device.branchID },
      message: APP_LOGS_MSG.userDoNotHavePermission,
    });
    return <Navigate to={SCREENS.NOT_ALLOWED_ON_THIS_BRANCH} state={{ from: location }} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};
