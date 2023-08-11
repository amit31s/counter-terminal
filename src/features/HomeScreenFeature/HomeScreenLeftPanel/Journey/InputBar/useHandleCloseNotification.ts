import { useAppDispatch } from "@ct/common";
import { updateSuspendBasketNotification } from "@ct/common/state/HomeScreen/updateSuspendBasketNotification";
import { Dispatch, SetStateAction, useCallback } from "react";

export function useHandleCloseNotification(
  setShowSuspendBasketShowNotification: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    setShowSuspendBasketShowNotification(false);
    dispatch(
      updateSuspendBasketNotification({
        isVisible: true,
      }),
    );
  }, [dispatch, setShowSuspendBasketShowNotification]);
}
