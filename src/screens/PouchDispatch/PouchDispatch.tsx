import { Screen, ScreenLayout } from "@ct/common";
import { resetAccSlice } from "@ct/common/state/pouchDispatch/accCardFeature.slice";
import { resetPouchDispatchList } from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { STRING_CONSTANTS } from "@ct/constants";
import { PouchDispatchLeftPanel, PouchDispatchRightPanel } from "@ct/features";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const { PouchDispatch: PouchDispatchTitle } = STRING_CONSTANTS.screenNames;

export const PouchDispatch = () => {
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetPouchDispatchList());
      dispatch(resetAccSlice());
    },
    [dispatch],
  );

  return (
    <Screen title={PouchDispatchTitle}>
      <ScreenLayout>
        <ScreenLayout.LeftPanel>
          <PouchDispatchLeftPanel />
        </ScreenLayout.LeftPanel>
        <ScreenLayout.RightPanel>
          <PouchDispatchRightPanel />
        </ScreenLayout.RightPanel>
      </ScreenLayout>
    </Screen>
  );
};
