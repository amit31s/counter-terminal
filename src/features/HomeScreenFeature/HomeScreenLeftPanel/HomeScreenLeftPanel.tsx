import { getPaymentStatus, useAppSelector, useGetHomeScreenStage } from "@ct/common";
import { SERVER_ROOT } from "@ct/common/backendUrl";
import { STATE_CONSTANTS } from "@ct/constants";
import { remoteConfigService } from "@ct/utils/Services/RemoteConfigService";
import { authHeadersWithDeviceToken } from "@ct/utils/Services/authHeader";
import { View } from "native-base";
import { RefObject, useEffect, useRef } from "react";
import { TextInput } from "react-native";
import { FulfilmentFailureItemsListModal } from "../HomeScreenModals/FulfilmentFailureItemsListModal";
import { Journey } from "./Journey";
import { QuickTendering } from "./QuickTendering";
import { RefundScreen } from "./RefundScreen";
import { TransactionCompleted } from "./TransactionCompleted";

export type HomeScreenLeftPanelProps = {
  scannerInputRef?: RefObject<TextInput>;
  hideEnterButton?: boolean;
};

export const HomeScreenLeftPanel = ({ scannerInputRef }: HomeScreenLeftPanelProps) => {
  const { stage } = useGetHomeScreenStage();
  const { completed } = useAppSelector(getPaymentStatus);
  const isSyncing = useRef(false);

  useEffect(() => {
    // this should be called at set intervals but for now, until we have decided on
    // implementation approach for windows et al, this will be called from home screen
    const syncRemoteConfig = async () => {
      const configService = remoteConfigService(SERVER_ROOT, authHeadersWithDeviceToken);
      const isSynced = await configService.isSynced();
      if (!isSynced) {
        await configService.clear();
        await configService.sync();
      }
    };

    if (!completed && stage === "home" && !isSyncing.current) {
      isSyncing.current = true;
      syncRemoteConfig();
      isSyncing.current = false;
    }
  }, [completed, stage]);

  return (
    <>
      <View flex={1}>
        <FulfilmentFailureItemsListModal />
        {stage === "home" && <Journey scannerInputRef={scannerInputRef} />}
        {!completed && stage === STATE_CONSTANTS.STAGE_TENDERING && <QuickTendering />}
        {!completed && stage === STATE_CONSTANTS.STAGE_REPAY && <QuickTendering />}
        {!completed && stage === STATE_CONSTANTS.STAGE_REFUND && <RefundScreen />}
        {completed && stage === STATE_CONSTANTS.STAGE_COMPLETED && <TransactionCompleted />}
      </View>
    </>
  );
};
