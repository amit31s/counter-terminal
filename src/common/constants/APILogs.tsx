export enum API_LOGS_FN {
  getNumberOfEntries = "getNumberOfEntries",
  basketTransactions = "basketTransactions",
  getTransactions = "getTransactions",
  getTransactionId = "getTransactionId",
  doCommit = "doCommit",
  logoutCashDrawerFailureModal = "logoutCashDrawerFailureModal",
}

export enum API_LOGS_MSG {
  numberEntriesNotDefined = "NumberOfEntries was not specified in the getLastBasket API response",
  nothingReturnedGLBAPI = "Nothing returned from getLastBasket API ",
  fromToGetBasketAPI = "from or to date not found in getBasket api response",
  fadCodeNotFound = "Fadcode not found",
  unableToGetTransactionID = "Unable to get transaction ID due to connectivity issue",
  basketIdNotFound = "Basket id not found",
  cashDrawerAlreadyDissociated = "Cash drawer already dissociated. Hence navigating to associate cash drawer screen",
}
