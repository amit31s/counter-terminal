import { PinPadOutlined } from "@ct/assets/icons";
import {
  INITIALISE_PED_ON_LOGIN,
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
  Screen,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { getTerminalId } from "@ct/common/helpers/getTerminalId";
import { useCheckDevice } from "@ct/common/hooks/useCheckDevice";
import { federatedSignInSuccess } from "@ct/common/state/auth.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { SCREENS, stringConstants } from "@ct/constants";
import { StackParams } from "@ct/navigation/navigation.types";
import { getItem } from "@ct/utils";
import { getUserName } from "@ct/utils/Services/auth";
import { isEmpty } from "lodash";
import { Box, Text } from "native-base";
import {
  IngenicoPedClient,
  setup,
  SupportedServices,
} from "postoffice-peripheral-management-service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { APP_LOGS_FN, APP_LOGS_VARS } from "@ct/common/constants/AppLogger";
import { PED_LOGS_FN, PED_LOGS_VARS } from "@ct/common/constants/PEDLogs";

let initialisingPed = false;

export const AuthRedirect = () => {
  const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);
  const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

  const storageData = useLocation().state as StackParams[SCREENS.AUTH_REDIRECT];
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { device } = useAppSelector((rootState) => rootState.auth);

  const params = useMemo(() => {
    const paramsData: StackParams[SCREENS.AUTH_REDIRECT] = {};
    for (const [key, value] of searchParams.entries()) {
      paramsData[key] = value;
    }
    return paramsData;
  }, [searchParams]);

  const updateStorage = useCallback((user: StackParams[SCREENS.AUTH_REDIRECT]) => {
    Object.keys(user).forEach((key) => {
      localStorage.setItem(key, user[key]);
    });
  }, []);

  useCheckDevice();

  useEffect(() => {
    if (!storageData && isEmpty(params)) {
      setMessage("Failed to load user information. Try again");
      return;
    }
    setMessage("Redirecting...");

    if (
      typeof device.branchID !== "string" ||
      device.branchID === "" ||
      typeof device.nodeID !== "string" ||
      device.nodeID === ""
    ) {
      return;
    }

    if (!isEmpty(params)) {
      updateStorage(params);
    }
    if (storageData) {
      updateStorage(storageData);
    }

    dispatch(federatedSignInSuccess());

    const clerkId = getUserName();
    if (INITIALISE_PED_ON_LOGIN && !POL_DEVICE_SERVER_SIMULATED && !initialisingPed) {
      initialisingPed = true;
      const initialisePinPad = async () => {
        try {
          const devices = setup({
            deviceServerHost: POL_DEVICE_SERVER_HOST,
          });

          const terminalId = getTerminalId(device.branchID, device.nodeID);

          const pinPad = devices.buildClient(SupportedServices.IngenicoPed, {
            terminalId,
            clerkId,
            useMock: POL_DEVICE_SERVER_SIMULATED,
          }) as IngenicoPedClient;

          dispatch(
            setLoadingActive({
              id: LoadingId.PIN_PAD,
              modalProps: {
                icon: (
                  <Box testID="CustomIconTestID">
                    <PinPadOutlined />
                  </Box>
                ),
                title: stringConstants.HomeScreen.initialisingPinPad,
              },
            }),
          );
          const pedInit = await pinPad.initialise();
          pmsLogger.info({
            methodName: PED_LOGS_FN.initPMSOnLogin,
            message: PED_LOGS_VARS.initPMS(String(pedInit)),
          });
          if (pedInit) {
            dispatch(setLoadingInactive(LoadingId.PIN_PAD));
          } else {
            dispatch(
              setLoadingActive({
                id: LoadingId.PIN_PAD,
                modalProps: {
                  icon: (
                    <Box testID="CustomIconTestID">
                      <PinPadOutlined />
                    </Box>
                  ),
                  title: stringConstants.HomeScreen.pinPadError,
                  content: "Please contact support for assistance.",
                  showCloseButton: true,
                  onClose: () => dispatch(setLoadingInactive(LoadingId.PIN_PAD)),
                },
              }),
            );
          }
        } catch (error) {
          const err = error as Error;
          pmsLogger.fatal({
            methodName: PED_LOGS_FN.initPMSOnLogin,
            error: err,
          });
          dispatch(
            setLoadingActive({
              id: LoadingId.PIN_PAD,
              modalProps: {
                icon: (
                  <Box testID="CustomIconTestID">
                    <PinPadOutlined />
                  </Box>
                ),
                title: stringConstants.HomeScreen.pinPadError,
                content: err.message,
                showCloseButton: true,
                onClose: () => dispatch(setLoadingInactive(LoadingId.PIN_PAD)),
              },
            }),
          );
        }

        initialisingPed = false;
      };
      initialisePinPad();
    }

    applicationLogger.info({
      methodName: APP_LOGS_FN.authRedirect,
      message: APP_LOGS_VARS.userLoggedIn(clerkId),
    });

    const cashDrawerId = getItem(STORAGE_KEYS.CTSTK0006);
    if (!cashDrawerId) {
      navigate(SCREENS.CASH_DRAWER);
      return;
    }
    navigate(SCREENS.HOME);
  }, [device.branchID, device.nodeID, dispatch, navigate, params, storageData, updateStorage]);

  return (
    <Screen>
      <Text testID="authRedirectTestID">{message}</Text>
    </Screen>
  );
};
