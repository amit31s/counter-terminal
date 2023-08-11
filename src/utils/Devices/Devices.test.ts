import {
  AppData,
  BasketForAppData,
  DeviceForAppData,
} from "@ct/components/JourneyRenderer/useAppData";
import { User } from "@ct/interfaces";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../__mocks__/broadcastChannel";
import { Device } from ".././Devices";
import { DeviceActionsCallback } from "./Devices.web";
import * as errorChecker from "./helpers/errorChecker";
import * as journeyPrinterTrigger from "./helpers/journeyPrinterTrigger";

stubBroadcastChannel();

afterEach(() => {
  clearBroadcastChannelInstances();
  jest.clearAllMocks();
});
describe("Devices", () => {
  describe("deviceActionsCallback", () => {
    describe("printer", () => {
      it("calls journeyPrinterTrigger function", async () => {
        const journeyPrinterTriggerFunc = jest.spyOn(
          journeyPrinterTrigger,
          "journeyPrinterTrigger",
        );
        const params = {
          value: "test",
          template: "tests",
        };
        await DeviceActionsCallback(Device.Printer, "print", params, {} as AppData);
        expect(journeyPrinterTriggerFunc).toBeCalled();
      });
    });
    describe("labelPrinter", () => {
      it("returns a printed value of true", async () => {
        const params = {
          value: "test",
          template: "tests",
          label: "TEST",
        };
        const response = await DeviceActionsCallback(
          Device.LabelPrinter,
          "print",
          params,
          {} as AppData,
        );
        expect(response).toStrictEqual({ printed: true });
      });
    });

    describe("Ped", () => {
      it("sets event to cancel if action is equal to cancel", async () => {
        const errorCheckerFunc = jest.spyOn(errorChecker, "errorChecker");
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
        const params = {
          value: "test",
          template: "tests",
          label: "TEST",
          transactionId: "1",
          amount: 5,
        };
        await DeviceActionsCallback(Device.Ped, "cancel", params, {
          device,
          user,
          basket,
        } as AppData);
        expect(errorCheckerFunc).toHaveBeenCalledWith("1", "POS_EVENT", 5, "CANCEL");
      });
    });
  });
});
