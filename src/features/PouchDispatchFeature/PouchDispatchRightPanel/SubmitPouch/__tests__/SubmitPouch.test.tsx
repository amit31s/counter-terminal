import { renderWithRedux, setupUser } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import * as userData from "@ct/common/hooks/useGetUser";
import { DeviceAttributes } from "@ct/interfaces";
import { SubmitPouch } from "../SubmitPouch";
import { BUTTON, TEXT } from "@ct/constants";

const mockPostTransferTransactionHook = jest.fn();
jest.mock("@ct/api/generator/endpoints/transfer-ap-i/transfer-ap-i", () => ({
  usePostTransferTransactionHook: () => mockPostTransferTransactionHook,
}));

afterEach(() => {
  jest.clearAllMocks();
});

const validatedData = [
  {
    assignedBranchID: "010",
    itemID: "6286",
    items: {
      "655": {
        currency: "GBP",
        denomination: 50,
        itemID: "655",
        itemQuantity: 2,
        itemValue: 10000,
        materialType: "NOTE",
      },
      "656": {
        currency: "GBP",
        denomination: 20,
        itemID: "656",
        itemQuantity: 1,
        itemValue: 2000,
        materialType: "NOTE",
      },
    },
    pouchID: "12121212",
    pouchType: "cash",
    status: "prepared",
    totalValue: 12000,
    transactionID: "15b0f9d3-1d7a-4c56-9e9a-81d4a068c67b",
    updatedBy: {
      smartID: "MockId",
      transactionTimestamp: 1688709930,
      userName: "Mock",
    },
  },
];

const device: DeviceAttributes = {
  nodeID: "56",
  deviceID: "testname",
  deviceType: "counter",
  branchID: "134846",
  branchName: "Moulton",
  branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
  branchPostcode: "123654",
  branchUnitCode: "00",
  branchUnitCodeVer: "12",
};

describe("SubmitPouch", () => {
  it("should render submit pouch button", () => {
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ validatedData });
    jest.spyOn(userData, "useGetUser").mockReturnValue({ device });
    const { getByText } = renderWithRedux(<SubmitPouch />);
    expect(getByText(BUTTON.CTBTN0006)).toBeTruthy();
    expect(getByText(BUTTON.CTBTN0008)).toBeTruthy();
  });
  it("should call submit pouch func when confirm button clicked", async () => {
    const user = setupUser();
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ validatedData });
    jest.spyOn(userData, "useGetUser").mockReturnValue({ device });
    mockPostTransferTransactionHook.mockReturnValue({
      basketId: "1212-12-12",
    });
    const { getByText } = renderWithRedux(<SubmitPouch />);
    const cancelButton = getByText(BUTTON.CTBTN0006);
    const confirmButton = getByText(BUTTON.CTBTN0008);
    expect(cancelButton).toBeTruthy();
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton);
    expect(mockPostTransferTransactionHook).toHaveBeenCalledTimes(1);
  });
  it("should render failure modal on error", async () => {
    const user = setupUser();
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ validatedData });
    jest.spyOn(userData, "useGetUser").mockReturnValue({ device });
    mockPostTransferTransactionHook.mockImplementation(() => {
      throw new Error("error");
    });
    const { getByText } = renderWithRedux(<SubmitPouch />);
    const cancelButton = getByText(BUTTON.CTBTN0006);
    const confirmButton = getByText(BUTTON.CTBTN0008);
    expect(cancelButton).toBeTruthy();
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton);
    expect(getByText(TEXT.CTTXT00084)).toBeTruthy();
  });
});
