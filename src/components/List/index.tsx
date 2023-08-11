import { CashLocation } from "@ct/common/state/cashTransfer/cashTransfer.slice";
import { TEXT } from "@ct/constants";
import { useState } from "react";
import { FlatList, Text, TouchableHighlight, View } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import styles from "./styles";

export interface ListProps {
  list: CashLocation[];
  selectedLocationCallback: (item: CashLocation) => void;
}

export default function List({ list, selectedLocationCallback }: ListProps) {
  const listItem: CashLocation[] = list;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const touchProps = {
    activeOpacity: 1,
    underlayColor: colorConstants.disabledTextColour,
  };

  const handleClick = (item: CashLocation) => {
    if (!item?.accountingLocationID) {
      return;
    }
    setSelectedId(item?.accountingLocationID);
    selectedLocationCallback(item);
  };

  const renderItem = ({ item, index }: { item: CashLocation; index: number }) => {
    const selectedStyle = selectedId === item.accountingLocationID ? styles.buttonPressed : null;
    return (
      <TouchableHighlight
        testID={`post-row-${index}`}
        onPress={() => handleClick(item)}
        style={[styles.boxView, styles.tableRow, selectedStyle]}
        {...touchProps}
      >
        <View style={styles.flexRow}>
          <View style={styles.tableRowWidth1}>
            <Text style={styles.primaryText}>{item.accountingLocationName}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderHeader = () => {
    return (
      <View style={[styles.tableRow, styles.boxView, styles.flexRow]}>
        <View style={styles.tableRowWidth1}>
          <Text style={styles.tableRowHeaderText}>{TEXT.CTTXT00065}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}
      <FlatList
        style={styles.listHeight}
        testID="Body"
        data={listItem}
        renderItem={renderItem}
        keyExtractor={(item) => item.accountingLocationID ?? "undefined"}
        extraData={selectedId}
      />
    </View>
  );
}
