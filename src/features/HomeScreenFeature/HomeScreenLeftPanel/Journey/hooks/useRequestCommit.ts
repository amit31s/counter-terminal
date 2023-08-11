import {
  getBasket,
  getLoadingStatus,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { CNF_LOGS_FN, CNF_LOGS_MSG } from "@ct/common/constants/CNFLogs";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { isNetworkError, preUpdateBasket } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { clone } from "lodash";
import { useEffect, useRef, useState } from "react";

export function useRequestCommitOnItemAdded() {
  const { basketItemCount, basketItems } = useAppSelector(getBasket);
  const { commitBasket } = useCommitBasket();
  const dispatch = useAppDispatch();
  const [isCommitRequested, setIsCommitRequested] = useState(false);
  const basketItemCountRef = useRef<number>(0);
  const commitAndFulfilLogger = logManager(LOGGER_TYPE.commitAndFulfilLogger);

  useEffect(() => {
    if (basketItemCount > basketItemCountRef.current) {
      (async () => {
        setIsCommitRequested(true);
        try {
          const resp = await commitBasket({ basketItems });
          if (isNetworkError(resp)) {
            dispatch(showNoNetworkModal());
            const cloneItems = clone(basketItems);
            cloneItems.pop();
            dispatch(updateBasket(preUpdateBasket(cloneItems)));
          }
        } catch (ex) {
          commitAndFulfilLogger.fatal({
            service: CNF_LOGS_FN.useEffect,
            methodName: CNF_LOGS_MSG.commitBasket,
            error: ex as Error,
          });
        }
        setIsCommitRequested(false);
      })();
    }
    basketItemCountRef.current = basketItemCount;
  }, [basketItemCount, basketItems, commitAndFulfilLogger, commitBasket, dispatch]);

  const loadingStatus = useAppSelector(getLoadingStatus);
  const isLoading =
    loadingStatus.filter(({ id }) => id !== LoadingId.HOME_SCREEN_COMMITTING).length > 0;

  useEffect(() => {
    if (
      isCommitRequested ||
      basketItems.some((item) => item.commitStatus === STATE_CONSTANTS.COMMIT_INITIATED)
    ) {
      dispatch(setLoadingActive({ id: LoadingId.HOME_SCREEN_COMMITTING }));
    } else {
      dispatch(setLoadingInactive(LoadingId.HOME_SCREEN_COMMITTING));
    }
  }, [basketItems, dispatch, isCommitRequested, isLoading]);
}
