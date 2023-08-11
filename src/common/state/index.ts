import printedReceiptsReducer from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import pouchAcceptanceReducer from "@ct/common/state/pouchAcceptance/pouchAcceptanceFeature.slice";
import updateScannedPouchForAcceptanceReducer from "@ct/common/state/pouchAcceptance/updateScannedPouchAcceptanceFeature.slice";
import updateAccCardReducer from "@ct/common/state/pouchDispatch/accCardFeature.slice";
import { crashReporter } from "@pol/frontend-logger-web";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import updateUpDownArrowReducer from "./HomeScreen/UpdateUpDownArrow";
import updateBasketReducer from "./HomeScreen/updateBasket.slice";
import updateBasketIdStatusReducer from "./HomeScreen/updateBasketIdStatus.slice";
import updateFulfillmentReducer from "./HomeScreen/updateFulfillment.slice";
import updateFulfillmentErrorReducer from "./HomeScreen/updateFulfillmentError.slice";
import updateHomeScreenStageReducer from "./HomeScreen/updateHomeScreenStage.slice";
import updateJourneyStatusReducer from "./HomeScreen/updateJourneyStatus.slice";
import updateNumpadFlagStatusReducer from "./HomeScreen/updateNumpadFlag.slice";
import updatePaymentStatusReducer from "./HomeScreen/updatePaymentStatus.slice";
import updateQuantityFlagReducer from "./HomeScreen/updateQuantityFlag.slice";
import updateReceiptDataReducer from "./HomeScreen/updateRecieptData.slice";
import updateSuspendBasketNotificationIsVisibleReducer from "./HomeScreen/updateSuspendBasketNotification";
import updateVoidStatusReducer from "./HomeScreen/updateVoidStatus.slice";
import authReducer from "./auth.slice";
import cashTransfer from "./cashTransfer/cashTransfer.slice";
import noNetworkModalReducer from "./common/noNetwork.slice";
import updateCountToShowAvailablePouchListToDispatchReducer from "./countToShowAvailablePouchListToDispatch.slice";
import keypadReducer from "./keypad.slice";
import labelFulfilmentReducer from "./labelFulfillment.slice";
import labelPrinterReducer from "./labelPrinter.slice";
import loadingStatusReducer from "./loadingStatus.slice";
import { listenerMiddleware, startAuthMiddlewareListening } from "./middleware";
import pedReducer from "./ped.slice";
import updatePouchDispatchListReducer from "./pouchDispatch/pouchDispatchFeature.slice";
import touchKeyboard from "./touchKeyboard.slice";
import updateCommitApiStatusFlagReducer from "./updateCommitApiStatusFlag.slice";
import updateSalesReceiptReducer from "./updateSalesReceipt.slice";

startAuthMiddlewareListening();

export const reducer = {
  auth: authReducer,
  cashTransfer,
  keypad: keypadReducer,
  labelFulfilment: labelFulfilmentReducer,
  labelPrinter: labelPrinterReducer,
  loadingStatus: loadingStatusReducer,
  noNetwork: noNetworkModalReducer,
  ped: pedReducer,
  pouchAcceptanceList: pouchAcceptanceReducer,
  printedReceipts: printedReceiptsReducer,
  touchKeyboard,
  updateAccCard: updateAccCardReducer,
  updateBasket: updateBasketReducer,
  updateBasketIdStatus: updateBasketIdStatusReducer,
  updateCommitApiStatusFlag: updateCommitApiStatusFlagReducer,
  updateCountToShowAvailablePouchListToDispatch:
    updateCountToShowAvailablePouchListToDispatchReducer,
  updateFulfillment: updateFulfillmentReducer,
  updateFulfillmentError: updateFulfillmentErrorReducer,
  updateHomeScreenStage: updateHomeScreenStageReducer,
  updateJourneyStatus: updateJourneyStatusReducer,
  updateNumpadFlagStatus: updateNumpadFlagStatusReducer,
  updatePaymentStatus: updatePaymentStatusReducer,
  updatePouchDispatchList: updatePouchDispatchListReducer,
  updateQuantityFlag: updateQuantityFlagReducer,
  updateRecieptData: updateReceiptDataReducer,
  updateSalesReceipt: updateSalesReceiptReducer,
  updateScannedPouchForAcceptance: updateScannedPouchForAcceptanceReducer,
  updateSuspendBasketNotification: updateSuspendBasketNotificationIsVisibleReducer,
  updateUpDownArrow: updateUpDownArrowReducer,
  updateVoidStatus: updateVoidStatusReducer,
};

const rootReducer = combineReducers(reducer);
type Whitelist = keyof typeof reducer;
const whitelist: Whitelist[] = [
  "labelPrinter",
  "printedReceipts",
  "updateSuspendBasketNotification",
];
const persistConfig = {
  key: "root",
  storage,
  whitelist: whitelist,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  // some slices use serialized components such as loading
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(crashReporter, listenerMiddleware.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
