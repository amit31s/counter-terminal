export enum PED_LOGS_FN {
  processCardPayment = "processCardPayment",
  pedActionHandler = "pedActionHandler",
  triggerPrintingReceipt = "triggerPrintingReceipt",
  printReceipt = "printReceipt",
  skipPrintingReceipt = "skipPrintingReceipt",
  initPMSOnLogin = "Initialise Pin Pad on Login",
  useMagneticSwipeCardReader = "useMagneticSwipeCardReader",
  onSwipe = "onSwipe",
}

export enum PED_LOGS_MSG {
  transactionIDNotReceived = "transactionId not received from paymentsBankingClient",
  unableToGetTransactionId = "Unable to get transaction ID due to connectivity issue",
  cardNotSupportedByCounter = "The card is not supported by the counter.",
  errorAbortCardPayment = "Error aborting card payment",
  salesReceiptTriggered = "Sales receipt triggered",
  receiptPrintSuccess = "Receipt printed successfully",
  unableToStopJourney = "Unable to interrupt started journey",
  connected = "Connected",
  connectionClosed = "Connection closed, reconnecting...",
  connectionError = "Connection error",
  barCodeScanned = "Barcode scanned",
  connecting = "Connecting",
  connectingFailed = "Connecting failed",
  cardSwiped = "Card swiped",
  msrDisabled = "MSR disabled",
}

export const PED_LOGS_VARS = {
  amountCardPayment: (cardPaymentAmount: number) => `Amount: £${cardPaymentAmount}`,
  amountCardValidation: (
    amountEntered: string,
    maximum: string,
    minimum: string,
    multipleOf: string,
  ) =>
    `MSG99607: The amount £${amountEntered} is invalid for this card.\n\nThe amount must be in the range £${minimum} to £${maximum} and be a multiple of ${multipleOf}.\n\nAdvise the customer to pay a different amount, or use an alternative method of payment.`,
  cardAmountMultipleOf: (multipleOf: number) =>
    `MSG00699: The amount input was not an expected multiple.\n\nThe amount should be a multiple of ${multipleOf}.`,
  amountUpdated: (cardPaymentAmountUpdated: number) => `Amount: £${cardPaymentAmountUpdated}`,
  receiptPriniting: (template: string, receiptOptional: boolean | undefined) =>
    `Printing ${template} receipt, printing optional? ${receiptOptional}`,
  initPMS: (pedInit: string) => `Initialised: ${String(pedInit)}`,
};
