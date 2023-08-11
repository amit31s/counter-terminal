import { useGetJourneyStatus, useMagneticSwipeCardReader } from "@ct/common";
import { ProviderProps } from "postoffice-spm-journey-engine";
import { Dispatch, SetStateAction, useMemo } from "react";
import { JourneyInterruptionTypes } from "./JourneyInterruptionTypes.enum";
import { maybeTokenisePayload } from "./maybeTokenisePayload";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { PED_LOGS_FN, PED_LOGS_MSG } from "@ct/common/constants/PEDLogs";

export function useMSRInterrupt(
  isBarcodeInBasket: (barcode: string) => boolean,
  setInterruptionInputData: Dispatch<SetStateAction<ProviderProps["interruptionInputData"]>>,
) {
  const { isJourneyStarted } = useGetJourneyStatus();
  const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

  useMagneticSwipeCardReader(
    useMemo(
      () => ({
        onSwipe(cardValue: string) {
          if (isJourneyStarted) {
            pmsLogger.info({
              service: PED_LOGS_FN.useMagneticSwipeCardReader,
              methodName: PED_LOGS_FN.onSwipe,
              message: PED_LOGS_MSG.unableToStopJourney,
            });
            return;
          }

          if (!isBarcodeInBasket(cardValue)) {
            setInterruptionInputData(
              maybeTokenisePayload(cardValue, [
                JourneyInterruptionTypes.MagCard,
              ]) as ProviderProps["interruptionInputData"],
            );
          }
        },
      }),
      [isBarcodeInBasket, isJourneyStarted, setInterruptionInputData],
    ),
  );
}
