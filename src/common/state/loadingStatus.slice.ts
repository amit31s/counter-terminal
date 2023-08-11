import { CustomModalProps } from "@ct/components";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findLastIndex, pullAt } from "lodash";

export type LoadingStatusEntry = {
  modalProps: Omit<CustomModalProps, "isOpen">;
  id: string | null;
};

export type LoadingStatus = LoadingStatusEntry[];

const initialState: LoadingStatus = [];

export enum LoadingId {
  PIN_PAD = "pinPad",
  TENDERING = "tendering",
  PRINTING = "printing",
  LABEL_CONFIRMATION = "labelConfirmation",
  VOID_BASKET = "voidBasket",
  VOID_ITEM = "voidItem",
  POUCH_DESPATCH = "pouchDespatch",
  START_COMMIT = "startCommit",
  HOME_SCREEN_COMMITTING = "homeScreenCommitting",
  HOME_SCREEN_JOURNEY_NOTICE = "homeScreenJourneyNotice",
  LOAD_POUCH_TO_DISPATCH = "LOAD_POUCH_TO_DISPATCH",
  SUSPEND_BASKET_MODAL = "suspendBasketModal",
  SETTLE_WITH_CASH = "SettleWithCash",
  IRC_INVALID_AMOUNT = "IRC",
  POUCH_SUBMIT = "PouchSubmit",
}

export const slice = createSlice({
  name: "loadingStatus",
  initialState,
  reducers: {
    updateLoadingStatus: (_: LoadingStatus, { payload }: PayloadAction<LoadingStatus>) => payload,
    setLoadingActive: (
      state: LoadingStatus,
      {
        payload: { modalProps, id } = { modalProps: {}, id: null },
      }: PayloadAction<Partial<Omit<LoadingStatusEntry, "isLoading">> | undefined>,
    ) => {
      if (id !== null) {
        const matchIndex = state.findIndex((val) => val.id === id);
        if (matchIndex >= 0) {
          state[matchIndex].modalProps = modalProps ?? {};
          return;
        }
      }

      state.push({ modalProps: modalProps ?? {}, id: id ?? null });
    },
    setLoadingInactive: (
      state: LoadingStatus,
      { payload: id }: PayloadAction<string | null | undefined>,
    ) => {
      const matchIndex = findLastIndex(state, (val) => val.id === (id ?? null));
      if (matchIndex < 0) return;

      pullAt(state, matchIndex);
    },
    resetLoadingStatus: () => initialState,
  },
});

export const { updateLoadingStatus, setLoadingActive, setLoadingInactive, resetLoadingStatus } =
  slice.actions;

export default slice.reducer;
