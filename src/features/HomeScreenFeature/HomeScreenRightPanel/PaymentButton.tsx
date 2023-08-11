import {
  getBasket,
  getBasketIdStatus,
  getCommitApiStatus,
  getPaymentStatus,
  getQuantityFlag,
  getReceiptData,
  SalesReceiptModal,
  useAppDispatch,
  useAppSelector,
  useClearBasket,
  useCloseBasket,
  useCommitBasket,
  useGetHomeScreenStage,
} from "@ct/common";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { updateHomeScreenStage } from "@ct/common/state/HomeScreen/updateHomeScreenStage.slice";
import { ReceiptStatus } from "@ct/common/state/HomeScreen/updateRecieptData.slice";
import { CustomModal } from "@ct/components";
import { AppConstants, BUTTON, STATE_CONSTANTS, STRING_CONSTANTS } from "@ct/constants";
import { ApiFailModal } from "@ct/features/CommitFailModalFeature/ApiFailModal";
import { isNetworkError } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BasketButton } from "postoffice-spm-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { JOURNEYENUM } from "../homeScreen.enum";
import { basketcommitted, isAggregatedCommitPending, isCommitPending } from "../homeScreen.helper";
import { CloseBasketFailureModal } from "./HomeScreenRightPanelModals";

type Config = {
  onPress: () => void;
  text: string;
  testId: string;
  disabled: boolean;
};

export const PaymentButton = () => {
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);

  const component = "PaymentButton";
  const dispatch = useAppDispatch();
  const { homeScreenCleanup } = useClearBasket();
  const { txStatus } = useAppSelector(getPaymentStatus);
  const { receiptStatus } = useAppSelector(getReceiptData);
  const { updateTxCompleted } = useBasket();
  const { closeBasket } = useCloseBasket();
  const { commitBasket, commitAggregatedItems } = useCommitBasket();
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const { closeBasketFailed } = useAppSelector(getBasketIdStatus);
  const { stage } = useGetHomeScreenStage();
  const { flag: isQuantityModalOpened } = useAppSelector(getQuantityFlag);
  const isDisabled = basketItems.length === 0 || isQuantityModalOpened;
  const [loading, setLoading] = useState<boolean>(false);
  const isCommitFails = useAppSelector(getCommitApiStatus);
  const [disableCompleteButton, setDisableCompleteButton] = useState(false);
  const [disableFinishButton, setDisableFinishButton] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const onFinishPress = useCallback(async () => {
    setDisableFinishButton(true);
    if (isCommitFails.isErrorOccured) {
      basketLogger.info({
        methodName: BASKET_PROCESS_LOGS_FN.onFinishPressPB,
        message: BASKET_PROCESS_LOGS_MSG.createEntryFailedCloseBasketPB,
      });
      setDisableFinishButton(false);
      return;
    }
    await homeScreenCleanup();
    setDisableFinishButton(false);
  }, [isCommitFails.isErrorOccured, homeScreenCleanup, basketLogger]);

  const onPaymentPress = useCallback(() => {
    dispatch(
      updateHomeScreenStage({
        stage: STATE_CONSTANTS.STAGE_TENDERING,
      }),
    );
  }, [dispatch]);

  const onRepayPress = useCallback(() => {
    dispatch(
      updateHomeScreenStage({
        stage: STATE_CONSTANTS.STAGE_TENDERING,
      }),
    );
  }, [dispatch]);

  const onRefundPress = useCallback(() => {
    dispatch(
      updateHomeScreenStage({
        stage: STATE_CONSTANTS.STAGE_REFUND,
      }),
    );
  }, [dispatch]);

  const initiateCloseBasket = useCallback(async () => {
    try {
      const isClosed = await closeBasket();
      if (isClosed) {
        updateTxCompleted();
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.initiateCloseBasketPB,
          message: BASKET_PROCESS_LOGS_MSG.createEntryFailedCloseBasketPB,
          component,
        });
      }
    } catch (error) {
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      }
      basketLogger.error({
        methodName: BASKET_PROCESS_LOGS_FN.initiateCloseBasketPB,
        error: error as Error,
      });
    }
  }, [basketLogger, closeBasket, dispatch, updateTxCompleted]);

  const onCompletePress = useCallback(async () => {
    try {
      setDisableCompleteButton(true);
      dispatch(
        updateHomeScreenStage({
          completeClicked: true,
        }),
      );
      let response = null;
      const aggregatedCommitPending = isAggregatedCommitPending(basketItems);
      if (aggregatedCommitPending) {
        dispatch(
          updateHomeScreenStage({
            completeClicked: true,
          }),
        );
        response = await commitAggregatedItems(basketItems);
      }

      const commitPending = isCommitPending(basketItems);
      if (commitPending) {
        response = await commitBasket({ basketItems });
      }

      if (isNetworkError(response)) {
        dispatch(showNoNetworkModal());
        return;
      }
      if (receiptStatus === ReceiptStatus.notStarted) {
        setIsReceiptModalOpen(true);
      }
      return;
    } catch (e) {
      setDisableCompleteButton(false);
      basketLogger.error({
        methodName: BASKET_PROCESS_LOGS_FN.onCompletePressPB,
        error: e as Error,
      });
    }
  }, [basketItems, basketLogger, commitAggregatedItems, commitBasket, dispatch, receiptStatus]);

  const config = useMemo((): Config => {
    switch (stage) {
      case "home":
        const isRefund = basketItems.find(
          (item) => item?.journeyData?.transaction?.journeyType === JOURNEYENUM.REFUND,
        );
        if (isRefund) {
          return {
            onPress: onRefundPress,
            text: BUTTON.CTBTN0007,
            testId: BUTTON.CTBTN0007,
            disabled: false,
          };
        }

        if (basketValue > 0) {
          return {
            onPress: onPaymentPress,
            disabled: isDisabled,
            testId: BUTTON.CTBTN0001,
            text: BUTTON.CTBTN0001,
          };
        } else if (basketValue < 0) {
          return {
            onPress: onRepayPress,
            disabled: isDisabled,
            testId: BUTTON.CTBTN0009,
            text: BUTTON.CTBTN0009,
          };
        } else {
          return {
            onPress: onCompletePress,
            disabled: isDisabled || disableCompleteButton,
            testId: BUTTON.CTBTN0003,
            text: BUTTON.CTBTN0003,
          };
        }
      case "tendering":
        return {
          onPress: onCompletePress,
          disabled: txStatus === "" || disableFinishButton,
          testId: BUTTON.CTBTN0002,
          text: BUTTON.CTBTN0002,
        };
      default:
        return {
          onPress: onFinishPress,
          disabled: disableFinishButton,
          testId: BUTTON.CTBTN0002,
          text: BUTTON.CTBTN0002,
        };
    }
  }, [
    stage,
    basketItems,
    basketValue,
    txStatus,
    disableFinishButton,
    onRefundPress,
    isDisabled,
    onPaymentPress,
    onRepayPress,
    disableCompleteButton,
    onCompletePress,
    onFinishPress,
  ]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    if (basketcommitted(basketItems)) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [basketItems, loading]);

  useEffect(() => {
    let timer: number;
    if (stage === "completed") {
      timer = window.setTimeout(() => {
        onFinishPress();
      }, AppConstants.autoFinishTransactionTime);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [onFinishPress, stage]);

  return (
    <>
      <CustomModal
        isOpen={loading}
        title={STRING_CONSTANTS.HomeScreen.processingBasket}
        titleProps={{ textAlign: "center" }}
      />
      <BasketButton
        title={config.text}
        testID={config.text}
        disabled={config.disabled}
        variant="primary"
        size="sm_medium"
        onPress={config.onPress}
      />
      <ApiFailModal onFinishCallback={onFinishPress} />
      {closeBasketFailed && <CloseBasketFailureModal />}
      <SalesReceiptModal
        isOpen={isReceiptModalOpen}
        setIsOpen={setIsReceiptModalOpen}
        onPrintingFinished={async () => {
          await initiateCloseBasket();
          setDisableCompleteButton(false);
        }}
      />
    </>
  );
};
