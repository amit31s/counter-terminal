import { BasketStateEnum } from "postoffice-commit-and-fulfill";

export enum BASKET_PROCESS_LOGS_FN {
  initiateCloseBasketPB = "initiateCloseBasket PaymentButton",
  onCompletePressPB = "onCompletePress PaymentButton",
  onFinishPressPB = "onFinishPress PaymentButton",
  updateBasketCloseStatus = "updateBasketCloseStatus",
  closeBasket = "closeBasket",
  completeAndCloseBasket = "completeAndCloseBasket",
  closePrintConfirmationModal = "closePrintConfirmationModal",
  dispatchPaymentStatus = "dispatchPaymentStatus",
  openBasket = "openBasket",
  updateBasketIdStatusState = "updateBasketIdStatusState",
  loadNbitBasketPending = "loadNbitBasket.pending",
  loadNbitBasketFulfilled = "loadNbitBasket.fulfilled",
  loadNbitBasketRejected = "loadNbitBasket.rejected",
  loadNbitBasket = "loadNbitBasket",
  convertBasketFields = "convertBasketFields",
  suspendBasket = "suspendBasket",
  clearSuspendedBasket = "clearSuspendedBasket",
  removeItemFromBasket = "removeItemFromBasket",
  clearBasket = "clearBasket",
  useAddBasketItem = "useAddBasketItem",
}

export enum BASKET_PROCESS_LOGS_MSG {
  createEntryFailedCloseBasketPB = "Create Entry failed. Please confirm to close basket",
  basketClosedFailed = "Basket closed failed",
  basketClosed = "Basket closed",
  noValueGetLastBasketAPI = "Nothing returned from getLastBasket API ",
  basketIDNotSpecifiedLastBasketAPI = "basketID was not specified in the getLastBasket API response",
  noeNotSpecifiedLastBasketAPI = "NumberOfEntries was not specified in the getLastBasket API response",
  transactionFinishedSuccessfully = "Transaction finished successfully",
  transactionFinishedSuccessfullyRS = "Transaction finished successfully from refund screen",
  paymentCompletedCash = "Payment Completed by Cash",
  paymentCompletedCard = "Payment Completed by Card",
  basketAlreadyOpen = "Basket already opened",
  basketCreated = "Basket created",
  basketOpened = "Basket opened",
  loadBasketPending = "loadNbitBasket pending",
  loadBasketSuccess = "loadNbitBasket loaded successfully",
  loadBasketFailed = "loadNbitBasket failed",
  retrievedLocalBasket = "retrieved local basket",
  removingBasketItem = "Removing basket item",
  voidingBasket = "Voiding basket",
  basketCleanSuccess = "Basket cleaned successfully",
  clearBasketFailed = "clearBasket failed",
  addingItemToBasket = "Adding item to basket",
}

export const BASKET_PROCESS_LOGS_VARS = {
  basketAlreadyClosedWithBasketIDEntries: (basketID: string, numberOfEntries: number) =>
    `Basket ${basketID} already closed. Basket state is ${BasketStateEnum.Bkc} with ${numberOfEntries} items`,
  basketClosedSuccessEntries: (numberOfEntries: number) =>
    `Basket closed successfully with ${numberOfEntries} items`,
  closeBasketFailedErrorCode: (errorCode: string | undefined) =>
    `closeBasket failed. Error Code ${errorCode}`,
};
