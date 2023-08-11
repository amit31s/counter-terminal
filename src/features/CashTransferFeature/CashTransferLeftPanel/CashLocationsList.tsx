import { useAppDispatch, useGetUser } from "@ct/common";
import {
  CashLocation,
  setSelectedCashLocation,
} from "@ct/common/state/cashTransfer/cashTransfer.slice";
import List from "@ct/components/List";
import { colorConstants } from "@ct/constants";
import { DeviceAttributes } from "@ct/interfaces/device.interface";
import { Text, View } from "native-base";
import { useLoadCashLocations } from "./useLoadCashLocations";

export const CashLocationsList = () => {
  const dispatch = useAppDispatch();
  const { device }: { device: DeviceAttributes } = useGetUser();
  const { data } = useLoadCashLocations();

  return (
    <View>
      <View
        justifyContent="center"
        borderWidth={1}
        borderColor={colorConstants.borderColor}
        borderRadius={4}
        h={74}
        w={290}
        mb={13}
      >
        <Text ml="20px" variant="body">
          Counter - {device.nodeID}
        </Text>
      </View>
      <View>
        <List
          list={data}
          selectedLocationCallback={(selectedCashLocation: CashLocation) => {
            dispatch(setSelectedCashLocation(selectedCashLocation));
          }}
        />
      </View>
    </View>
  );
};
