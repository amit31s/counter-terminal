import { PouchAcceptanceDetails } from "@ct/api/generator";
import { getPouchAcceptanceList } from "@ct/common";
import { updateScannedPouchForAcceptance } from "@ct/common/state/pouchAcceptance";
import {
  setShowAvailablePouches,
  setValidatedData,
} from "@ct/common/state/pouchAcceptance/pouchAcceptanceFeature.slice";
import AvailablePouchList from "@ct/components/AvailablePouchList";
import { UnableToScan } from "@ct/features/PouchManagement";
import { View } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { useGetPouchForAcceptance } from "../useGetPouchForAcceptance";
import { PouchAcceptanceScanner } from "./PouchAcceptanceScanner";
import { ZeroValuePouch } from "./ZeroValuePouch";
import { useGetAvailablePouchForAcceptance } from "./useGetAvailablePouchForAcceptance";

export const PouchAcceptanceRightPanel = () => {
  const dispatch = useDispatch();
  const scannedPouch = useSelector(getPouchAcceptanceList);
  const { validatedData } = useGetPouchForAcceptance();
  const { availablePouch } = useGetAvailablePouchForAcceptance();
  const handleSelectedPouch = (pouch: PouchAcceptanceDetails) => {
    const found = validatedData.some(
      (element: PouchAcceptanceDetails) => element.pouchID === pouch.pouchID,
    );

    if (found) {
      return;
    }

    const isZeroValuePouch = pouch.totalValue;

    if (isZeroValuePouch === 0) {
      dispatch(setShowAvailablePouches(false));
      dispatch(
        updateScannedPouchForAcceptance({
          data: pouch,
          barcode: pouch.pouchID || "",
          time: +new Date(),
          status: 200,
        }),
      );
      return;
    }

    dispatch(setValidatedData([...validatedData, pouch]));
    dispatch(setShowAvailablePouches(false));
  };

  if (scannedPouch.data?.totalValue === 0) {
    return <ZeroValuePouch />;
  }

  if (scannedPouch.showAvailablePouches) {
    return (
      <View
        marginTop={"10%"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"space-between"}
        height={"80vh"}
      >
        <View>
          <AvailablePouchList
            availablePouches={availablePouch ?? []}
            parentCallback={handleSelectedPouch}
          />
        </View>
        <View>
          <UnableToScan />
        </View>
      </View>
    );
  }

  return <PouchAcceptanceScanner />;
};
