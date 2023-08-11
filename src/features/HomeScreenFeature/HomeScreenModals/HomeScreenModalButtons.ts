import {
  CASH_TRANSFER_OUT_DISABLED,
  LOGOUT_CASHDRAWER_DISABLED,
  PMS_VISIBLE,
  POUCH_ACCEPTANCE_DISABLED,
  POUCH_DISPATCH_DISABLED,
} from "@ct/common";
import { StyledButtonProps } from "@ct/components";
import { BUTTON, SCREENS, stringConstants } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { NavigateFunction } from "react-router-dom";
import { isCommitInitiated } from "../homeScreen.helper";

interface moreMenuButtonsProps {
  setshowMorePopup: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  existsSuspendBasket: boolean;
  handleDissociateCashDrawer: (branchId: string) => void;
  basketItems: IbasketItem[];
  suspendBasketClicked: () => void;
  recallBasketClicked: () => void;
  handleReprintReceipt: () => void;
  showLicencesClick: () => void;
}

export const alertModalButton = (success: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Ok,
      enable: true,
      click: success,
    },
  };
};

export const confirmationModalPrimaryButton = (success: () => void): StyledButtonProps => ({
  label: stringConstants.Button.BTN_YES,
  testID: stringConstants.Button.BTN_YES,
  onPress: success,
});

export const confirmationModalSecondaryButton = (cancel: () => void): StyledButtonProps => ({
  label: stringConstants.Button.BTN_NO,
  testID: stringConstants.Button.BTN_NO,
  onPress: cancel,
});

export const confirmationModalBasketRestrictBtn = (cancel: () => void): StyledButtonProps => ({
  label: stringConstants.Button.Ok,
  testID: stringConstants.Button.Ok,
  onPress: cancel,
});

export const transCompleteModalButton = (success: () => void, cancel: () => void) => {
  return {
    success: {
      name: stringConstants.Button.Close,
      id: stringConstants.Button.BTN_CLOSE,
      enable: true,
      click: success,
    },

    cancel: {
      name: stringConstants.Button.BTN_NO,
      id: stringConstants.Button.BTN_NO,
      enable: false,
      click: cancel,
    },
  };
};

export const moreMenuButtons = (
  data: moreMenuButtonsProps,
  branchId: string,
  committedItemCount: number,
) => {
  const commitInitiated = isCommitInitiated(data.basketItems);
  return [
    {
      name: stringConstants.Button.CashTransferOut,
      id: stringConstants.Button.CashTransferOut,
      isDisabled: CASH_TRANSFER_OUT_DISABLED,
      visible: true,
      click: () => {
        data.setshowMorePopup(false);
        data.navigate(SCREENS.CASH_TRANSFER);
      },
    },
    {
      name: stringConstants.Button.PouchAcceptance,
      id: stringConstants.Button.PouchAcceptance,
      isDisabled: POUCH_ACCEPTANCE_DISABLED,
      visible: true,
      click: () => {
        data.setshowMorePopup(false);
        data.navigate(SCREENS.POUCH_ACCEPTANCE);
      },
    },
    {
      name: stringConstants.Button.Receipt,
      id: stringConstants.Button.Receipt,
      isDisabled: false,
      visible: true,
      click: () => {
        data.setshowMorePopup(false);
        data.handleReprintReceipt();
      },
    },
    {
      name: BUTTON.CTBTN0015,
      id: BUTTON.CTBTN0015,
      visible: true,
      isDisabled:
        data.existsSuspendBasket || LOGOUT_CASHDRAWER_DISABLED || data.basketItems.length !== 0,
      click: () => {
        data.setshowMorePopup(false);
        data.handleDissociateCashDrawer(branchId);
      },
    },
    {
      name: "Pouch Despatch",
      id: "PouchDispatch",
      visible: true,
      isDisabled: POUCH_DISPATCH_DISABLED,
      click: () => {
        data.setshowMorePopup(false);
        data.navigate(SCREENS.POUCH_DESPATCH);
      },
    },
    {
      name: "Devices",
      id: "PMS",
      isDisabled: false,
      visible: PMS_VISIBLE,
      click: () => {
        data.navigate(SCREENS.PMS_MODULE);
        data.setshowMorePopup(false);
      },
    },
    {
      name: stringConstants.Button.suspendBasket,
      id: stringConstants.Button.suspendBasket,
      isDisabled: data.basketItems.length === 0 || committedItemCount > 0 || commitInitiated,
      visible: !data.existsSuspendBasket,
      click: data.suspendBasketClicked,
    },
    {
      name: stringConstants.Button.recallBasket,
      id: stringConstants.Button.recallBasket,
      isDisabled: data.basketItems.length > 0,
      visible: data.existsSuspendBasket,
      click: data.recallBasketClicked,
    },
    {
      name: stringConstants.Button.systemInfo,
      id: stringConstants.Button.systemInfo,
      visible: true,
      isDisabled: false,
      click: data.showLicencesClick,
    },
  ];
};
