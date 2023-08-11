import { getAccCard, useAppSelector } from "@ct/common";
import { AccScanner } from "./AccCardScanner";
import { PouchDispatchScanner } from "./PouchDispatchScanner";
import { PreparePouchToDispatch } from "./PreparePouchToDispatch/PreparePouchToDispatch";
import { ShowAvailablePouch } from "./ShowAvailablePouch";

export const PouchDispatchRightPanel = () => {
  const accCardScan = useAppSelector(getAccCard);

  if (accCardScan.scanned) {
    return (
      <>
        <ShowAvailablePouch />
        <PouchDispatchScanner />
        <PreparePouchToDispatch />
      </>
    );
  }

  return <AccScanner />;
};
