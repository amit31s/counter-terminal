import { ProviderProps } from "postoffice-spm-journey-engine";
import { Dispatch, SetStateAction, createContext } from "react";

export const JourneyInterruptContext = createContext<{
  interruptionInputData: ProviderProps["interruptionInputData"];
  setInterruptionInputData: Dispatch<SetStateAction<ProviderProps["interruptionInputData"]>>;
  journeyReset: () => void;
}>({
  interruptionInputData: undefined,
  setInterruptionInputData: () => {
    // stub
  },
  journeyReset: () => {
    // stub
  },
});
