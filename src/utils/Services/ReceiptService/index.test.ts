import { ReceiptPrinterModes, setup } from "postoffice-peripheral-management-service";
import storage from "postoffice-spm-async-storage";
import WebSocketAsPromised from "websocket-as-promised";
import { compileReceipt, printPhysicalReceipt } from "./index";

jest.mock("postoffice-spm-async-storage");
jest.mock("postoffice-peripheral-management-service");

describe("Receipt Service Tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should print text receipt when flag is provided in receipt context", async () => {
    const printMock = jest.fn().mockReturnValue(true);

    storage.getRecord = jest.fn().mockResolvedValue({
      id: "_config/receipt-template/test",
      value: `{{ format:twoColumn valueOne valueTwo }}`,
    });

    const mSetup = jest.mocked(setup);
    mSetup.mockReturnValue({
      connection: new WebSocketAsPromised("test"),
      buildClient: jest.fn().mockReturnValue({
        print: printMock,
      }),
    });

    await printPhysicalReceipt("test", {
      textMode: true,
      valueOne: "Hello",
      valueTwo: "World!",
    });

    expect(printMock).toHaveBeenCalledTimes(1);

    expect(printMock).toHaveBeenCalledWith(
      expect.stringContaining("Hello                               World!"),
      ReceiptPrinterModes.Text,
    );
  });

  test("should correctly render receipt template and context variables", async () => {
    storage.getRecord = jest.fn().mockResolvedValue({
      id: "_config/receipt-template/test",
      value: "My car is a {{ colour }} {{ model }}.",
    });

    const result = await compileReceipt("test", {
      colour: "Red",
      model: "BMW",
    });

    expect(storage.getRecord).toBeCalledTimes(1);
    expect(storage.getRecord).toBeCalledWith("test", { prefix: "_config/receipt-template" });
    expect(result).toEqual("My car is a Red BMW.");
  });

  test("should throw an exception when template isn't provided", async () => {
    storage.getRecord = jest.fn().mockResolvedValue({
      id: "fail",
    });
    await expect(compileReceipt("test", {})).rejects.toThrowError(
      "Receipt template 'test' not found",
    );
  });
});
