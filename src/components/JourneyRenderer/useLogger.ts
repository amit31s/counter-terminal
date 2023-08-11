import { useAppDispatch } from "@ct/common";
import { updateJourneyStatus } from "@ct/common/state/HomeScreen/updateJourneyStatus.slice";
import { JourneyInterruptContext } from "@ct/screens/HomeScreen/JourneyInterruptContext";
import { LOG_LEVEL } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { ProviderProps } from "postoffice-spm-journey-engine";
import { useContext, useMemo } from "react";

const journeyLogger = logManager(LOGGER_TYPE.journeyEngineLogger);

export function useLogger(): ProviderProps["logger"] {
  const dispatch = useAppDispatch();
  const { journeyReset } = useContext(JourneyInterruptContext);

  return useMemo(
    () => ({
      level: "info",
      handler: {
        log(message) {
          journeyLogger.levelLogger(LOG_LEVEL.info)(message);
          const stateData = {
            EventName: message.eventName,
            DisplayPageNumber: message.pageNumber as number,
          };
          if (stateData.DisplayPageNumber === 1) {
            journeyReset();
          }
          dispatch(updateJourneyStatus(stateData));
        },
      },
    }),
    [dispatch, journeyReset],
  );
}
