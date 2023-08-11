import { useAppDispatch } from "@ct/common/hooks/useAppDispatch";
import { updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { IJourneyData } from "@ct/components/JourneyRenderer";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { IbasketItem, IInternalJourneyData } from "@ct/interfaces/basket.interface";
import { prepareBasketItemData, preUpdateBasket } from "@ct/utils";
import { ERROR } from "../enums";
import { getBasket } from "../selectors";
import { useAppSelector } from "./useAppSelector";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "../constants/BasketLogs";

export function useAddBasketItem() {
  const dispatch = useAppDispatch();
  const { basketItems } = useAppSelector(getBasket);
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);

  const dispatchBasketData = (basketArray: IbasketItem[]) => {
    dispatch(updateBasket(preUpdateBasket(basketArray)));
  };

  return async (data: IJourneyData) => {
    basketLogger.info({
      methodName: BASKET_PROCESS_LOGS_FN.useAddBasketItem,
      message: BASKET_PROCESS_LOGS_MSG.addingItemToBasket,
      data,
    });

    if (data?.transaction?.tokens?.fulfilmentAction === JOURNEYENUM.CASH_WITHDRAWAL) {
      dispatch(
        updatePaymentStatus({
          cashTenderReceivedAmountTxCommited: false,
          cashTenderTenderedAmountTxCommited: true,
        }),
      );
    } else if (data?.transaction?.tokens?.fulfilmentAction === JOURNEYENUM.CASH_DEPOSIT) {
      dispatch(
        updatePaymentStatus({
          cashTenderReceivedAmountTxCommited: true,
          cashTenderTenderedAmountTxCommited: false,
        }),
      );
    } else {
      dispatch(
        updatePaymentStatus({
          cashTenderReceivedAmountTxCommited: true,
          cashTenderTenderedAmountTxCommited: true,
        }),
      );
    }

    const preparedData = await prepareBasketItemData(data as IInternalJourneyData, basketItems);
    if (preparedData === ERROR.NETWORK_ERROR) {
      return ERROR.NETWORK_ERROR;
    }
    dispatchBasketData(preparedData.basketArray);
    return;
  };
}
