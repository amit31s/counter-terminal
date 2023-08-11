import * as POL_PED_TPV_OVERRIDE from "@ct/common/backendUrl";
import { BasketForAppData, DeviceForAppData } from "@ct/components/JourneyRenderer/useAppData";
import { User } from "@ct/interfaces";
import { getTerminalId } from "../getTerminalId";

describe("getTerminalId", () => {
  const device: DeviceForAppData = {
    nodeID: "1",
    deviceType: "any",
    branchID: "123456",
    sixDigitBranchID: "123456",
    branchName: "Test Branch",
    branchAddress: "1 Test Street",
    branchPostcode: "Test",
    branchUnitCode: "Test",
    branchUnitCodeVer: "Test",
  };

  const user: User = {
    id: "User1",
    provider: "any",
    createdAt: 12,
    roles: [{ role: "any", fadCode: "123456" }],
  };

  const basket: BasketForAppData = {
    numberOfItems: 1,
    items: [{ ["any"]: "any" }],
  };
  it("returns correct terminal ID when POL_PED_TPV_OVERRIDE is empty string", () => {
    const appData = { device, user, basket };
    expect(getTerminalId(appData)).toBe("1234561");
  });

  it("returns correct terminal ID when POL_PED_OVERRIDE is not empty string ", () => {
    Object.defineProperty(POL_PED_TPV_OVERRIDE, "POL_PED_TPV_OVERRIDE", { value: "any" });
    const appData = { device, user, basket };
    expect(getTerminalId(appData)).toBe("any");
  });
});
