import { Screen, ScreenLayout } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { CashTransferLeftPanel, CashTransferRightPanel } from "@ct/features";

export const CashTransferScreen = () => {
  return (
    <Screen title={STRING_CONSTANTS.screenNames.CashTransferOut}>
      <ScreenLayout>
        <ScreenLayout.LeftPanel>
          <CashTransferLeftPanel />
        </ScreenLayout.LeftPanel>
        <ScreenLayout.RightPanel>
          <CashTransferRightPanel />
        </ScreenLayout.RightPanel>
      </ScreenLayout>
    </Screen>
  );
};
