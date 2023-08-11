import { getBasket, useAppDispatch, useAppSelector } from "@ct/common";
import { getNoInternetModalStatus } from "@ct/common/selectors/common/noInternetSelector";
import { updateCashPayment } from "@ct/common/state/HomeScreen";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { EntryType } from "@ct/interfaces/basket.interface";
import { preUpdateBasket } from "@ct/utils";
import { logManager } from "@pol/frontend-logger-web";
import { clone, last } from "lodash";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useEffect } from "react";

type UseResetTenderingActionsAfterNetworkErrorProps = {
  setWillPerformAfterPaymentCommit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};
const appLogger = logManager(LOGGER_TYPE.applicationLogger);

export const useResetTenderingActionsAfterNetworkError = ({
  setWillPerformAfterPaymentCommit,
  setIsProcessing,
}: UseResetTenderingActionsAfterNetworkErrorProps) => {
  const dispatch = useAppDispatch();
  const { isVisible } = useAppSelector(getNoInternetModalStatus);
  const { basketItems } = useAppSelector(getBasket);

  useEffect(() => {
    if (isVisible) {
      try {
        setWillPerformAfterPaymentCommit(false);
        setIsProcessing(false);
        const lastItem = last(basketItems);
        // remove cash entry and reset cash payment
        // if network interruption happens just after cash click
        // but before committing cash
        const cashEntryToAbort =
          lastItem?.type === EntryType.paymentMode &&
          lastItem.name === "Cash" &&
          lastItem.commitStatus !== STATE_CONSTANTS.SUCCESS;
        if (cashEntryToAbort) {
          const cloneItems = clone(basketItems);
          cloneItems.pop();
          dispatch(updateBasket(preUpdateBasket(cloneItems)));
          dispatch(updateCashPayment(0));
        }
      } catch (error) {
        appLogger.error({
          methodName: "useResetTenderingActionsAfterNetworkError",
          error: error as string,
        });
      }
    }
  }, [basketItems, dispatch, isVisible, setIsProcessing, setWillPerformAfterPaymentCommit]);
};
