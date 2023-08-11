import { getAccCard, getPouchDispatchList } from "@ct/common";
import { useAppSelector } from "@ct/common/hooks";
import { NoPouchScanned } from "./NoAccScanned";
import { ScannedPouchList } from "./ScannedPouchList";
import { ShowCountForPouchToDispatch } from "./ShowCountForPouchToDispatch";

export const PouchDispatchLeftPanel = () => {
  const scannedPouch = useAppSelector(getPouchDispatchList);
  const accCardScan = useAppSelector(getAccCard);

  if (scannedPouch.validatedData?.length) {
    return <ScannedPouchList pouchList={scannedPouch.validatedData} />;
  }

  if (accCardScan.scanned) {
    return <ShowCountForPouchToDispatch />;
  }
  return <NoPouchScanned />;
};
