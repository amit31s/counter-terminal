import { useAppDispatch } from "@ct/common/hooks";
import { setValidatedData } from "@ct/common/state/pouchAcceptance";
import { useGetPouchForAcceptance } from "../useGetPouchForAcceptance";
import { NoPouchScanned } from "./noPouchScanned";
import { ScannedPouchList } from "./scannedPouchList";

export const PouchAcceptanceLeftPanel = () => {
  const dispatch = useAppDispatch();
  const { validatedData } = useGetPouchForAcceptance();

  if (validatedData.length) {
    return (
      <ScannedPouchList
        pouchList={validatedData}
        deleteCallback={(data) => dispatch(setValidatedData(data))}
      />
    );
  }
  return <NoPouchScanned />;
};
