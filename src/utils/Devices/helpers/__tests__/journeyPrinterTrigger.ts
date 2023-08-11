import * as samplePrinting from "@ct/utils/Printer/samplePrinting";
import * as templates from "@ct/utils/Printer/templates";
import { journeyPrinterTrigger } from "../journeyPrinterTrigger";
const mockOnPrint = jest.spyOn(samplePrinting, "onPrint").mockResolvedValue();
beforeEach(() => {
  jest.clearAllMocks();
});

describe("journeyPrintTrigger", () => {
  describe("case - print action", () => {
    describe("success cases", () => {
      it("logs a deprecation warning but prints successfully when passed a param value", async () => {
        const mockedConsoleWarn = jest.spyOn(console, "warn").mockReturnValue();
        const result = await journeyPrinterTrigger("print", { value: "test" });
        expect(mockedConsoleWarn).lastCalledWith(
          "WARNING! Passing raw template in journey is deprecated, please store in configuration-api",
        );
        expect(mockOnPrint).toHaveBeenCalled();
        expect(result).toStrictEqual({});
      });
    });
    describe("error cases", () => {
      it("throws an error if params are missing", async () => {
        const error = new Error("Missing context and/or template name");
        const callNoParams = () => journeyPrinterTrigger("print", {});
        await expect(callNoParams).rejects.toThrow("Missing context and/or template name");
        await expect(callNoParams).rejects.toEqual(error);
      });

      it("throws an error if context is missing", async () => {
        const error = new Error("Missing context and/or template name");
        const callNoContext = () => journeyPrinterTrigger("print", { template: "test" });
        await expect(callNoContext).rejects.toThrow("Missing context and/or template name");
        await expect(callNoContext).rejects.toEqual(error);
      });

      it("throws an error if template is missing", async () => {
        const error = new Error("Missing context and/or template name");
        const callNoTemplate = () => journeyPrinterTrigger("print", { context: {} });
        await expect(callNoTemplate).rejects.toThrow("Missing context and/or template name");
        await expect(callNoTemplate).rejects.toEqual(error);
      });
    });
  });
  describe("case - print from template", () => {
    describe("success cases", () => {
      it("successfully prints from a template", async () => {
        const mockGetHTMLTemplateResponse = "test html template";
        const mockGetHTMLTemplate = jest
          .spyOn(templates, "getHTMLTemplate")
          .mockResolvedValue(mockGetHTMLTemplateResponse);
        const response = await journeyPrinterTrigger("printFromTemplate", {});

        expect(mockGetHTMLTemplate).toBeCalledWith({});
        expect(mockOnPrint).toBeCalledWith(mockGetHTMLTemplateResponse);
        expect(response).toStrictEqual({});
        mockGetHTMLTemplate.mockReset();
      });
    });
    describe("error cases", () => {
      it("returns an error for no valid params", async () => {
        const response = () => journeyPrinterTrigger("printFromTemplate", null);
        await expect(response).rejects.toEqual("params not recognised");
      });
    });
  });
  describe("default case", () => {
    it("returns an error for printItemReport case", async () => {
      const response = () =>
        journeyPrinterTrigger("printItemReport", {
          value: "value",
          template: "template",
          context: {},
        });
      await expect(response).rejects.toEqual("Printer action not found: printItemReport");
    });
    it("returns an error for printDespatch case", async () => {
      const response = () =>
        journeyPrinterTrigger("printDespatch", {
          value: "value",
          template: "template",
          context: {},
        });
      await expect(response).rejects.toEqual("Printer action not found: printDespatch");
    });
  });
});
