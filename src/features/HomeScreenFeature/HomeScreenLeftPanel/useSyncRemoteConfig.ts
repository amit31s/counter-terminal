import { SERVER_ROOT, getPaymentStatus, useAppSelector, useGetHomeScreenStage } from "@ct/common";
import { remoteConfigService } from "@ct/utils/Services/RemoteConfigService";
import { authHeadersWithDeviceToken } from "@ct/utils/Services/authHeader";
import { useEffect, useRef } from "react";

export function useSyncRemoteConfig() {
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
      isSyncing.current = false;
    };

    if (!completed && stage === "home" && !isSyncing.current) {
      isSyncing.current = true;
      syncRemoteConfig();
    }
  }, [completed, stage]);
}
