import { SuspendBasket } from "@ct/interfaces/basket.interface";
import { getSuspendedBasket } from "@ct/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type IUseGetSuspendedBasket = {
  suspendedBasket: SuspendBasket;
  existsSuspendBasket: boolean;
  setExistsSuspendBasket: Dispatch<SetStateAction<boolean>>;
  setSuspendedBasket: Dispatch<SetStateAction<SuspendBasket>>;
};

export const useGetSuspendedBasket = (): IUseGetSuspendedBasket => {
  const [suspendedBasket, setSuspendedBasket] = useState<SuspendBasket>({ item: [], time: 0 });
  const [existsSuspendBasket, setExistsSuspendBasket] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = () => {
      const suspendedBasketData = getSuspendedBasket();
      if (suspendedBasketData) {
        setExistsSuspendBasket(suspendedBasketData.item.length > 0);
        setSuspendedBasket(suspendedBasketData);
      }
    };
    fetchUser();
  }, []);

  return { suspendedBasket, existsSuspendBasket, setExistsSuspendBasket, setSuspendedBasket };
};
