import { renderWithRedux } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import * as device from "@ct/common/hooks/useGetUser";
import React from "react";
import { FulfilmentFailureItemsListModal } from "../FulfilmentFailureItemsListModal";

beforeEach(() => {
  jest.clearAllMocks();
});

const setStateMock = jest.fn();
const useStateMock: any = (useState: any) => [useState, setStateMock];
jest.spyOn(React, "useState").mockImplementation(useStateMock);

describe("FulfilmentFailureItemsListModal", () => {
  it("shows modal if fulfillment status equals failed", async () => {
    const fulfillmentStatus = "failed";
    jest.spyOn(device, "useGetUser").mockReturnValueOnce({
      device: {
        nodeID: "string",
        deviceID: "string",
        deviceType: "string",
        branchID: "string",
        branchName: "string",
        branchAddress: "string",
        branchPostcode: "string",
        branchUnitCode: "string",
        branchUnitCodeVer: "string",
      },
    });
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ fulfillmentStatus, failedItems: [] });
    renderWithRedux(<FulfilmentFailureItemsListModal />);
    expect(setStateMock).toHaveBeenCalledWith(true);
  });

  it("hides modal if fulfillment status does not equal failed", async () => {
    const fulfillmentStatus = "success";
    jest.spyOn(device, "useGetUser").mockReturnValueOnce({
      device: {
        nodeID: "string",
        deviceID: "string",
        deviceType: "string",
        branchID: "string",
        branchName: "string",
        branchAddress: "string",
        branchPostcode: "string",
        branchUnitCode: "string",
        branchUnitCodeVer: "string",
      },
    });
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ fulfillmentStatus, failedItems: [] });
    renderWithRedux(<FulfilmentFailureItemsListModal />);
    expect(setStateMock).not.toHaveBeenCalledWith(true);
  });
});
