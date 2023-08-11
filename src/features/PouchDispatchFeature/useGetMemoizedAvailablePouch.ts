import { PouchDataForDespatch } from "@ct/api/generator";
import { useMemo } from "react";

type UseGetMemoizedAvailablePouchProps = {
  availablePouchData: PouchDataForDespatch[];
  validatedData: PouchDataForDespatch[];
};
export const useGetMemoizedAvailablePouch = ({
  availablePouchData,
  validatedData,
}: UseGetMemoizedAvailablePouchProps): PouchDataForDespatch[] => {
  return useMemo(() => {
    const validatedBarcodes = validatedData.map((validatedPouch) => validatedPouch.pouchID);
    return availablePouchData.filter(
      (availablePouch) => !validatedBarcodes.includes(availablePouch.pouchID),
    );
  }, [availablePouchData, validatedData]);
};
