import { StyledErrorWarningAmberIcon, StyledNetworkWifiIcon } from "@ct/assets/icons";
import { useAppDispatch, useAppSelector } from "@ct/common";
import { getNoInternetModalStatus } from "@ct/common/selectors/common/noInternetSelector";
import { signOutUser } from "@ct/common/state/auth.slice";
import {
  hideNetworkRestoredModal,
  hideNoNetworkModal,
} from "@ct/common/state/common/noNetwork.slice";
import { resetLoadingStatus } from "@ct/common/state/loadingStatus.slice";
import { resetPedState } from "@ct/common/state/ped.slice";
import { setTouchKeyboardEnabled } from "@ct/common/state/touchKeyboard.slice";
import { CustomModal } from "@ct/components";
import { BUTTON, TEXT, stringConstants } from "@ct/constants";

export const InternetFailureModal = () => {
  const { isVisible, isVisibleNetworkRestored } = useAppSelector(getNoInternetModalStatus);
  const dispatch = useAppDispatch();
  const { isUserLoggedIn } = useAppSelector((rootState) => rootState.auth);

  const alertModalButton = {
    testID: BUTTON.CTBTN0005,
    label: BUTTON.CTBTN0005,
    onPress: () => {
      if (isVisibleNetworkRestored && isUserLoggedIn) {
        dispatch(resetPedState());
        setTimeout(() => {
          dispatch(hideNetworkRestoredModal());
          dispatch(setTouchKeyboardEnabled(false));
          dispatch(signOutUser());
        }, 500);
      } else {
        dispatch(hideNetworkRestoredModal());
        dispatch(resetLoadingStatus());
        dispatch(hideNoNetworkModal());
      }
    },
  };

  return (
    <>
      <CustomModal
        testID={stringConstants.CommitFailureModal.internetFailureTestId}
        title={TEXT.CTTXT00052}
        content={TEXT.CTTXT00051}
        isOpen={isVisible}
        icon={<StyledErrorWarningAmberIcon />}
        contentSize="medium"
      />
      <CustomModal
        testID={stringConstants.CommitFailureModal.internetFailureTestId}
        title={TEXT.CTTXT00075}
        content={TEXT.CTTXT00076(isUserLoggedIn)}
        isOpen={isVisibleNetworkRestored}
        primaryButtonProps={alertModalButton}
        icon={<StyledNetworkWifiIcon />}
        contentSize="medium"
      />
    </>
  );
};
