import { getBasket } from "@ct/common/selectors";
import { IbasketItem, IInternalJourneyData } from "@ct/interfaces/basket.interface";
import { useMemo } from "react";
import { useAppSelector } from "../useAppSelector";

type TGetBasket = {
  journeyData: IInternalJourneyData[];
};

export const useGetJourneyData = (): TGetBasket => {
  const { basketItems } = useAppSelector(getBasket);

  const journeyData = useMemo(
    () => ({
      journeyData: basketItems.map((obj: IbasketItem) => obj.journeyData) as IInternalJourneyData[],
    }),
    [basketItems],
  );

  return journeyData;
};
