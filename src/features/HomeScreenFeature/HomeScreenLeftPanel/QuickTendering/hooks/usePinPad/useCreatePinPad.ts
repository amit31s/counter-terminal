import { POL_DEVICE_SERVER_HOST, POL_DEVICE_SERVER_SIMULATED, useAppSelector } from "@ct/common";
import { getTerminalId } from "@ct/common/helpers/getTerminalId";
import { stringConstants } from "@ct/constants";
import { getUserName } from "@ct/utils/Services/auth";
import {
  IngenicoPedClient,
  PosDisplayEvent,
  ServiceEvent,
  SupportedServices,
  getEventTagMapping,
  setup,
} from "postoffice-peripheral-management-service";
import { Dispatch, SetStateAction, useMemo } from "react";

export default function useCreatePinPad(
  setPaymentProcessMsg: Dispatch<SetStateAction<string>>,
  setPedActions: Dispatch<SetStateAction<PosDisplayEvent[]>>,
) {
  const { device } = useAppSelector((rootState) => rootState.auth);

  return useMemo(() => {
    const devices = setup({
      deviceServerHost: POL_DEVICE_SERVER_HOST,
      disconnectAfterResponse: true,
      callbacks: {
        onDisplayUpdate: (event: ServiceEvent) => {
          if (event.service === SupportedServices.IngenicoPed) {
            const eventTag = getEventTagMapping(event.message);
            if (eventTag !== undefined) {
              setPaymentProcessMsg(`${eventTag.id} - ${eventTag.description}`);
            } else {
              setPaymentProcessMsg(stringConstants.paymentAlertMsg.waitWhileLoading);
            }
            if (event.availableEvents) {
              setPedActions(event.availableEvents);
            }
          }
        },
      },
    });

    const terminalId = getTerminalId(device.branchID, device.nodeID);

    return devices.buildClient(SupportedServices.IngenicoPed, {
      terminalId,
      clerkId: getUserName(),
      useMock: POL_DEVICE_SERVER_SIMULATED,
    }) as IngenicoPedClient;
  }, [device.branchID, device.nodeID, setPaymentProcessMsg, setPedActions]);
}
