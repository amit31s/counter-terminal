import { useAppSelector } from "@ct/common";
import { useGetJourneyData } from "@ct/common/hooks/homeScreenHooks/useGetJourneyData";
import { defaultUserData } from "@ct/common/state/initialStateData";
import { User } from "@ct/interfaces/user.interface";
import { useMemo } from "react";

export declare type ReturnTypes = {
  [key: string]: number;
};

export type BasketForAppData = {
  numberOfItems: number;
  items: { [key: string]: unknown }[];
};

export type DeviceForAppData = {
  nodeID: string;
  deviceType: string;
  branchID: string;
  sixDigitBranchID: string;
  branchName: string;
  branchAddress: string;
  branchPostcode: string;
  branchUnitCode: string;
  branchUnitCodeVer: string;
};

export type AppData = {
  device: DeviceForAppData;
  user: User;
  basket: BasketForAppData;
  returns?: ReturnTypes;
};

export const useAppData = ({
  journeyReturns,
}: {
  journeyReturns: ReturnTypes | undefined;
}): AppData => {
  const { device, user } = useAppSelector((rootState) => rootState.auth);
  const { journeyData } = useGetJourneyData();

  return useMemo(() => {
    return {
      device: {
        nodeID: device.nodeID,
        deviceType: device.deviceType,
        branchID: device.branchID,
        // 7th digit is a check digit
        sixDigitBranchID: device.branchID && device.branchID.substring(0, 6),
        branchName: device.branchName,
        branchAddress: device.branchAddress,
        branchPostcode: device.branchPostcode,
        branchUnitCode: device.branchUnitCode,
        branchUnitCodeVer: device.branchUnitCodeVer,
      },
      user: user ?? defaultUserData(),
      basket: {
        numberOfItems: journeyData.length,
        // Should look into improving the type for this in Journey Engine
        items: journeyData as unknown as { [key: string]: unknown }[],
      },
      returns: journeyReturns,
    };
  }, [
    device.nodeID,
    device.deviceType,
    device.branchID,
    device.branchName,
    device.branchAddress,
    device.branchPostcode,
    device.branchUnitCode,
    device.branchUnitCodeVer,
    user,
    journeyData,
    journeyReturns,
  ]);
};
