import { Screen, ScreenLayout } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { CashDrawerLeftPanel, CashDrawerRightPanel } from "@ct/features";

const { AssociateCashDrawer } = STRING_CONSTANTS.screenNames;

export const CashDrawerScreen = () => {
  return (
    <Screen title={AssociateCashDrawer} hideHome>
      <ScreenLayout>
        <ScreenLayout.LeftPanel>
          <CashDrawerLeftPanel />
        </ScreenLayout.LeftPanel>
        <ScreenLayout.RightPanel>
          <CashDrawerRightPanel />
        </ScreenLayout.RightPanel>
      </ScreenLayout>
    </Screen>
  );
};
