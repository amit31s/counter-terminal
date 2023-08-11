import { onPrint } from "@ct/utils/Printer/samplePrinting";
import { getHTMLTemplate } from "@ct/utils/Printer/templates";
import { printPhysicalReceipt } from "../../Services/ReceiptService";
import { PrinterActions } from ".././types/Devices";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { JOURNEY_LOGS_FN } from "@ct/common/constants/JourneyLogs";

export const journeyPrinterTrigger = async (
  action: PrinterActions,
  params: Record<string, unknown> | null,
): Promise<Record<string, never>> => {
  switch (action) {
    case "print":
      try {
        if (params?.value) {
          console.warn(
            "WARNING! Passing raw template in journey is deprecated, please store in configuration-api",
          );
          await onPrint(params?.value as string);
          return Promise.resolve({});
        }
        await printPhysicalReceipt(
          params?.template as string,
          params?.context as Record<string, unknown>,
        );
        return Promise.resolve({});
      } catch (err) {
        const journeyEngineLogger = logManager(LOGGER_TYPE.journeyEngineLogger);
        journeyEngineLogger.fatal({
          service: JOURNEY_LOGS_FN.deviceActionsCallback,
          methodName: JOURNEY_LOGS_FN.journeyPrinterTrigger,
          error: err as Error,
        });
        return Promise.reject(err);
      }
    case "printFromTemplate":
      try {
        const html = await getHTMLTemplate(params);
        await onPrint(html);
        return Promise.resolve({});
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    default:
      return Promise.reject(`Printer action not found: ${action}`);
  }
};
