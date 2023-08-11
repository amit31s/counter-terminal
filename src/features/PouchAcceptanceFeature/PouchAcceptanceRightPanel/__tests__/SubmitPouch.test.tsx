import { renderWithRedux, setupUser, waitFor } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import * as userData from "@ct/common/hooks/useGetUser";
import { DeviceAttributes } from "@ct/interfaces";
import { SubmitPouch } from "../SubmitPouch";
import { BUTTON, TEXT } from "@ct/constants";
import { testIds } from "../../PouchAcceptanceModals/testData";

const mockPostTransferTransactionHook = jest.fn();
jest.mock("@ct/api/generator/endpoints/transfer-ap-i/transfer-ap-i", () => ({
  usePostTransferTransactionHook: () => mockPostTransferTransactionHook,
}));

jest.mock("@ct/utils/Services/ReceiptService", () => ({
  useReceiptService: () => ({
    printReceipt: () => ({
      result: {
        printed: true,
      },
    }),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const validatedData = [
  {
    assignedBranchID: "010",
    assignedBranchName: "Meanwood",
    deliveredBranchID: "010",
    isBranchValid: "true",
    isPouchValid: "true",
    isPouchValueAssociated: "true",
    itemID: "6287",
    items: {
      "656": {
        currency: "GBP",
        denomination: 2000,
        itemID: "656",
        itemQuantity: 0,
        itemValue: 1000000,
        materialType: "NOTE",
      },
      "657": {
        currency: "GBP",
        denomination: 1000,
        itemID: "657",
        itemQuantity: 0,
        itemValue: 600000,
        materialType: "NOTE",
      },
    },
    pouchID: "901",
    pouchType: "cash",
    status: "expected",
    totalValue: 1600000,
    transactionID: "31ea3c05-0f5d-4a56-b2c5-f6d4b1e4c2e4",
    updatedBy: {
      transactionTimestamp: 1684164619,
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
    const { getByText, getByTestId } = renderWithRedux(<SubmitPouch />);
    expect(getByText(BUTTON.CTBTN0006)).toBeTruthy();
    const confirmButton = getByText(BUTTON.CTBTN0008);
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton);

    // click confirm button after print
    await waitFor(() => {
      expect(getByText(TEXT.CTTXT00058)).toBeTruthy();
    });
    const submitPouchModalConfirmButton = getByTestId(testIds.confirmButton);
    await waitFor(() => {
      expect(submitPouchModalConfirmButton).toBeTruthy();
    });
    await user.click(submitPouchModalConfirmButton);
    expect(mockPostTransferTransactionHook).toHaveBeenCalledTimes(1);
  });

  it("should render failure modal on error", async () => {
    const user = setupUser();
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ validatedData });
    jest.spyOn(userData, "useGetUser").mockReturnValue({ device });
    mockPostTransferTransactionHook.mockImplementation(() => {
      throw new Error("error");
    });
    const { getByText, getByTestId } = renderWithRedux(<SubmitPouch />);
    expect(getByText(BUTTON.CTBTN0006)).toBeTruthy();
    const confirmButton = getByText(BUTTON.CTBTN0008);
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton);

    // click confirm button after print
    await waitFor(() => {
      expect(getByText(TEXT.CTTXT00058)).toBeTruthy();
    });
    const submitPouchModalConfirmButton = getByTestId(testIds.confirmButton);
    await waitFor(() => {
      expect(submitPouchModalConfirmButton).toBeTruthy();
    });
    await user.click(submitPouchModalConfirmButton);
    expect(getByText(TEXT.CTTXT00085)).toBeTruthy();
  });
});
