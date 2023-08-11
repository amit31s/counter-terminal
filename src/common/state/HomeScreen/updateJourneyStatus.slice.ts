import { EventName } from "@ct/common/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  event: EventName | undefined;
  open: boolean;
}

const initialState: IState = {
  event: undefined,
  open: false,
};

type EventType = {
  EventName: EventName;
  DisplayPageNumber: number | undefined;
};

export const slice = createSlice({
  name: "journeyStatusStatus",
  initialState,
  reducers: {
    updateJourneyStatus: (state: IState, value: PayloadAction<EventType>) => {
      let open = false;
      const { EventName, DisplayPageNumber } = value.payload;
      state.event = EventName;
      switch (EventName) {
        case "journey.reset":
          open = true;
          break;
        case "journey.completed":
          open = true;
          break;
        case "journey.aborted":
          open = true;
          break;
        case "journey.initialized":
          open = false;
          break;
        case "journey.errored":
          open = false;
          break;
        default:
          open = true;
          break;
      }
      if (DisplayPageNumber === 1) {
        open = false;
      }
      state.open = open;
    },
    resetJourneyStatus: () => initialState,
  },
});

export const { updateJourneyStatus, resetJourneyStatus } = slice.actions;

export default slice.reducer;
