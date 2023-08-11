import { PED_LOGS_FN } from "@ct/common/constants/PEDLogs";
import { isMessagePrompt, isRecord } from "@ct/common/helpers/validation";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { IngenicoPedClient, PosDisplayEvent } from "postoffice-peripheral-management-service";
import { Dispatch, SetStateAction, useCallback } from "react";

export default function usePedActionHandler(
  pinPad: IngenicoPedClient,
  setPinPadErrorId: Dispatch<SetStateAction<string | null>>,
  setPinPadErrorDescription: Dispatch<SetStateAction<string | null>>,
) {
  return useCallback(
    async (event: PosDisplayEvent) => {
      try {
        await pinPad.sendEvent(event.event);
      } catch (error) {
        const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);
        pmsLogger.fatal({
          methodName: PED_LOGS_FN.pedActionHandler,
          error: error as Error,
        });

        if (typeof error === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error);
        } else if (isRecord(error) && "message" in error && typeof error.message === "string") {
          setPinPadErrorId(null);
          setPinPadErrorDescription(error.message);
        } else if (isRecord(error) && "prompt" in error && isMessagePrompt(error.prompt)) {
          setPinPadErrorId(error.prompt.id);
          setPinPadErrorDescription(error.prompt.description);
        } else {
          setPinPadErrorId(null);
          setPinPadErrorDescription("An unknown error occurred.");
        }
      }
    },
    [pinPad, setPinPadErrorDescription, setPinPadErrorId],
  );
}
