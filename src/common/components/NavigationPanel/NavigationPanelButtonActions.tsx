import { useDissociationCashDrawerCounterHook } from "@ct/api/generator";
import { StyledErrorWarningAmberIcon } from "@ct/assets/icons";
import {
  getBasket,
  useAppDispatch,
  useAppSelector,
  useCloseBasket,
  useFeatureFlag,
  useGetSuspendedBasket,
  useVoidItemOrBasket,
} from "@ct/common";
import { ERROR_CODES } from "@ct/common/ErrorCodes";
import { API_LOGS_FN, API_LOGS_MSG } from "@ct/common/constants/APILogs";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";
import { STORAGE_KEYS } from "@ct/common/enums";
import { updateBasketIdStatus } from "@ct/common/state/HomeScreen";
import { updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { updateSuspendBasketNotification } from "@ct/common/state/HomeScreen/updateSuspendBasketNotification";
import { signOutUser } from "@ct/common/state/auth.slice";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { resetPedState } from "@ct/common/state/ped.slice";
import { CustomModalProps, StyledButtonProps } from "@ct/components";
import {
  BUTTON,
  SCREENS,
  STRING_CONSTANTS,
  TEXT,
  featureFlags,
  stringConstants,
} from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import {
  clearSuspendedBasket,
  getItem,
  isNetworkError,
  preUpdateBasket,
  removeItem,
  suspendBasket,
} from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import { CustomModalSize } from "postoffice-commit-and-fulfill/dist/types";
import { useNavigate } from "react-router-dom";
import {
  confirmationModalPrimaryButton,
  confirmationModalSecondaryButton,
} from "../../../features/HomeScreenFeature/HomeScreenModals";

interface HelpersProps {
  setModal: React.Dispatch<React.SetStateAction<CustomModalProps | null>>;
  setShowNavigationMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItemFromNavigationPanel: React.Dispatch<React.SetStateAction<string>>;
}

const NavigationPanelButtonActions = ({
  setModal,
  setShowNavigationMenu,
  setSelectedItemFromNavigationPanel,
}: HelpersProps) => {
  const { isBasketEmpty } = useAppSelector(getBasket);
  const { existsSuspendBasket, suspendedBasket, setSuspendedBasket, setExistsSuspendBasket } =
    useGetSuspendedBasket();
  const dissociateCashDrawer = useDissociationCashDrawerCounterHook();
  const navigate = useNavigate();
  const { isBasketVoidable } = useVoidItemOrBasket();
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);
  const apiLogger = logManager(LOGGER_TYPE.apiLogger);
  const { basketItems } = useAppSelector(getBasket);
  const dispatch = useAppDispatch();
  const [shouldUseFederatedSignIn] = useFeatureFlag(featureFlags.shouldUseFederatedSignIn);
  const { closeBasket } = useCloseBasket();

  const closeModal = () => {
    setModal((prev) => (!prev ? null : { ...prev, ...{ isOpen: false } }));
    setShowNavigationMenu(false);
  };

  const logOff = async () => {
    // ped state should be reset to allow fresh init on login
    dispatch(resetPedState());
    setTimeout(() => {
      shouldUseFederatedSignIn && dispatch(signOutUser());
    }, 500);
    closeModal();
  };

  const unableToLogOffTransactionModalContent = {
    isOpen: true,
    title: TEXT.CTTXT00032,
    content: TEXT.CTTXT00031,
    icon: <StyledErrorWarningAmberIcon />,
    primaryButtonProps: {
      label: stringConstants.Button.Ok,
      onPress: () => closeModal(),
    },
  };

  const logoutConfirmationModalContent: CustomModalProps = {
    testID: stringConstants.logoutModalTxt,
    title: existsSuspendBasket
      ? STRING_CONSTANTS.logOffMsgIfSuspendedBasket
      : STRING_CONSTANTS.logoutModalTxt,
    primaryButtonProps: confirmationModalPrimaryButton(logOff),
    secondaryButtonProps: confirmationModalSecondaryButton(closeModal),
    isOpen: true,
  };

  const suspendBasketModalContent: CustomModalProps = {
    testID: stringConstants.CommitFailureModal.internetFailureTestId,
    title: TEXT.CTTXT00073,
    content: TEXT.CTTXT00074,
    isOpen: true,
    icon: <StyledErrorWarningAmberIcon />,
    contentSize: CustomModalSize.MEDIUM,
    primaryButtonProps: {
      testID: stringConstants.Button.Continue,
      label: stringConstants.Button.Continue,
      onPress: () => {
        closeModal();
        handleSuspendBasketAfterConfirmation();
      },
    },
    secondaryButtonProps: {
      testID: stringConstants.Button.Cancel_Button,
      label: stringConstants.Button.Cancel_Button,
      onPress: () => closeModal(),
    },
  };

  const developmentInProgressModalContent: CustomModalProps = {
    title: TEXT.CTTXT00079,
    primaryButtonProps: {
      ...confirmationModalPrimaryButton(closeModal),
      label: stringConstants.Button.Ok,
    },
    isOpen: true,
  };

  const primaryButtonLogoutCashDrawerFailure: StyledButtonProps = {
    testID: BUTTON.CTBTN0016,
    label: BUTTON.CTBTN0016,
    onPress: () => {
      closeModal();
    },
  };

  const dispatchBasketData = (basketArray: IbasketItem[]) => {
    dispatch(updateBasket(preUpdateBasket(basketArray)));
  };

  const updateDataAfterRecallbasket = async () => {
    await clearSuspendedBasket();
    setSuspendedBasket({ item: [], time: +new Date() });
    setExistsSuspendBasket(false);
  };

  const logoutCashDrawerFailureModal = (e: unknown): CustomModalProps => {
    const title = get(e, "response.data.message", STRING_CONSTANTS.messages.somethingWentWrong);
    const errorCode = get(e, "response.data.errorCode");
    if (errorCode === ERROR_CODES.cashDrawer.drawerAlreadyDissociated) {
      apiLogger.error({
        methodName: API_LOGS_FN.logoutCashDrawerFailureModal,
        message: API_LOGS_MSG.cashDrawerAlreadyDissociated,
        error: errorCode,
      });
      removeItem(STORAGE_KEYS.CTSTK0006);
      navigate(SCREENS.CASH_DRAWER);
    }
    return {
      testID: stringConstants.logoutModalTxt,
      title: title,
      primaryButtonProps: primaryButtonLogoutCashDrawerFailure,
      isOpen: true,
    };
  };

  const handleLogoff = () => {
    if (!isBasketEmpty) {
      setModal(unableToLogOffTransactionModalContent);
      return;
    }
    setModal(logoutConfirmationModalContent);
  };

  const handleRecallBasket = async () => {
    if (!existsSuspendBasket) {
      return;
    }
    dispatch(
      updateSuspendBasketNotification({
        isVisible: true,
      }),
    );
    dispatchBasketData(suspendedBasket.item);
    updateDataAfterRecallbasket();
    setShowNavigationMenu(false);
  };

  const handleSuspendBasketAfterConfirmation = async () => {
    dispatch(setLoadingActive({ id: LoadingId.SUSPEND_BASKET_MODAL }));
    try {
      await closeBasket();
      const isSuspended = await suspendBasket(basketItems);
      if (isSuspended) {
        dispatch(
          updateBasketIdStatus({
            closeBasketFailed: false,
          }),
        );
        dispatchBasketData([]);
      }
      setSuspendedBasket({ item: basketItems, time: +new Date() });
      dispatch(
        updateSuspendBasketNotification({
          isVisible: false,
        }),
      );
      setExistsSuspendBasket(true);
      dispatch(setLoadingInactive(LoadingId.SUSPEND_BASKET_MODAL));
    } catch (error) {
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      } else {
        dispatch(
          updateBasketIdStatus({
            closeBasketFailed: true,
          }),
        );
      }
    }
  };

  const handleSuspendBasket = async () => {
    dispatch(setLoadingActive({ id: LoadingId.SUSPEND_BASKET_MODAL }));
    try {
      const status = await isBasketVoidable();
      dispatch(setLoadingInactive(LoadingId.SUSPEND_BASKET_MODAL));
      if (!status) {
        appLogger.info({
          methodName: APP_LOGS_FN.suspendBasketClicked,
          message: APP_LOGS_MSG.suspendNotAfterCommit,
        });
        return;
      }
      setModal(suspendBasketModalContent);
    } catch (error) {
      if (isNetworkError(error)) {
        dispatch(showNoNetworkModal());
      }
    }
  };

  const handleLogoutCashDrawer = async () => {
    const requestBody = { cashDrawerID: getItem(STORAGE_KEYS.CTSTK0006) };
    try {
      const apiResponse = await dissociateCashDrawer(requestBody);
      removeItem(STORAGE_KEYS.CTSTK0006);
      appLogger.info({
        methodName: APP_LOGS_FN.handleDissociateCashDrawer,
        message: APP_LOGS_MSG.cashDrawerDisSuccess,
        logData: { apiResponse, requestBody },
      });
      navigate(SCREENS.CASH_DRAWER);
    } catch (error) {
      appLogger.fatal({
        methodName: APP_LOGS_FN.handleDissociateCashDrawer,
        error: error as Error,
        message: APP_LOGS_MSG.failDisCashDrawer,
        logData: { requestBody },
      });
      setModal(logoutCashDrawerFailureModal(error));
    }
  };

  const handleDevelopmentInProgress = (item?: string) => {
    if (item) {
      setSelectedItemFromNavigationPanel(item);
      setModal(developmentInProgressModalContent);
    } else {
      setShowNavigationMenu(false);
    }
  };

  const handleCashTransferOut = () => navigate(SCREENS.CASH_TRANSFER);
  const handleDevices = () => navigate(SCREENS.PMS_MODULE);
  const handleLicenses = () => navigate(SCREENS.LICENCE_INFO);
  const handlePouchAcceptance = () => navigate(SCREENS.POUCH_ACCEPTANCE);
  const handlePouchDispatch = () => navigate(SCREENS.POUCH_DESPATCH);
  const handleReprintReceipt = () => navigate(SCREENS.RECEIPT);
  const handleSystemInfo = () => navigate(SCREENS.SYSTEM_INFO);

  type HamburgerButtonFunctions = ((item?: string) => void) | (() => Promise<void>);

  type HamburgerButtonMapper = {
    [key: string]: HamburgerButtonFunctions;
  };

  const hamburgerActionMapper: HamburgerButtonMapper = {
    "Cash transfer out": handleCashTransferOut,
    Devices: handleDevices,
    Licences: handleLicenses,
    "Log off": handleLogoff,
    "Logout cash drawer": handleLogoutCashDrawer,
    "Pouch acceptance": handlePouchAcceptance,
    "Pouch dispatch": handlePouchDispatch,
    "Recall basket": handleRecallBasket,
    "Reprint receipt": handleReprintReceipt,
    "Suspend basket": handleSuspendBasket,
    "System info": handleSystemInfo,
    handleDevelopmentInProgress,
  };
  return hamburgerActionMapper;
};

export default NavigationPanelButtonActions;
