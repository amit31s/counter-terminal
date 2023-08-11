import { ProviderProps } from "postoffice-spm-journey-engine";
import { JourneyInterruptionTypes } from "./JourneyInterruptionTypes.enum";

export const maybeTokenisePayload = (
  value: string,
  typePrecedence: JourneyInterruptionTypes[],
): ProviderProps["interruptionInputData"] => {
  return {
    type: "tokeniser",
    action: "maybeTokenise",
    typePrecedence,
    value,
  };
};
