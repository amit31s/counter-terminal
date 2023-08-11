import { getHomeScreenStage } from "@ct/common/selectors";
import { StateName } from "@ct/common/state/HomeScreen/updateHomeScreenStage.slice";
import { useMemo } from "react";
import { useAppSelector } from "../useAppSelector";

type HomeScreenStage = {
  stage: StateName;
  completeClicked: boolean;
  time: number;
};

export const useGetHomeScreenStage = (): HomeScreenStage => {
  const homeScreen = useAppSelector(getHomeScreenStage);

  const data: HomeScreenStage = useMemo(() => {
    return {
      stage: homeScreen.stage,
      completeClicked: homeScreen.completeClicked,
      time: homeScreen.time,
    };
  }, [homeScreen.completeClicked, homeScreen.stage, homeScreen.time]);

  return data;
};
