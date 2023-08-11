import { useAppDispatch, useGetUser } from "@ct/common";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { resetBasketIdStatus } from "@ct/common/state/HomeScreen";
import { resetBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { resetFulfillment } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { resetHomeScreenStage } from "@ct/common/state/HomeScreen/updateHomeScreenStage.slice";
import { resetPaymentStatus } from "@ct/common/state/HomeScreen/updatePaymentStatus.slice";
import { resetReceiptData } from "@ct/common/state/HomeScreen/updateRecieptData.slice";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { useCallback } from "react";
import { persistor } from "./../../state/index";

type UseClearBasket = {
  homeScreenCleanup: () => Promise<void>;
};

export const useClearBasket = (): UseClearBasket => {
  const dispatch = useAppDispatch();
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);

  const {
    device: { deviceID },
  } = useGetUser();

  const homeScreenCleanup = useCallback(async () => {
    try {
      dispatch(resetPaymentStatus());
      dispatch(resetBasket());
      dispatch(resetBasketIdStatus());
      dispatch(resetHomeScreenStage());
      dispatch(resetReceiptData());
      dispatch(resetFulfillment({ deviceId: deviceID }));
      await persistor.flush();

      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.clearBasket,
        message: BASKET_PROCESS_LOGS_MSG.basketCleanSuccess,
      });
    } catch (error) {
      basketLogger.fatal({
        methodName: BASKET_PROCESS_LOGS_FN.clearBasket,
        message: BASKET_PROCESS_LOGS_MSG.clearBasketFailed,
        error: error as Error,
      });
    }
  }, [deviceID, dispatch]);

  return {
    homeScreenCleanup,
  };
};
