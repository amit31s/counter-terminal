import { getSuspendBasketNotification, useAppSelector } from "@ct/common";
import { getSuspendedBasket } from "@ct/utils";
import { useEffect, useState } from "react";
export const useGetShowSuspendBasketNotification = () => {
  const [showSuspendBasketNotification, setShowSuspendBasketShowNotification] =
    useState<boolean>(false);
  const getIfNotificationAlreadyVisible = useAppSelector(getSuspendBasketNotification);
  useEffect(() => {
    if (getIfNotificationAlreadyVisible.isVisible) return;
    const id = setInterval(() => {
      const suspendedBasketData = getSuspendedBasket();
      if (suspendedBasketData && suspendedBasketData.expireAt && suspendedBasketData.item?.length) {
        const hourBeforeCloseingTime = new Date(suspendedBasketData?.expireAt).getHours() - 1;
        if (new Date().getHours() === hourBeforeCloseingTime) {
          setShowSuspendBasketShowNotification(true);
        } else {
          setShowSuspendBasketShowNotification(false);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [getIfNotificationAlreadyVisible.isVisible, showSuspendBasketNotification]);
  return { showSuspendBasketNotification, setShowSuspendBasketShowNotification };
};
