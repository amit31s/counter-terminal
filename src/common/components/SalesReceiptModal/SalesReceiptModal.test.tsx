import { renderWithRedux, setupUser } from "@ct/common";
import SalesReceiptModal from "./SalesReceiptModal";

beforeEach(() => {
  jest.clearAllMocks();
});
describe("salesReceiptModal", () => {
  describe("component render", () => {
    it("renders modal if set to open", async () => {
      const isOpen = true;
      const setIsOpen = jest.fn();
      const onPrintingFinished = jest.fn();
      const { getByRole } = renderWithRedux(
        <SalesReceiptModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onPrintingFinished={onPrintingFinished}
        />,
      );
      const yesButton = getByRole("button", { name: "Yes" });
      const noButton = getByRole("button", { name: "No" });
      expect(yesButton).toBeInTheDocument();
      expect(noButton).toBeInTheDocument();
    });

    it("doesn't render modal if set to close", async () => {
      const isOpen = false;
      const setIsOpen = jest.fn();
      const onPrintingFinished = jest.fn();
      const { queryByRole } = renderWithRedux(
        <SalesReceiptModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onPrintingFinished={onPrintingFinished}
        />,
      );
      const yesButton = queryByRole("button", { name: "Yes" });
      const noButton = queryByRole("button", { name: "No" });
      expect(yesButton).not.toBeInTheDocument();
      expect(noButton).not.toBeInTheDocument();
    });
  });

  describe("click events", () => {
    describe("yes button", () => {
      it("fires printReceipt function", async () => {
        const user = setupUser();
        const isOpen = true;
        const setIsOpen = jest.fn();
        const onPrintingFinished = jest.fn();
        const { getByRole } = renderWithRedux(
          <SalesReceiptModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onPrintingFinished={onPrintingFinished}
          />,
        );
        const yesButton = getByRole("button", { name: "Yes" });
        await user.click(yesButton);
        expect(setIsOpen).toBeCalledWith(false);
        expect(onPrintingFinished).toBeCalled();
      });
    });

    describe("no button", () => {
      it("fires skipPrintReceipt function", async () => {
        const user = setupUser();
        const isOpen = true;
        const setIsOpen = jest.fn();
        const onPrintingFinished = jest.fn();
        const { getByRole } = renderWithRedux(
          <SalesReceiptModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onPrintingFinished={onPrintingFinished}
          />,
        );
        const noButton = getByRole("button", { name: "No" });
        await user.click(noButton);
        expect(setIsOpen).toBeCalledWith(false);
        expect(onPrintingFinished).toBeCalled();
      });
    });
  });
});
