import { PouchAcceptanceDetails } from "@ct/api/generator";
import { useGetPouchForAcceptance } from "@ct/features/PouchAcceptanceFeature/useGetPouchForAcceptance";
import { priceToRender } from "@ct/utils";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableHighlight, View } from "react-native";
import { stringConstants } from "../../constants";
import colorConstants from "../../constants/ColorConstants";
import styles from "./styles";

interface AvailablePouchListProps {
  availablePouches: PouchAcceptanceDetails[];
  parentCallback: (pouch: PouchAcceptanceDetails) => void;
  pouchValueAddition?: string;
}

const AvailablePouchList = ({ availablePouches, parentCallback }: AvailablePouchListProps) => {
  const { validatedData } = useGetPouchForAcceptance();

  availablePouches = useMemo(() => {
    const validatedBarcodes = validatedData.map((validatedPouch) => validatedPouch.pouchID);
    if (!availablePouches || !Array.isArray(availablePouches)) {
      return [];
    }
    return availablePouches.filter(
      (availablePouch) => !validatedBarcodes.includes(availablePouch.pouchID),
    );
  }, [availablePouches, validatedData]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const touchProps = {
    activeOpacity: 1,
    underlayColor: colorConstants.disabledTextColour,
  };

  const handleClick = (item: PouchAcceptanceDetails) => {
    if (!item.pouchID) {
      return;
    }
    setSelectedId(item.pouchID);
    parentCallback(item);
  };

  const renderItem = ({ item, index }: { item: PouchAcceptanceDetails; index: number }) => {
    return (
      <TouchableHighlight
        {...touchProps}
        testID={`post-row-${index}`}
        onPress={() => handleClick(item)}
        style={[styles.boxView, styles.tableRow]}
      >
        <View style={styles.flexRow}>
          <View style={styles.width50}>
            <Text style={styles.primaryText}>{item.pouchID}</Text>
          </View>
          <View style={[styles.width50, styles.pouchType]}>
            <Text style={[styles.primaryText, styles.textAlignCenter, styles.pouchTypeValue]}>
              {item.pouchType}
            </Text>
          </View>
          <View style={styles.width50}>
            <Text style={[styles.primaryText, styles.textAlignRight]}>
              {priceToRender(Math.abs(item?.totalValue ?? 0))}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHeader = () => {
    return (
      <View style={[styles.tableRow, styles.boxView, styles.flexRow]}>
        <View style={styles.width50}>
          <Text style={styles.barcodeTxtText}>{stringConstants.Pouch.BarCode}</Text>
        </View>
        <View style={styles.width50}>
          <Text style={[styles.tableRowHeaderText, styles.textAlignCenter]}>Pouch Type</Text>
        </View>
        <View style={styles.width50}>
          <Text style={[styles.tableRowHeaderText, styles.textAlignRight]}>
            {stringConstants.Pouch.PouchValue}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}
      <FlatList
        testID="Body"
        data={availablePouches}
        renderItem={renderItem}
        keyExtractor={(item) => item.pouchID || item.pouchID || ""}
        extraData={selectedId}
      />
    </View>
  );
};

export default AvailablePouchList;
