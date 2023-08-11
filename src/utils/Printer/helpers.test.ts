import { StarPrinter, StarXpandCommand } from "postoffice-receiptprinter-star-io10";
import WebSocketAsPromised from "websocket-as-promised";
import { PrinterLifecycle, printRasterizedHtml } from "./helpers";

jest.mock("../../utils/Printer/samplePrinting", () => ({
  onPrint: jest.fn(),
  createReceipt: jest.fn(),
}));

jest.mock("postoffice-html-to-image", () => ({
  HtmlToImageInstance: jest.fn(),
  ConvertHtml: {
    htmlToImage: jest.fn().mockResolvedValue("abc123"),
    htmlToImageWithTimeOut: jest.fn(),
  },
}));

const mockOpen = jest.spyOn(WebSocketAsPromised.prototype, "open").mockImplementation(jest.fn());
const mockSendRequest = jest
  .spyOn(WebSocketAsPromised.prototype, "sendRequest")
  .mockImplementation(jest.fn());
const mockClose = jest.spyOn(WebSocketAsPromised.prototype, "close").mockImplementation(jest.fn());

describe("helpers", () => {
  const onInitialize = jest.fn();
  const onTrigger = jest.fn();
  const printingStarted = jest.fn();
  const onComplete = jest.fn();
  const onError = jest.fn();
  const events: PrinterLifecycle = {
    onInitialize,
    onTrigger,
    printingStarted,
    onComplete,
    onError,
  };

  jest
    .spyOn(StarXpandCommand.StarXpandCommandBuilder.prototype, "getCommands")
    .mockImplementation(async () => "printCommands");

  jest.spyOn(StarPrinter.prototype, "open").mockImplementation(jest.fn());
  jest.spyOn(StarPrinter.prototype, "print").mockImplementation(jest.fn());
  jest.spyOn(StarPrinter.prototype, "close").mockImplementation(jest.fn());
  jest.spyOn(StarPrinter.prototype, "dispose").mockImplementation(jest.fn());

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("printRasterizedHtml", () => {
    it("calls onInitialize lifecycle methods", async () => {
      await printRasterizedHtml("<p>hello testing<p>", events, 100);
      expect(mockOpen).toBeCalledTimes(1);
      expect(mockSendRequest).toBeCalledTimes(1);
      expect(mockClose).toBeCalledTimes(1);
    });
  });
});
