import { POL_DEVICE_SERVER_HOST, POL_DEVICE_SERVER_SIMULATED } from "@ct/common/backendUrl";
import { AppData } from "@ct/components/JourneyRenderer/useAppData";
import { getUserName } from "@ct/utils/Services/auth";
import {
  IngenicoPedClient,
  LabelAvailablePrinters,
  LabelPrinterClient,
  PedActions,
  PosDisplayEvent,
  SupportedServices,
  convertL2GCode,
  setup as setupDeviceService,
} from "postoffice-peripheral-management-service";
import { Device, PrinterActions } from ".././Devices";
import { getTerminalId, journeyPrinterTrigger } from "./helpers";
import { errorChecker } from "./helpers/errorChecker";

const pedDeviceService = setupDeviceService({
  deviceServerHost: POL_DEVICE_SERVER_HOST,
  disconnectAfterResponse: true,
});

const labelPrinterService = setupDeviceService({
  deviceServerHost: POL_DEVICE_SERVER_HOST,
  disconnectAfterResponse: true,
});

export const labelPrinterClient = labelPrinterService?.buildClient(SupportedServices.LabelPrinter, {
  useMock: POL_DEVICE_SERVER_SIMULATED,
}) as LabelPrinterClient;

export const DeviceActionsCallback = async (
  device: Device,
  action: string,
  params: Record<string, unknown> | null,
  appData: AppData,
): Promise<Record<string, unknown>> => {
  switch (device) {
    // Any as return type is variant
    case Device.Printer:
      return await journeyPrinterTrigger(action as PrinterActions, params);
    case Device.LabelPrinter:
      const zplString = convertL2GCode(params?.label as string, 300);

      const result = await labelPrinterClient.print({
        label: zplString,
        printer: params?.printer as LabelAvailablePrinters,
      });
      return Promise.resolve(result as unknown as Record<string, unknown>);
    case Device.Ped:
      // If cancel on enabler set action to Abort_X
      if (action === "cancel" && params) {
        action = PedActions.POSEvent;
        params.event = "CANCEL";
      }

      const pedAction = action as PedActions;
      const clerkId = getUserName();
      const event = params?.event as string;
      const amount = params?.amount as number;
      const transactionId = params?.transactionId as string;
      const terminalId = getTerminalId(appData);

      const pinPad = pedDeviceService.buildClient(SupportedServices.IngenicoPed, {
        terminalId,
        clerkId,
        useMock: POL_DEVICE_SERVER_SIMULATED,
      }) as IngenicoPedClient;

      errorChecker(transactionId, action, amount, event);
      try {
        switch (pedAction) {
          case PedActions.BalanceEnquiryX:
            return await pinPad.balanceEnquiryCheck(transactionId);
          case PedActions.POSEvent:
            if (POL_DEVICE_SERVER_SIMULATED) {
              const broadcastChannel = new BroadcastChannel("IngenicoPed");
              broadcastChannel.postMessage({ pan: "", event: "Declined" });
              broadcastChannel.close();
              return {};
            }
            pinPad.sendEvent(params?.event as PosDisplayEvent["event"]);
            return Promise.resolve({});
          case PedActions.ChangePinX:
            return await pinPad.changePinCheck(transactionId);
          case PedActions.WithdrawalX:
            return await pinPad.withdrawalCheck(amount, transactionId);
          case PedActions.DepositX:
            return await pinPad.depositCheck(amount, transactionId);
          case PedActions.AbortX:
            return await pinPad.abort(transactionId);
          case PedActions.GetCardToken:
            const customerPresent = params?.customerPresent === "true";
            return await pinPad.cardToken(customerPresent);
          default:
            return Promise.reject(`PED action not found: ${pedAction}`);
        }
      } catch (error) {
        // lib will return an reject for a non approved response for order x
        // but we want to allow journey to process it and return the error to the user
        return Promise.resolve(error as Record<string, unknown>);
      }
    default:
      return Promise.reject(`Device not found: ${device}`);
  }
};
