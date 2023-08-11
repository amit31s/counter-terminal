import { getJourneyStatus, useAppSelector } from "@ct/common";
import { JOURNEY_LOGS_FN } from "@ct/common/constants/JourneyLogs";
import useKeyboardAvoider from "@ct/common/hooks/useKeyboardAvoider";
import { JourneyInterruptContext } from "@ct/screens/HomeScreen/JourneyInterruptContext";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { JourneyEngine, ProviderProps } from "postoffice-spm-journey-engine";
import { useCallback, useContext, useMemo, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { v4 } from "uuid";
import { stringConstants } from "../../constants";
import { enablerConfig } from "./enablerConfig";
import styles from "./style";
import { ReturnTypes, useAppData } from "./useAppData";
import { useDeviceCallback } from "./useDeviceCallback";
import { useLogger } from "./useLogger";
// Keeping as 'any' for Journey onComplete payload data because JourneyData type from Journey engine do not enforce many keys used in basket items basically its any key value based also changes required in CT for using this interface is big and would require a seperate ticket.
export type JourneyData = any;
const journeyEngineLogger = logManager(LOGGER_TYPE.journeyEngineLogger);

interface IJourneyRenderer {
  onJourneyAbort?: () => void;
  journeyOnComplete: (data: JourneyData) => Promise<void>;
  barcodeNotRecognizedCb: () => void;
}

export const JourneyRenderer = ({
  journeyOnComplete,
  onJourneyAbort,
  barcodeNotRecognizedCb,
}: IJourneyRenderer) => {
  const [journeyReturns, setJourneyReturns] = useState<ReturnTypes>();
  const appData = useAppData({ journeyReturns });
  const complianceStatus = true;
  const { keyboardPadding } = useKeyboardAvoider();
  const { session } = useAppSelector((rootState) => rootState.auth);
  const windowHeight = Dimensions.get("window").height / 1.7;
  const { interruptionInputData } = useContext(JourneyInterruptContext);
  const deviceCallback = useDeviceCallback(appData, journeyOnComplete);
  const journeyLogger = useLogger();
  const { open } = useAppSelector(getJourneyStatus);

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: keyboardPadding }),
    [keyboardPadding],
  );

  const getAuthHeaders = useCallback(
    async () => ({
      Authorization: session?.idToken ?? "",
      "X-Correlation-ID": v4(),
    }),
    [session?.idToken],
  );

  const onComplete: ProviderProps["onComplete"] = useCallback(
    (data) => {
      if (data && data.returns) {
        setJourneyReturns(data.returns);
      }
      journeyOnComplete(data);
    },
    [journeyOnComplete],
  );

  const onAbort: ProviderProps["onAbort"] = useCallback(
    (data) => {
      if (data && data.returns) {
        setJourneyReturns(data.returns);
      }
      onJourneyAbort?.();
    },
    [onJourneyAbort],
  );

  const onError: NonNullable<ProviderProps["onError"]> = useCallback(
    (error) => {
      journeyEngineLogger.error({
        methodName: JOURNEY_LOGS_FN.journeyEngineProvider,
        error: error as unknown as Error,
        data: interruptionInputData,
      });
      if (interruptionInputData?.value) {
        barcodeNotRecognizedCb();
      }
    },
    [barcodeNotRecognizedCb, interruptionInputData],
  );

  if (!complianceStatus) {
    return (
      <View style={styles(open).complianceCont}>
        <Text style={styles(open).compWarning}>
          {stringConstants.messages.outstandingCompliance}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles(open).journeyContainer} contentContainerStyle={contentContainerStyle}>
      <JourneyEngine.Provider
        enablerConfig={enablerConfig}
        authHeaders={getAuthHeaders}
        appData={appData}
        logger={journeyLogger}
        interruptionInputData={interruptionInputData}
        onDeviceTrigger={deviceCallback}
        onComplete={onComplete}
        onAbort={onAbort}
        onError={onError}
      >
        <JourneyEngine.Canvas canvasMinHeight={windowHeight} />
      </JourneyEngine.Provider>
    </ScrollView>
  );
};

export type IJourneyData = JourneyData;
