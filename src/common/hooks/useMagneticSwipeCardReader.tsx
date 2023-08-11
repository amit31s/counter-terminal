import {
  MSR_ENABLED,
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
} from "@ct/common/backendUrl";
import { pull } from "lodash";
import {
  msrClient,
  ServiceEvent,
  setup,
  SupportedServices,
} from "postoffice-peripheral-management-service";
import { useEffect } from "react";
import { PED_LOGS_MSG } from "../constants/PEDLogs";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";

const loggerName = "useMagneticSwipeCardReader";

const extractCardNumber = (trackTwo: string) => {
  return trackTwo.split("=")[0];
};

export const maskValue = (number: string) => {
  return `${number.substring(0, 4)}${number
    .substring(4, number.length - 5)
    .replace(/\d/g, "*")}${number.substring(number.length - 5)}`;
};

export type OnSwipeHandler = (text: string) => void;
const onSwipeCallbacks: OnSwipeHandler[] = [];
const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

let isFirstConnection = true;
let isConnected = false;
let shouldSuppressLogs = false;

const connect = async () => {
  const pms = setup({
    deviceServerHost: POL_DEVICE_SERVER_HOST,
    disconnectAfterResponse: false,
    callbacks: {
      onConnectionOpened: () => {
        isConnected = true;
        shouldSuppressLogs = false;
        pmsLogger.info({
          methodName: loggerName,
          message: PED_LOGS_MSG.connected,
        });
      },
      onConnectionClosed: () => {
        if (!shouldSuppressLogs) {
          pmsLogger.info({
            methodName: loggerName,
            message: PED_LOGS_MSG.connectionClosed,
          });
          if (!isConnected) {
            shouldSuppressLogs = true;
          }
        }
        isConnected = false;
        setTimeout(connect, 1000);
      },
      onConnectionError: () => {
        isConnected = false;
        if (!shouldSuppressLogs) {
          pmsLogger.error({
            methodName: loggerName,
            message: PED_LOGS_MSG.connectionError,
          });
        }
      },
      onDisplayUpdate: (event: ServiceEvent) => {
        if (event.service === SupportedServices.MagneticStripeCardReader) {
          const cardNumber = extractCardNumber(event.message);
          onSwipeCallbacks.forEach((callback) => callback(cardNumber));
          pmsLogger.info({
            methodName: loggerName,
            message: PED_LOGS_MSG.cardSwiped,
            data: maskValue(extractCardNumber(cardNumber)),
          });
        }
      },
    },
  });

  const msr = pms.buildClient(SupportedServices.MagneticStripeCardReader, {
    useMock: POL_DEVICE_SERVER_SIMULATED,
  }) as msrClient;

  if (POL_DEVICE_SERVER_SIMULATED) {
    const magSwipeChannel: BroadcastChannel = new BroadcastChannel("MSR");
    magSwipeChannel.onmessage = async (event: MessageEvent) => {
      const cardNumber = extractCardNumber(event.data);
      onSwipeCallbacks.forEach((callback) => callback(cardNumber));
      pmsLogger.info({
        methodName: loggerName,
        message: PED_LOGS_MSG.cardSwiped,
        data: maskValue(cardNumber),
      });
    };
    return;
  }

  if (!MSR_ENABLED) {
    pmsLogger.info({
      methodName: loggerName,
      message: PED_LOGS_MSG.msrDisabled,
    });
    return;
  }

  pmsLogger.info({
    methodName: loggerName,
    message: PED_LOGS_MSG.connecting,
  });
  try {
    await msr.listen();
  } catch (error) {
    pmsLogger.fatal({
      methodName: loggerName,
      message: PED_LOGS_MSG.connectingFailed,
      error: error as Error,
    });
  }
};

function subscribe(onSwipe: OnSwipeHandler) {
  onSwipeCallbacks.push(onSwipe);
  if (isFirstConnection) {
    connect();
    isFirstConnection = false;
  }
}

function unsubscribe(onSwipe: OnSwipeHandler) {
  pull(onSwipeCallbacks, onSwipe);
}

export const useMagneticSwipeCardReader = ({ onSwipe }: { onSwipe: (text: string) => void }) => {
  useEffect(() => {
    subscribe(onSwipe);

    return () => {
      unsubscribe(onSwipe);
    };
  }, [onSwipe]);

  return { isConnected };
};
