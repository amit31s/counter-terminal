import { EventName } from "@ct/common/types";
import reducer, {
  IState,
  resetJourneyStatus,
  updateJourneyStatus,
} from "../updateJourneyStatus.slice";
const journeyEvent = [
  "journey.reset",
  "journey.completed",
  "journey.aborted",
  "journey.initialized",
  "journey.errored",
];

const mockInitialState: IState = {
  event: undefined,
  open: false,
};

describe("render updateJourneyStatus slice", () => {
  test("test updateJourneyStatus and resetJourneyStatus", () => {
    const journeyResetAction = updateJourneyStatus({
      EventName: journeyEvent[0] as EventName,
      DisplayPageNumber: 2,
    });
    const journeyResetResult = reducer(mockInitialState, journeyResetAction);
    expect(journeyResetResult.open).toBe(true);

    const journeyCompletedAction = updateJourneyStatus({
      EventName: journeyEvent[1] as EventName,
      DisplayPageNumber: 2,
    });
    const journeyCompletedResult = reducer(mockInitialState, journeyCompletedAction);
    expect(journeyCompletedResult.open).toBe(true);

    const journeyAbortedAction = updateJourneyStatus({
      EventName: journeyEvent[2] as EventName,
      DisplayPageNumber: 2,
    });
    const journeyAbortedResult = reducer(mockInitialState, journeyAbortedAction);
    expect(journeyAbortedResult.open).toBe(true);

    const journeyInitializedAction = updateJourneyStatus({
      EventName: journeyEvent[3] as EventName,
      DisplayPageNumber: 2,
    });
    const journeyInitializedResult = reducer(mockInitialState, journeyInitializedAction);
    expect(journeyInitializedResult.open).toBe(false);

    const journeyErroredAction = updateJourneyStatus({
      EventName: journeyEvent[4] as EventName,
      DisplayPageNumber: 2,
    });
    const journeyErroredResult = reducer(mockInitialState, journeyErroredAction);
    expect(journeyErroredResult.open).toBe(false);

    const action = resetJourneyStatus();
    const result = reducer(mockInitialState, action);
    expect(result.open).toBe(false);
  });

  test("test updateJourneyStatus when DisplayPageNumber is 1 and pass default value", () => {
    const action = updateJourneyStatus({
      EventName: journeyEvent[0] as EventName,
      DisplayPageNumber: 1,
    });
    const result = reducer(mockInitialState, action);
    expect(result.open).toBe(false);

    const defaultAction = updateJourneyStatus({
      EventName: "page.switched" as EventName,
      DisplayPageNumber: 2,
    });
    const defaultResult = reducer(mockInitialState, defaultAction);
    expect(defaultResult.open).toBe(true);
  });
});
