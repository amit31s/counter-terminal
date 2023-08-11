import { getJourneyStatus, useAppSelector } from "@ct/common";

export const useGetJourneyStatus = () => {
  const journeyStatus = useAppSelector(getJourneyStatus);
  const isJourneyStarted = journeyStatus.open;

  return { isJourneyStarted };
};
