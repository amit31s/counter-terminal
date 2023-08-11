import {
  getBasket,
  useAppDispatch,
  useAppSelector,
  useCloseBasket,
  useVoidItemOrBasket,
} from "@ct/common";
import { BASKET_PROCESS_LOGS_FN, BASKET_PROCESS_LOGS_MSG } from "@ct/common/constants/BasketLogs";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { updateCashPayment } from "@ct/common/state/HomeScreen";
import { setSelectedItem, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { CustomModal, CustomModalProps, StyledButtonProps } from "@ct/components";
import { STATE_CONSTANTS, stringConstants, TEXT } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { isNetworkError, preUpdateBasket } from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { isEmpty } from "lodash";
import { BasketButton } from "postoffice-spm-components";
import { useCallback, useMemo, useState } from "react";
import {
  confirmationModalPrimaryButton,
  confirmationModalSecondaryButton,
} from "../../HomeScreenModals";

export const RemoveItemButton = () => {
  const [modalProp, setModalProp] = useState<CustomModalProps | null>(null);
  const { basketItems, selectedItem } = useAppSelector(getBasket);
  const { closeBasket } = useCloseBasket();
  const dispatch = useAppDispatch();
  const [isVoidableModal, setIsVoidableModal] = useState<boolean>(false);
  const { isDisabled, isItemVoidable } = useVoidItemOrBasket();
  const basketLogger = logManager(LOGGER_TYPE.basketLogger);

  const voidItemClick = useCallback(async () => {
    try {
      const closeAlertModal = () => {
        setModalProp((prev) => (!prev ? null : { ...prev, isOpen: false }));
      };

      const dispatchBasketData = (basketArray: IbasketItem[]) => {
        dispatch(updateBasket(preUpdateBasket(basketArray)));
        dispatch(setSelectedItem(basketArray[0]));
      };

      const removeItemFromBasket = async () => {
        basketLogger.info({
          methodName: BASKET_PROCESS_LOGS_FN.removeItemFromBasket,
          message: BASKET_PROCESS_LOGS_MSG.removingBasketItem,
          data: selectedItem,
        });
        const filterBasket: IbasketItem[] = [];
        for (let index = 0; index < basketItems.length; index++) {
          const element: IbasketItem = basketItems[index];
          if (element.id !== selectedItem?.id) {
            filterBasket.push(element);
          }
        }
        if (selectedItem?.id === STATE_CONSTANTS.CASH) {
          dispatch(updateCashPayment(0));
        }
        dispatchBasketData(filterBasket);
        if (!filterBasket.length) {
          await closeBasket();
        }
        closeAlertModal();
      };

      const voidBasketItemConfirmation: CustomModalProps = {
        testID: stringConstants.voidBasketItemModalTxt,
        content: stringConstants.voidBasketItemModalTxt,
        primaryButtonProps: confirmationModalPrimaryButton(removeItemFromBasket),
        secondaryButtonProps: confirmationModalSecondaryButton(closeAlertModal),
        isOpen: true,
      };

      if (isEmpty(selectedItem)) {
        return;
      }
      dispatch(setLoadingActive({ id: LoadingId.VOID_ITEM }));
      const voidable = await isItemVoidable(selectedItem);
      dispatch(setLoadingInactive(LoadingId.VOID_ITEM));
      if (voidable) {
        setModalProp(voidBasketItemConfirmation);
        return;
      }
      setIsVoidableModal(true);
    } catch (error) {
      dispatch(setLoadingInactive(LoadingId.VOID_ITEM));
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      }
    }
  }, [basketItems, basketLogger, closeBasket, dispatch, isItemVoidable, selectedItem]);

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
        title={stringConstants.Button.RemoveItem}
        testID={stringConstants.Button.RemoveItem}
        disabled={isDisabled}
        variant="keypad"
        onPress={voidItemClick}
      />
      <CustomModal
        testID={TEXT.CTTXT0005}
        title={TEXT.CTTXT0005}
        isOpen={isVoidableModal}
        contentSize="small"
        primaryButtonProps={alertModalButton}
      />
      {modalProp !== null && <CustomModal {...modalProp} />}
    </>
  );
};
