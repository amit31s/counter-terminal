import { POL_DEVICE_SERVER_HOST, POL_DEVICE_SERVER_SIMULATED } from "@ct/common/backendUrl";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { pull } from "lodash";
import {
  ScannerClient,
  ScannerClientProps,
  ServiceEvent,
  setup,
  SupportedServices,
} from "postoffice-peripheral-management-service";
import { useEffect } from "react";
import { PED_LOGS_MSG } from "../constants/PEDLogs";

const loggerName = "useScanner";

export type OnScanHandler = (text: string) => void;
const onScanCallbacks: OnScanHandler[] = [];
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
          pmsLogger.info({
            methodName: loggerName,
            message: PED_LOGS_MSG.connectionError,
          });
        }
      },
      onDisplayUpdate: ({ service, message }: ServiceEvent) => {
        if (service === SupportedServices.Scanner) {
          onScanCallbacks.forEach((callback) => callback(message.trim()));
          pmsLogger.info({
            methodName: loggerName,
            message: PED_LOGS_MSG.barCodeScanned,
            data: message.trim(),
          });
        }
      },
    },
  });

  const scanner = pms.buildClient(SupportedServices.Scanner, {
    useMock: POL_DEVICE_SERVER_SIMULATED,
  } as ScannerClientProps) as ScannerClient;

  if (!shouldSuppressLogs) {
    pmsLogger.info({
      methodName: loggerName,
      message: PED_LOGS_MSG.connecting,
    });
  }

  try {
    await scanner.connect();
  } catch (error) {
    if (!shouldSuppressLogs) {
      pmsLogger.error({
        methodName: loggerName,
        message: PED_LOGS_MSG.connectingFailed,
        error: error as Error,
      });
    }
  }
};

function subscribe(onScan: OnScanHandler) {
  onScanCallbacks.push(onScan);
  if (isFirstConnection) {
    connect();
    isFirstConnection = false;
  }
}

function unsubscribe(onScan: OnScanHandler) {
  pull(onScanCallbacks, onScan);
}

type UseScanner = {
  isConnected: boolean;
};

export const useScanner = (onScan: OnScanHandler): UseScanner => {
  useEffect(() => {
    subscribe(onScan);

    return () => {
      unsubscribe(onScan);
    };
  }, [onScan]);

  return { isConnected };
};
