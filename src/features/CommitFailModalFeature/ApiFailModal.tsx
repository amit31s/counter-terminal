import { StyledErrorWarningAmberIcon } from "@ct/assets/icons";
import {
  getBasket,
  getCommitApiStatus,
  useAppDispatch,
  useAppSelector,
  useClearBasket,
  useCloseBasket,
} from "@ct/common";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { setSelectedItem, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { LoadingId, setLoadingInactive } from "@ct/common/state/loadingStatus.slice";
import { resetCommitApiStatusFlag } from "@ct/common/state/updateCommitApiStatusFlag.slice";
import { CustomModal } from "@ct/components";
import { BUTTON, STATE_CONSTANTS, stringConstants, TEXT } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { isNetworkError, preUpdateBasket } from "@ct/utils";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useEffect } from "react";
import { APP_LOGS_FN, APP_LOGS_VARS } from "@ct/common/constants/AppLogger";

interface IApiFailureModal {
  onFinishCallback: () => void;
}
export const ApiFailModal = ({ onFinishCallback: _ }: IApiFailureModal) => {
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);

  const component = "ApiFailModal";
  const dispatch = useAppDispatch();
  const isCommitFails = useAppSelector(getCommitApiStatus);
  const { failedItems, basketItems } = useAppSelector(getBasket);
  const { homeScreenCleanup } = useClearBasket();
  const { closeBasket } = useCloseBasket();

  const primaryButton = {
    testID: BUTTON.CTBTN0006,
    label: BUTTON.CTBTN0006,
    onPress: async () => {
      try {
        const filterBasket: IbasketItem[] = [];
        for (let index = 0; index < basketItems.length; index++) {
          const element: IbasketItem = basketItems[index];
          if (element.id !== failedItems[0]?.id) {
            filterBasket.push(element);
          }
        }

        dispatch(updateBasket(preUpdateBasket(filterBasket)));
        dispatch(setSelectedItem(filterBasket[0]));

        const failedItemsAfterFilter = filterBasket.find(
          (item) => item.commitStatus === STATE_CONSTANTS.FAIL,
        );
        if (!failedItemsAfterFilter) {
          dispatch(resetCommitApiStatusFlag());
        }
        if (!failedItemsAfterFilter && filterBasket.length === 0) {
          dispatch(resetCommitApiStatusFlag());
          await closeBasket();
          await homeScreenCleanup();
          appLogger.info({
            methodName: APP_LOGS_FN.primaryButton,
            message: APP_LOGS_VARS.basketClosedFrom(component),
            component,
          });
        }
      } catch (error) {
        if (isNetworkError(error)) {
          dispatch(showNoNetworkModal());
        }
        appLogger.error({
          methodName: APP_LOGS_FN.secondaryButtononPress,
          error: error as string,
          message: component,
        });
      }
    },
  };

  useEffect(() => {
    if (isCommitFails.showModal) {
      dispatch(setLoadingInactive(LoadingId.TENDERING));
    }
  }, [dispatch, isCommitFails.showModal]);

  return (
    <>
      <CustomModal
        testID={stringConstants.CommitFailureModal.apiFailureTestId}
        title={TEXT.CTTXT00034(failedItems[0]?.name ?? "")}
        isOpen={isCommitFails.showModal}
        primaryButtonProps={primaryButton}
        icon={<StyledErrorWarningAmberIcon />}
        contentSize="medium"
      />
    </>
  );
};
