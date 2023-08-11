export enum JOURNEY_LOGS_FN {
  deviceActionsCallback = "DeviceActionsCallback",
  journeyPrinterTrigger = "journeyPrinterTrigger",
  journey = "Journey",
  handleBarcodeScan = "handleBarcodeScan",
  journeyEngineProvider = "JourneyEngine.Provider>onError",
}

export const JOURNEY_LOGS_VARS = {
  barcodeSet: (wasKeyed: boolean) => `Barcode ${wasKeyed ? "manually entered" : "scanned"}`,
};
