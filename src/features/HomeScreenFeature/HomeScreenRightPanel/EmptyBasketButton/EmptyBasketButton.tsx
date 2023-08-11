import {
  getBasket,
  useAppDispatch,
  useAppSelector,
  useCloseBasket,
  useVoidItemOrBasket,
} from "@ct/common";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { resetBasketIdStatus, updateCashPayment } from "@ct/common/state/HomeScreen";
import { resetBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { CustomModal, CustomModalProps, StyledButtonProps } from "@ct/components";
import { stringConstants, TEXT } from "@ct/constants";
import { isNetworkError } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { BasketButton } from "postoffice-spm-components";
import { useCallback, useMemo, useState } from "react";
import {
  confirmationModalPrimaryButton,
  confirmationModalSecondaryButton,
} from "../../HomeScreenModals";

export const EmptyBasketButton = () => {
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);
  const { selectedItem, basketItems } = useAppSelector(getBasket);
  const dispatch = useAppDispatch();
  const [modalProp, setModalProp] = useState<CustomModalProps | null>(null);
  const [isVoidableModal, setIsVoidableModal] = useState<boolean>(false);
  const { isDisabled, isBasketVoidable } = useVoidItemOrBasket();
  const { closeBasket } = useCloseBasket();
  const voidBasketClick = useCallback(async () => {
    try {
      const closeAlertModal = () => {
        setModalProp((prev) => (!prev ? null : { ...prev, isOpen: false }));
      };

      const clearBasket = async () => {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.clearBasket,
          message: BASKET_PROCESS_LOGS_MSG.voidingBasket,
          data: basketItems,
        });
        await closeBasket();
        dispatch(updateCashPayment(0));
        dispatch(resetBasket());
        dispatch(resetBasketIdStatus());
        closeAlertModal();
      };

      const voidBasketConfirmation: CustomModalProps = {
        testID: stringConstants.voidBasketModalTxt,
        title: stringConstants.voidBasketModalTxt,
        primaryButtonProps: confirmationModalPrimaryButton(clearBasket),
        secondaryButtonProps: confirmationModalSecondaryButton(closeAlertModal),
        isOpen: true,
      };

      if (selectedItem && Object.keys(selectedItem).length > 0) {
        dispatch(setLoadingActive({ id: LoadingId.VOID_BASKET }));
        const voidable = await isBasketVoidable();
        dispatch(setLoadingInactive(LoadingId.VOID_BASKET));
        if (voidable) {
          setModalProp(voidBasketConfirmation);
          return;
        }
        setIsVoidableModal(true);
      }
    } catch (error) {
      dispatch(setLoadingInactive(LoadingId.VOID_BASKET));
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      }
    }
  }, [basketItems, basketLogger, closeBasket, dispatch, isBasketVoidable, selectedItem]);

  const alertModalButton = useMemo<StyledButtonProps>(
    () => ({
      testID: stringConstants.CommitFailureModal.ok_Btn,
      label: stringConstants.CommitFailureModal.ok_Btn,
      onPress: () => {
        setIsVoidableModal(false);
      },
    }),
    [],
  );

  return (
    <>
      <BasketButton
        title={stringConstants.Button.EmptyBasket}
        testID={stringConstants.Button.EmptyBasket}
        disabled={isDisabled}
        variant="keypad"
        onPress={voidBasketClick}
      />
      <CustomModal
        testID={TEXT.CTTXT0006}
        title={TEXT.CTTXT0006}
        isOpen={isVoidableModal}
        contentSize="small"
        primaryButtonProps={alertModalButton}
      />
      {modalProp !== null && <CustomModal {...modalProp} />}
    </>
  );
};
