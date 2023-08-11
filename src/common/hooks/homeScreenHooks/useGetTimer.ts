import { useEffect, useState } from "react";

export const useGetTimer = (showSuspendBasketNotification: boolean) => {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    if (showSuspendBasketNotification === false) return;
    const date = new Date();
    const intervalId = setInterval(() => {
      setMinutes(60 - date.getMinutes());
      setSeconds(60 - date.getSeconds());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [showSuspendBasketNotification, seconds]);
  return { minutes, seconds };
};
