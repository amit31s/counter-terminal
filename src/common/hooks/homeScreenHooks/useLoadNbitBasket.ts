import { loadNbitBasket } from "@ct/common/state/HomeScreen/asyncThunk";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";

export const useLoadNbitBasket = () => {
  const dispatch = useAppDispatch();
  const { device, isUserLoggedIn } = useAppSelector((rootState) => rootState.auth);
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      // NOTE: will never rerender after replaceState because using windows`s history directly without using react hook
      window.history.replaceState({}, document.title);
      return;
    }
    if (!device.branchID || !device.nodeID || !isUserLoggedIn) {
      return;
    }
    // once power restored
    // added 1 sec delay to load prerequisite
    const timeoutToLoadBasket = setTimeout(() => {
      dispatch(loadNbitBasket({ branchID: device.branchID, nodeID: Number(device.nodeID) }));
    }, 1000);
    return () => clearTimeout(timeoutToLoadBasket);
  }, [device.branchID, device.nodeID, dispatch, isUserLoggedIn, state]);
};
