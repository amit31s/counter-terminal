import { PouchAcceptanceDetails } from "@ct/api/generator";
import { getPouchAcceptanceList, useAppSelector } from "@ct/common";

type UseGetPouchForAcceptance = {
  availablePouchData: PouchAcceptanceDetails[];
  validatedData: PouchAcceptanceDetails[];
};

export const useGetPouchForAcceptance = (): UseGetPouchForAcceptance => {
  const scannedPouch = useAppSelector(getPouchAcceptanceList);

  return {
    availablePouchData: scannedPouch.availablePouchData ?? [],
    validatedData: scannedPouch.validatedData ?? [],
  };
};
