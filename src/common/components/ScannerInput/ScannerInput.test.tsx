import { renderWithRedux, setupUser } from "@ct/common";
import { ScannerInput } from "./ScannerInput";

beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("barcodeChecker", () => {
  describe("regex passed - pouch acceptance/dispatch", () => {
    it("should filter out letters and return only numbers", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(
        <ScannerInput onSubmitBarcode={jest.fn()} forbiddenCharacterRegex={/[^0-9 ]/g} />,
      );
      await user.type(getByRole("textbox"), "xyzXX12345");
      expect(getByRole("textbox")).toHaveValue("12345");
    });

    it("should filter out special characters in a combination of numbers and special chars", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(
        <ScannerInput onSubmitBarcode={jest.fn()} forbiddenCharacterRegex={/[^0-9 ]/g} />,
      );
      await user.type(getByRole("textbox"), "%$&123");
      expect(getByRole("textbox")).toHaveValue("123");
    });

    it("should allow numbers and spaces only", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(
        <ScannerInput onSubmitBarcode={jest.fn()} forbiddenCharacterRegex={/[^0-9 ]/g} />,
      );
      await user.type(getByRole("textbox"), "123 4");
      expect(getByRole("textbox")).toHaveValue("123 4");
    });
  });

  describe("regex not passed - other cases", () => {
    it("should return a combination of letters and numbers", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(<ScannerInput onSubmitBarcode={jest.fn()} />);
      await user.type(getByRole("textbox"), "xyzXX12345");
      expect(getByRole("textbox")).toHaveValue("xyzXX12345");
    });

    it("should include special characters in a combination of numbers and special chars", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(<ScannerInput onSubmitBarcode={jest.fn()} />);
      await user.type(getByRole("textbox"), "%$&123");
      expect(getByRole("textbox")).toHaveValue("%$&123");
    });

    it("should allow numbers and spaces", async () => {
      const user = setupUser();
      const { getByRole } = renderWithRedux(<ScannerInput onSubmitBarcode={jest.fn()} />);
      await user.type(getByRole("textbox"), "123 4");
      expect(getByRole("textbox")).toHaveValue("123 4");
    });
  });
});

describe("scannerInput", () => {
  describe("Enter Button", () => {
    it("is visible when hideEnterButton is false", () => {
      const onSubmitBarcode = jest.fn();
      const hiddenEnterButton = false;
      const { getByRole } = renderWithRedux(
        <ScannerInput onSubmitBarcode={onSubmitBarcode} hideEnterButton={hiddenEnterButton} />,
      );
      const enterButton = getByRole("button", { name: "Enter" });
      expect(enterButton).toBeInTheDocument();
    });

    it("is hidden when hideEnterButton is true", () => {
      const onSubmitBarcode = jest.fn();
      const hiddenEnterButton = true;
      const { queryByRole } = renderWithRedux(
        <ScannerInput onSubmitBarcode={onSubmitBarcode} hideEnterButton={hiddenEnterButton} />,
      );
      const enterButton = queryByRole("button", { name: "Enter" });
      expect(enterButton).not.toBeInTheDocument();
    });
  });
  describe("useEffect functionality", () => {
    it("runs 3 second setTimeout if error or clearError passed as props ", () => {
      jest.useFakeTimers();
      jest.spyOn(global, "setTimeout");

      const onSubmitBarcode = jest.fn();
      const hiddenEnterButton = true;
      const clearErrors = jest.fn();
      const error = "Error";
      renderWithRedux(
        <ScannerInput
          onSubmitBarcode={onSubmitBarcode}
          hideEnterButton={hiddenEnterButton}
          clearErrors={clearErrors}
          error={error}
        />,
      );
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
    });

    it("does not run 3 second setTimeout if no error or clearError passed as props ", () => {
      jest.useFakeTimers();
      jest.spyOn(global, "setTimeout");
      const onSubmitBarcode = jest.fn();
      const hiddenEnterButton = true;
      renderWithRedux(
        <ScannerInput onSubmitBarcode={onSubmitBarcode} hideEnterButton={hiddenEnterButton} />,
      );
      expect(setTimeout).toHaveBeenCalledTimes(0);
    });
  });
});
