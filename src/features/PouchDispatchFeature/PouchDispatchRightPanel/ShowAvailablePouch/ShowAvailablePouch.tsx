import { PouchDataForDespatch } from "@ct/api/generator";
import { getPouchDispatchList, useAppDispatch, useAppSelector } from "@ct/common";
import {
  updateShowAvailablePouches,
  updateValidatedData,
} from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { AvailablePouchForDispatch } from "@ct/components/AvailablePouchList/AvailablePouchForDispatch";
import { View } from "native-base";
import { useGetMemoizedAvailablePouch } from "../../useGetMemoizedAvailablePouch";

export const ShowAvailablePouch = () => {
  const dispatch = useAppDispatch();

  const { showAvailablePouches, availablePouchData, validatedData } =
    useAppSelector(getPouchDispatchList);

  const memoizedAvailablePouch = useGetMemoizedAvailablePouch({
    availablePouchData,
    validatedData,
  });

  const handleSelectedPouch = (pouch: PouchDataForDespatch) => {
    const found = validatedData.find(
      (element: PouchDataForDespatch) => element.pouchID === pouch.pouchID,
    );
    if (!found) {
      dispatch(updateShowAvailablePouches(false));
    }
    dispatch(updateValidatedData([...validatedData, pouch]));
  };

  return (
    <>
      {showAvailablePouches && (
        <View mt={"10%"} testID="availablePouch">
          <AvailablePouchForDispatch
            availablePouches={memoizedAvailablePouch}
            parentCallback={handleSelectedPouch}
          />
        </View>
      )}
    </>
  );
};
