import { useAppDispatch } from "@ct/common";
import { ERROR_CODES } from "@ct/common/ErrorCodes";
import { updateBasketIdStatus } from "@ct/common/state/HomeScreen";
import { isNetworkError, transactionApiClient } from "@ct/utils";
import { get } from "lodash";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";

type OpenBasket = {
  basketId?: string;
  status: boolean;
};

export enum BasketStateEnum {
  Bkc = "BKC",
  Bko = "BKO",
}

export const useOpenBasket = () => {
  const transactionAPI = transactionApiClient();
  const dispatch = useAppDispatch();

  const updateBasketIdStatusState = (status: boolean) => {
    dispatch(
      updateBasketIdStatus({
        isBasketOpened: status,
      }),
    );
  };
  const updateBasketId = (basketId: string) => {
    dispatch(
      updateBasketIdStatus({
        basketId: basketId,
      }),
    );
  };

  const openBasket = async (
    basketState?: BasketStateEnum,
    basketID?: string,
  ): Promise<OpenBasket> => {
    const basketLogger = logManager(LOGGER_TYPE.basketLogger);
    try {
      if (!basketState) {
        const { data } = await transactionAPI?.getLastBasket();
        basketState = data?.basket?.basketCore?.basketState;
        basketID = data?.basket?.basketCore?.basketID;
      }
      //BM-4803 created and TE team assigned to fix openAPI spec for BKO
      if (basketState === (BasketStateEnum.Bko as unknown)) {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.openBasket,
          message: BASKET_PROCESS_LOGS_MSG.basketAlreadyOpen,
        });
        updateBasketIdStatusState(true);
        return { basketId: basketID, status: false };
      }
      const { basketId } = await transactionAPI.createBasket();
      updateBasketId(basketId);
      updateBasketIdStatusState(true);
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.openBasket,
        message: BASKET_PROCESS_LOGS_MSG.basketCreated,
      });
      return { basketId, status: true };
    } catch (error) {
      if (isNetworkError(error)) {
        throw error;
      }
      const errorResponse = get(error, "response.data.errorCode");
      if (errorResponse === ERROR_CODES.transactionEngine.basketAlreadyOpened) {
        updateBasketIdStatusState(true);
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.updateBasketIdStatusState,
          message: BASKET_PROCESS_LOGS_MSG.basketOpened,
        });
        return { status: true };
      }
      basketLogger.fatal({
        methodName: BASKET_PROCESS_LOGS_FN.openBasket,
        error: error as Error,
      });
      return { status: false };
    }
  };

  return {
    openBasket,
  };
};
