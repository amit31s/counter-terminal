import { Screen, ScreenLayout } from "@ct/common";
import {
  resetPouchAcceptanceList,
  resetScannedPouchForAcceptance,
} from "@ct/common/state/pouchAcceptance";
import { STRING_CONSTANTS } from "@ct/constants";
import {
  PouchAcceptanceLeftPanel,
  PouchAcceptanceRightPanel,
} from "@ct/features/PouchAcceptanceFeature";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const { PouchAcceptence } = STRING_CONSTANTS.screenNames;

export const PouchAcceptanceScreen = () => {
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetScannedPouchForAcceptance());
      dispatch(resetPouchAcceptanceList());
    },
    [dispatch],
  );

  return (
    <Screen title={PouchAcceptence}>
      <ScreenLayout>
        <ScreenLayout.LeftPanel>
          <PouchAcceptanceLeftPanel />
        </ScreenLayout.LeftPanel>
        <ScreenLayout.RightPanel>
          <PouchAcceptanceRightPanel />
        </ScreenLayout.RightPanel>
      </ScreenLayout>
    </Screen>
  );
};
