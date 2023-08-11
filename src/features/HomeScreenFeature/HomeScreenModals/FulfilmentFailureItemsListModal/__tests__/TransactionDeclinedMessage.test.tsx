import { renderWithRedux } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import { TransactionDeclinedMessage } from "../TransactionDeclinedMessage";

beforeAll(() => {
  jest.clearAllMocks();
});
describe("transaction declined message", () => {
  it("renders component with declined message and no notice ID if no noticeId detected", () => {
    const { getByText } = renderWithRedux(<TransactionDeclinedMessage />);
    expect(getByText("Transaction Declined")).toBeInTheDocument();
  });

  it("renders component with declined message and notice ID and noticeDescription if present", () => {
    jest
      .spyOn(selector, "useAppSelector")
      .mockReturnValue({ noticeId: "noticeId", noticeDescription: "noticeDescription" });
    const { container } = renderWithRedux(<TransactionDeclinedMessage />);
    expect(container).toHaveTextContent("noticeId - Transaction DeclinednoticeDescription");
  });
});
