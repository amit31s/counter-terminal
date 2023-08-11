import { PouchAcceptanceDetails } from "@ct/api/generator";
import { StyledDeleteIcon } from "@ct/assets/icons";
import { priceToRender } from "@ct/utils";
import { FlatList, Pressable, Text, View } from "react-native";
import stringConstants from "../../constants/StringsConstants";
import styles from "./style";

interface CustomPouchAcceptanceListComponentProps {
  parentdata: PouchAcceptanceDetails[];
  showDelete?: boolean;
  onDeleteItem?: (barcode: string) => void;
}

interface ItemViewProps {
  index: number;
  item: PouchAcceptanceDetails;
}

const ListHeader = ({ showDelete }: { showDelete: boolean }) => {
  return (
    <View style={[styles.textContainer, styles.headerFooterStyle, styles.border]}>
      <Text style={[styles.primaryText, styles.textStyle, styles.textAlignLeft]}>
        {stringConstants.Pouch.BarCode}
      </Text>
      {showDelete ? (
        <Text style={[styles.primaryText, styles.textStyle, styles.textAlignLeft]}>
          {stringConstants.Pouch.PouchType}
        </Text>
      ) : (
        <Text style={[styles.primaryText, styles.textStyle]}>
          {stringConstants.Pouch.PouchType}
        </Text>
      )}
      <Text style={[styles.primaryText, styles.textStyle, styles.pouchValue]}>
        {stringConstants.Pouch.PouchValue}
      </Text>
      {showDelete ? (
        <Text style={[styles.primaryText, styles.textStyle]}>{stringConstants.Pouch.Branch}</Text>
      ) : null}
      {showDelete ? <Text style={[styles.primaryText, styles.actionStyle]}>{""}</Text> : null}
    </View>
  );
};

const EmptyListMessage = () => <Text style={styles.emptyListStyle}>No Data Found</Text>;

const CustomPouchAcceptanceListComponent = ({
  parentdata,
  onDeleteItem,
  showDelete = true,
}: CustomPouchAcceptanceListComponentProps) => {
  const itemView = ({ item, index }: ItemViewProps) => {
    return (
      <View style={[styles.textContainer, styles.border]} testID={`pouch-row-${index}`}>
        <Text style={[styles.primaryText, styles.itemStyle, styles.textAlignLeft]}>
          {item.pouchID}
        </Text>
        <Text style={[styles.primaryText, styles.itemStyle, styles.pouchTypeValue]}>
          {item.pouchType}
        </Text>
        <Text style={[styles.primaryText, styles.itemStyle, styles.pouchValue]}>
          {priceToRender(Math.abs(item?.totalValue ?? 0))}
        </Text>

        {showDelete ? (
          <>
            <Text style={[styles.primaryText, styles.itemStyle]}>{item.assignedBranchName}</Text>
            <Pressable
              onPress={() => {
                if (onDeleteItem && item.pouchID) {
                  onDeleteItem(item.pouchID);
                }
              }}
              style={styles.actionStyle}
            >
              <StyledDeleteIcon />
            </Pressable>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <FlatList
      testID="testFlatList"
      contentContainerStyle={styles.contentContainerStyle}
      data={parentdata}
      keyExtractor={(item: PouchAcceptanceDetails, index: number) =>
        item.pouchID || index.toString()
      }
      ListHeaderComponent={<ListHeader showDelete={showDelete} />}
      renderItem={itemView}
      ListEmptyComponent={EmptyListMessage}
      stickyHeaderIndices={[0]}
    />
  );
};

export default CustomPouchAcceptanceListComponent;
