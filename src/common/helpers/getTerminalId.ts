import { POL_PED_TPV_OVERRIDE } from "@ct/common/backendUrl";

export const getTerminalId = (branchID: string, nodeID: string): string => {
  return POL_PED_TPV_OVERRIDE !== ""
    ? POL_PED_TPV_OVERRIDE
    : `${branchID.substring(0, 6)}${nodeID}`;
};
