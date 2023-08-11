import { StyledWarningIcon } from "@ct/assets/icons";
import { ScannerInput, useGetJourneyStatus } from "@ct/common";
import { useGetShowSuspendBasketNotification } from "@ct/common/hooks/homeScreenHooks/useGetShowSuspendBasketNotification";
import { useGetTimer } from "@ct/common/hooks/homeScreenHooks/useGetTimer";
import { Notification, NotificationStatus } from "@ct/components/Notification/Notification";
import { TEXT, stringConstants } from "@ct/constants";
import { JourneyInterruptContext } from "@ct/screens/HomeScreen/JourneyInterruptContext";
import { Flex } from "native-base";
import { Dispatch, RefObject, SetStateAction, useCallback, useContext, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { generateOutput } from "./generateOutput";
import { useHandleBarcodeScan } from "./useHandleBarcodeScan";
import { useHandleCloseNotification } from "./useHandleCloseNotification";
import { useIsBarcodeInBasket } from "./useIsBarcodeInBasket";
import { useMSRInterrupt } from "./useMSRInterrupt";

export type InputBarProps = {
  scannerInputRef?: RefObject<TextInput>;
  barcodeNotRecognized: boolean;
  setBarcodeNotRecognized: Dispatch<SetStateAction<boolean>>;
};

export function InputBar({
  scannerInputRef,
  barcodeNotRecognized,
  setBarcodeNotRecognized,
}: InputBarProps) {
  const { showSuspendBasketNotification, setShowSuspendBasketShowNotification } =
    useGetShowSuspendBasketNotification();
  const { isJourneyStarted } = useGetJourneyStatus();
  const { minutes, seconds } = useGetTimer(showSuspendBasketNotification);
  const { timeRemaining, unitOfTime } = generateOutput(minutes, seconds);

  const [duplicateBarcodeFlag, setDuplicateBarcodeFlag] = useState(false);
  const { setInterruptionInputData } = useContext(JourneyInterruptContext);

  const resetKeyedBarcodeFlags = useCallback(() => {
    if (duplicateBarcodeFlag) {
      setDuplicateBarcodeFlag(false);
    }
    if (barcodeNotRecognized) {
      setBarcodeNotRecognized(false);
    }
  }, [barcodeNotRecognized, duplicateBarcodeFlag, setBarcodeNotRecognized]);

  const handleCloseNotification = useHandleCloseNotification(setShowSuspendBasketShowNotification);
  const isBarcodeInBasket = useIsBarcodeInBasket(setDuplicateBarcodeFlag);
  const handleBarcodeScan = useHandleBarcodeScan(isBarcodeInBasket, setInterruptionInputData);

  useMSRInterrupt(isBarcodeInBasket, setInterruptionInputData);
  const styles = StyleSheet.create({
    flexContainer: {
      width: "832px",
    },
  });
  return (
    <Flex direction="row" alignItems="center" style={styles.flexContainer}>
      <Flex flex={1}>
        {showSuspendBasketNotification && timeRemaining ? (
          <Notification
            icon={<StyledWarningIcon />}
            onClosePress={handleCloseNotification}
            title={TEXT.CTTXT0009}
            message={TEXT.CTTXT0008(timeRemaining, unitOfTime)}
            id={TEXT.CTTXT00010}
            type={NotificationStatus.WARNING}
          />
        ) : (
          <ScannerInput
            showIcon={true}
            error={
              duplicateBarcodeFlag
                ? stringConstants.duplicateBarcodeError
                : barcodeNotRecognized
                ? stringConstants.barcodeNotRecognized
                : ""
            }
            clearErrors={resetKeyedBarcodeFlags}
            scannerInputRef={scannerInputRef}
            onSubmitBarcode={handleBarcodeScan}
            isDisabled={isJourneyStarted}
            hideEnterButton={true}
            placeholder={stringConstants.Input.barcodeScannerHome}
          />
        )}
      </Flex>
    </Flex>
  );
}
