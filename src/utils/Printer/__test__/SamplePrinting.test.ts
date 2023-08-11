import { IPrintReceiptData } from "@ct/interfaces/HomeInterface";
import { createReceipt, HtmlReceiptTest, onPrint } from "../samplePrinting";
const mockPrintReceiptData: IPrintReceiptData = {
  header: {
    branchName: "test-branchName",
    branchAddress: "test-branchAddress",
    vatInfo: "test-varInfo",
    dateOfIssue: "test-dateOfIssue",
    sessionId: "test-sessionId",
  },
  items: [
    {
      description: "test-description",
      quantity: 1,
      price: 1,
      vatRatesSymbol: "test-vatRatesSymbol",
    },
  ],
  totalDue: 0,
  paymentDetails: {
    tenderDes: {
      cash: 6,
      card: [
        {
          cardNo: "test-cardNo",
          amount: 10,
          key: "test-key",
        },
      ],
    },
    tenderAmount: 100,
    cardDetails: 2,
  },
  footer: {
    feedbackMessage: "test-feedbackMessage",
    colleagueName: "test-colleagueName",
    fadCode: "test-fadCode",
  },
};

describe("render SamplePrinting", () => {
  test("test createReceipt", async () => {
    const result = createReceipt(Promise.resolve(mockPrintReceiptData));
    expect(result).toBeTruthy();
  });

  test("test HtmlReceiptTest", async () => {
    const result = HtmlReceiptTest(mockPrintReceiptData);
    expect(result).toBeTruthy();
  });

  test("test onPrint", async () => {
    const result = onPrint("sample-receipt");
    expect(result).toBeTruthy();
  });
});
