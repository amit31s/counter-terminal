import { PouchAcceptanceList, useGetAcceptanceList } from "@ct/api/generator";
import { useAppDispatch } from "@ct/common";
import { setAvailablePouchData } from "@ct/common/state/pouchAcceptance";
import { useState } from "react";

export const useGetAvailablePouchForAcceptance = () => {
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);
  const { data } = useGetAcceptanceList({
    query: {
      enabled: !loaded,
      onSuccess(availablePouchData: PouchAcceptanceList) {
        setLoaded(true);
        if (availablePouchData) {
          dispatch(setAvailablePouchData(availablePouchData));
        }
      },
      onError() {
        setLoaded(false);
      },
    },
  });
  return { availablePouch: data };
};
