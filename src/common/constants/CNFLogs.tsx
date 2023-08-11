export enum CNF_LOGS_FN {
  handleFulfillmentResponse = "handleFulfillmentResponse",
  onCommitError = "onCommitError",
  onCommitSuccess = "onCommitSuccess",
  onFulfillmentError = "onFulfillmentError",
  onFulfillmentSuccess = "onFulfillmentSuccess",
  useCommitCash = "useCommitCash",
  useEffect = "useEffect",
}

export enum CNF_LOGS_MSG {
  warningNoUid = "WARNING: uniqueID not received from C&F lib. So using timestamp as uniqueID",
  failedToAddRejectLabel = "Failed to add reject label item to basket, RejectProdNo or BalancingProdNo token missing from item.",
  labelPrintingSuccess = "Label printing successful, checking print with user",
  entryCreated = "Entry Created",
  onFulfillmentSuccessMessage = "placeholder message for onFulfillmentSuccess",
  commitBasket = "commitBasket",
}

export const CNF_LOGS_VARS = {
  labelPrintingFailed: (errorMessage: string) =>
    `Label printing failed: ${JSON.stringify(errorMessage)}`,
  unRecognisedLabelError: (status: string) =>
    `Unrecognized label status, expected: "labelPrintComplete"|"labelPrintError", received: ${status}`,
};
