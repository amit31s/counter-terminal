import { StyledErrorWarningAmberIcon } from "@ct/assets/icons";
import { getFulfillmentData, useAppDispatch, useAppSelector, useGetUser } from "@ct/common";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import {
  FulfillmentStatusEnum,
  updateFulfillment,
} from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { resetLoadingStatus } from "@ct/common/state/loadingStatus.slice";
import { CustomModal, StyledButtonProps } from "@ct/components";
import { stringConstants } from "@ct/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Content } from "./Content";

export const FulfilmentFailureItemsListModal = () => {
  const {
    device: { deviceID },
  } = useGetUser();
  const dispatch = useAppDispatch();
  const { fulfillmentStatus, failedItems } = useAppSelector(getFulfillmentData);
  const { changeValueToZero } = useBasket();
  const [showModal, setShowModal] = useState<boolean>(false);

  const updateFulfillmentStatus = useCallback(() => {
    dispatch(
      updateFulfillment({
        fulfillmentStatus: FulfillmentStatusEnum.SKIPPED,
        deviceId: deviceID,
      }),
    );
  }, [deviceID, dispatch]);

  const alertModalButton = useMemo<StyledButtonProps>(
    () => ({
      testID: stringConstants.ProductFulfillmentFailureModal.ok_Btn,
      label: stringConstants.CommitFailureModal.ok_Btn,
      onPress: () => {
        const uniqueID = failedItems.map((item) => item.id);
        updateFulfillmentStatus();
        changeValueToZero(uniqueID);
        setShowModal(false);
      },
    }),
    [changeValueToZero, failedItems, updateFulfillmentStatus],
  );

  useEffect(() => {
    if (fulfillmentStatus === FulfillmentStatusEnum.FAILED) {
      dispatch(resetLoadingStatus());
      setShowModal(true);
    }
  }, [dispatch, fulfillmentStatus]);

  return (
    <CustomModal
      testID={stringConstants.ProductFulfillmentFailureModal.productFailureTestId}
      content={<Content />}
      isOpen={showModal}
      primaryButtonProps={alertModalButton}
      icon={<StyledErrorWarningAmberIcon />}
      contentSize="medium"
    />
  );
};
