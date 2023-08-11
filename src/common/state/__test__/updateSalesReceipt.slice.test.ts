import reducer, {
  resetSalesReceipt,
  SalesItem,
  SalesReceiptData,
  updateSalesReceipt,
} from "../updateSalesReceipt.slice";
const mockSalesItem: SalesItem = {
  itemTitle: "test-item-title",
  qty: 0,
  price: "test-price",
  total: "test-total",
};
const mockInitialState: SalesReceiptData = {
  isSuccessReceipt: true,
  isFailureReceipt: false,
  isCardReceipt: false,
  branchAddress: "mock-address",
  fadCode: "mock-fadcode",
  vatRegNo: "mock-vatgegno",
  DateOfIssue: "mock-dateofissue",
  sessionId: "mock-session",
  items: [mockSalesItem],
  customerToPay: "mock-customToPay",
  postOfficeToPay: "mock-postofficetopay",
  amountPaidByCard: "mock-amountbycard",
  amountPaidByCash: "mock-amountbycash",
  balance: "mock-balance",
  empName: "mock-empName",
  cardDetails: ["mock-empName"],
  recieptType: "success",
};

const mockSalesState: SalesReceiptData = {
  isSuccessReceipt: true,
  isFailureReceipt: true,
  isCardReceipt: true,
  branchAddress: "test-address",
  fadCode: "test-fadcode",
  vatRegNo: "test-vatgegno",
  DateOfIssue: "test-dateofissue",
  sessionId: "test-session",
  items: [mockSalesItem],
  customerToPay: "test-customToPay",
  postOfficeToPay: "test-postofficetopay",
  amountPaidByCard: "test-amountbycard",
  amountPaidByCash: "test-amountbycash",
  balance: "test-balance",
  empName: "test-empName",
  cardDetails: ["test-empName"],
  recieptType: "success",
};

describe("render updateSalesReceipt", () => {
  test("test updateSalesReceipt", async () => {
    const action = updateSalesReceipt(mockSalesState);
    const result = await reducer(mockInitialState, action);
    expect(result.DateOfIssue).toBe("test-dateofissue");
  });

  test("test resetSalesReceipt", async () => {
    const action = updateSalesReceipt(mockSalesState);
    const result = await reducer(mockInitialState, action);
    expect(result.items?.length).toBe(1);

    const resetAction = resetSalesReceipt;
    const resetResult = await reducer(mockInitialState, resetAction);
    expect(resetResult.items?.length).toBe(0);
  });
});
