import { useAppDispatch, useGetJourneyStatus } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { setLoadingActive, setLoadingInactive } from "@ct/common/state/loadingStatus.slice";
import { SCREENS } from "@ct/constants";
import { getItem } from "@ct/utils";
import { Box } from "native-base";
import { ProviderProps } from "postoffice-spm-journey-engine";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { JourneyInterruptionTypes } from "./JourneyInterruptionTypes.enum";
import { maybeTokenisePayload } from "./maybeTokenisePayload";
import { StyledDefaultWarningAmberIcon } from "@ct/assets/icons";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { JOURNEY_LOGS_FN, JOURNEY_LOGS_VARS } from "@ct/common/constants/JourneyLogs";

const pouchFormat = /^0[1,3]\d{14}$|^\d{12}$/;
const cashDrawerFormat = /^\d{5,6}[0-9X]-CD-\d{1,2}-\d{10}$/;
const journeyEngineLogger = logManager(LOGGER_TYPE.journeyEngineLogger);

export function useHandleBarcodeScan(
  isBarcodeInBasket: (barcode: string) => boolean,
  setInterruptionInputData: Dispatch<SetStateAction<ProviderProps["interruptionInputData"]>>,
) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isJourneyStarted } = useGetJourneyStatus();

  return useCallback(
    async (barcodeValue: string, wasKeyed: boolean) => {
      if (isJourneyStarted) {
        return;
      }

      if (pouchFormat.test(barcodeValue)) {
        navigate(SCREENS.POUCH_ACCEPTANCE);
        return;
      }

      if (cashDrawerFormat.test(barcodeValue)) {
        dispatch(
          setLoadingActive({
            id: "ScannedCashDrawerWarning",
            modalProps: {
              icon: (
                <Box>
                  <StyledDefaultWarningAmberIcon />
                </Box>
              ),
              title: "Cash drawer scanned",
              content:
                getItem(STORAGE_KEYS.CTSTK0006) === barcodeValue
                  ? "This cash drawer is already associated with this counter."
                  : "You must log out the current cash drawer before associating a new one.",
              primaryButtonProps: {
                label: "Close",
                onPress: () => {
                  dispatch(setLoadingInactive("ScannedCashDrawerWarning"));
                },
              },
            },
          }),
        );
        return;
      }

      if (!isBarcodeInBasket(barcodeValue)) {
        journeyEngineLogger.info({
          service: JOURNEY_LOGS_FN.journey,
          methodName: JOURNEY_LOGS_FN.handleBarcodeScan,
          message: JOURNEY_LOGS_VARS.barcodeSet(wasKeyed),
        });
        setInterruptionInputData(
          maybeTokenisePayload(barcodeValue, [
            JourneyInterruptionTypes.Barcode,
            JourneyInterruptionTypes.MagCard,
          ]) as ProviderProps["interruptionInputData"],
        );
      }
    },
    [dispatch, isBarcodeInBasket, isJourneyStarted, navigate, setInterruptionInputData],
  );
}
