import { POL_PED_TPV_OVERRIDE } from "@ct/common/backendUrl";
import { AppData } from "@ct/components/JourneyRenderer/useAppData";

export const getTerminalId = (appData: AppData) => {
  const { sixDigitBranchID, nodeID } = appData.device;
  return POL_PED_TPV_OVERRIDE !== "" ? POL_PED_TPV_OVERRIDE : `${sixDigitBranchID}${nodeID}`;
};
