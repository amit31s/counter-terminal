import { renderWithRedux, setupUser } from "@ct/common";
import { SCREENS, stringConstants } from "@ct/constants";
import { uuid } from "@ct/utils";
import { compileReceipt, useReceiptService } from "@ct/utils/Services/ReceiptService";
import commonReceipts from "@ct/utils/Services/ReceiptService/commonReceipts";
import moment from "moment";
import ReceiptScreen from "./ReceiptScreen";

const mNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mNavigate,
}));

const mPrintReceipt = jest.fn();
jest.mock("@ct/utils/Services/ReceiptService");
const mUseReceiptService = jest.mocked(useReceiptService);
mUseReceiptService.mockReturnValue({
  printReceipt: mPrintReceipt,
  templates: commonReceipts,
});
const mCompileReceipt = jest.mocked(compileReceipt);
mCompileReceipt.mockResolvedValue("<html><body><p>testing</p></body></html>");

// mock scroll functions
const mScrollTo = jest.fn();
Element.prototype.scrollTo = mScrollTo;
const mScrollBy = jest.fn();
Element.prototype.scrollBy = mScrollBy;

global.Date.now = jest.fn().mockReturnValue(1640995200000);

const timestamp = Date.now() / 1000;
const generateTestReceipts = (n: number) =>
  Array(n)
    .fill(null)
    .map((_, i) => ({
      id: uuid(),
      templateId: "testing-id",
      context:
        i % 2 === 0
          ? {}
          : {
              textMode: true,
              dueToPostOffice: 50,
              dueToCustomer: 0,
            },
      printTimestamp: timestamp - 60 * i,
    }));

describe("Receipt Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders anything", () => {
    const { getByTestId } = renderWithRedux(<ReceiptScreen />, {});
    expect(getByTestId(stringConstants.ReceiptList.testID)).toBeTruthy();
  });

  it("navigates to home on close press", async () => {
    const user = setupUser();
    const { getByText } = renderWithRedux(<ReceiptScreen />, {});
    const closeButton = getByText("Close");
    expect(closeButton).toBeTruthy();

    await user.click(closeButton);
    expect(mNavigate).toHaveBeenCalledTimes(1);
    expect(mNavigate).toHaveBeenCalledWith(SCREENS.HOME, { state: { from: SCREENS.RECEIPT } });
  });

  it("disables print when nothing selected", async () => {
    const user = setupUser();
    const { getByLabelText } = renderWithRedux(<ReceiptScreen />, {});
    const printButton = getByLabelText("Print");
    expect(printButton).toBeTruthy();
    expect(printButton).toHaveAttribute("aria-disabled", "true");

    await user.click(printButton);

    expect(mPrintReceipt).toBeCalledTimes(0);
  });

  it("shows printed receipts", () => {
    const testReceipts = generateTestReceipts(5);
    const { getByText } = renderWithRedux(<ReceiptScreen />, {
      printedReceipts: testReceipts,
    });

    expect(getByText(moment.unix(testReceipts[0].printTimestamp).format("HH:mm"))).toBeTruthy();
  });

  it("allows receipts to be selected by the radio button", async () => {
    const user = setupUser();
    const testReceipts = generateTestReceipts(5);
    const { getByText, getByLabelText } = renderWithRedux(<ReceiptScreen />, {
      printedReceipts: testReceipts,
    });

    const button = getByLabelText(
      `Select receipt printed at ${moment.unix(testReceipts[0].printTimestamp).format("HH:mm")}`,
    );
    expect(button).toBeTruthy();
    await user.click(button);

    const printButton = getByText("Print");
    expect(printButton).toBeTruthy();
    expect(printButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("allows receipts to be selected and printed", async () => {
    const user = setupUser();
    const testReceipts = generateTestReceipts(5);
    const { getByText, getByTestId, getByLabelText } = renderWithRedux(<ReceiptScreen />, {
      printedReceipts: testReceipts,
    });

    const row = getByText(moment.unix(testReceipts[0].printTimestamp).format("HH:mm"));
    expect(row).toBeTruthy();
    await user.click(row);

    expect(mScrollTo).toHaveBeenCalledTimes(1);
    expect(mScrollTo).toHaveBeenCalledWith(0, 0);

    expect(getByText("Print")).toBeTruthy();

    const printButton = getByLabelText("Print");
    expect(printButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(printButton);

    expect(getByTestId(stringConstants.ReceiptList.printModalTestID)).toBeTruthy();
    expect(mPrintReceipt).toBeCalledTimes(0);

    const cancelModalButton = getByLabelText("Cancel");
    expect(cancelModalButton).toBeTruthy();
    await user.click(cancelModalButton);

    expect(mPrintReceipt).toBeCalledTimes(0);

    await user.click(printButton);

    expect(getByTestId(stringConstants.ReceiptList.printModalTestID)).toBeTruthy();
    expect(mPrintReceipt).toBeCalledTimes(0);

    const printModalButton = getByLabelText("Yes");
    expect(printModalButton).toBeTruthy();
    await user.click(printModalButton);

    expect(mPrintReceipt).toHaveBeenCalledTimes(1);
    expect(mPrintReceipt).toHaveBeenCalledWith({
      template: "testing-id",
      context: { isDuplicate: true, dateOfIssue: 1640995200 },
    });
  });

  it("only shows 10 items at a time", async () => {
    const testReceipts = generateTestReceipts(30);
    const { getByText, queryByText } = renderWithRedux(<ReceiptScreen />, {
      printedReceipts: testReceipts,
    });

    testReceipts.slice(0, 10).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });

    testReceipts.slice(10, 30).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });
  });

  it("can page through items", async () => {
    const user = setupUser();
    const testReceipts = generateTestReceipts(30);
    const { getByText, getByLabelText, queryByText } = renderWithRedux(<ReceiptScreen />, {
      printedReceipts: testReceipts,
    });

    testReceipts.slice(0, 10).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });
    testReceipts.slice(10, 30).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });

    const previousButton = getByLabelText("Previous");
    expect(previousButton).toBeTruthy();
    expect(previousButton).toHaveAttribute("aria-disabled", "true");
    const nextButton = getByLabelText("Next");
    expect(nextButton).toBeTruthy();
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(nextButton);

    testReceipts.slice(0, 10).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });
    testReceipts.slice(10, 20).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });
    testReceipts.slice(20, 30).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });

    expect(previousButton).not.toHaveAttribute("aria-disabled", "true");
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(nextButton);

    testReceipts.slice(0, 20).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });
    testReceipts.slice(20, 30).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });

    expect(previousButton).not.toHaveAttribute("aria-disabled", "true");
    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await user.click(previousButton);

    testReceipts.slice(0, 10).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });
    testReceipts.slice(10, 20).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });
    testReceipts.slice(20, 30).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });

    expect(previousButton).not.toHaveAttribute("aria-disabled", "true");
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(previousButton);

    testReceipts.slice(0, 10).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });
    testReceipts.slice(10, 30).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });

    expect(previousButton).toHaveAttribute("aria-disabled", "true");
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");

    const page3Button = getByLabelText("3");
    expect(page3Button).toBeTruthy();
    expect(page3Button).not.toHaveAttribute("aria-disabled", "true");
    await user.click(page3Button);

    testReceipts.slice(0, 20).forEach((receipt) => {
      expect(queryByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeFalsy();
    });
    testReceipts.slice(20, 30).forEach((receipt) => {
      expect(getByText(moment.unix(receipt.printTimestamp).format("HH:mm"))).toBeTruthy();
    });

    expect(previousButton).not.toHaveAttribute("aria-disabled", "true");
    expect(nextButton).toHaveAttribute("aria-disabled", "true");
  });
});
