import { ReceiptContext } from "../../Services/ReceiptService";

export enum Device {
  Printer = "printer",
  Bluetooth = "bluetooth",
  LabelPrinter = "labelPrinter",
  Ped = "ped",
  Scanner = "scanner",
}

export type DeviceError = {
  message?: string;
  name?: string;
  status?: number;
};

export type PrinterActions = "print" | "printFromTemplate" | "printDespatch" | "printItemReport";
export type LabelPrinterActions = "print" | "printLabel2Go";

export type JourneyPrinterTriggerParams = {
  value?: string;
  template?: string;
  context?: ReceiptContext;
};
