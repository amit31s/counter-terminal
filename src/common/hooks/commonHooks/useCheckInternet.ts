import {
  hideNetworkRestoredModal,
  hideNoNetworkModal,
  showNetworkRestoredModal,
  showNoNetworkModal,
} from "@ct/common/state/common/noNetwork.slice";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../useAppDispatch";

export const useCheckInternet = () => {
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);
  const dispatch = useAppDispatch();

  const setNetworkStatus = useCallback(
    (event: Event) => {
      if (event.type === "online") {
        setIsOnline(true);
        dispatch(hideNoNetworkModal());
        dispatch(showNetworkRestoredModal());
        return;
      }
      setIsOnline(false);
      dispatch(hideNetworkRestoredModal());
      dispatch(showNoNetworkModal());
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener("offline", setNetworkStatus);
    window.addEventListener("online", setNetworkStatus);
    return () => {
      window.removeEventListener("offline", setNetworkStatus);
      window.removeEventListener("online", setNetworkStatus);
    };
  }, [setNetworkStatus]);

  const checkInternet = useCallback(() => {
    if (!isOnline) {
      dispatch(showNoNetworkModal());
    }
    return isOnline;
  }, [dispatch, isOnline]);

  return { checkInternet, isOnline };
};
