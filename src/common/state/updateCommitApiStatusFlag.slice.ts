import { createSlice } from "@reduxjs/toolkit";

export interface ICommitStatusState {
  isErrorOccured: boolean;
  showModal: boolean;
}

const initialState: ICommitStatusState = {
  isErrorOccured: false,
  showModal: false,
};

export const slice = createSlice({
  name: "updateCommitApiStatusFlag",
  initialState,
  reducers: {
    setCommitErrorModal: (state: ICommitStatusState) => {
      state.isErrorOccured = true;
      state.showModal = true;
    },
    setCommitApiStatus: (state: ICommitStatusState) => {
      state.isErrorOccured = true;
    },
    resetCommitApiStatus: (state: ICommitStatusState) => {
      state.isErrorOccured = false;
    },
    showCommitFailureModal: (state: ICommitStatusState) => {
      state.showModal = true;
    },
    hideCommitFailureModal: (state: ICommitStatusState) => {
      state.showModal = false;
    },
    resetCommitApiStatusFlag: () => initialState,
  },
});

export const {
  setCommitApiStatus,
  resetCommitApiStatus,
  showCommitFailureModal,
  hideCommitFailureModal,
  resetCommitApiStatusFlag,
  setCommitErrorModal,
} = slice.actions;

export default slice.reducer;
