import { getScannedPouchForAcceptance, useAppSelector } from "@ct/common";

type UseGetScanPouchForAcceptance = {
  failureCount: number;
};

export const useGetScanPouchForAcceptance = (): UseGetScanPouchForAcceptance => {
  const data = useAppSelector(getScannedPouchForAcceptance);

  return {
    failureCount: data.failureCount,
  };
};
