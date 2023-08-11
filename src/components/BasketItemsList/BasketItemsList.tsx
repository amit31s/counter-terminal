import { getUpDownArrow, useAppDispatch } from "@ct/common";
import { updateUpDownArrow } from "@ct/common/state/HomeScreen/UpdateUpDownArrow";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { last } from "lodash";
import { View } from "native-base";
import { memo, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Text, TouchableHighlight } from "react-native";
import { useSelector } from "react-redux";
import colorConstants from "../../constants/ColorConstants";
import stringConstants from "../../constants/StringsConstants";
import { IbasketItem } from "../../interfaces/basket.interface";
import { BasketPaymentLabel } from "./basketPaymentLabel";
import { EmptyBasket } from "./EmptyBasket";
import styles from "./styles";

export interface BasketItemsListProps {
  dataList: IbasketItem[];
  updateSelectedBasketItem?: (item: IbasketItem) => void;
  selectedItem?: IbasketItem;
}

const BasketItemsList = memo((props: BasketItemsListProps): ReactElement => {
  const { updateSelectedBasketItem, selectedItem, dataList: basketList } = props;
  const dispatch = useAppDispatch();
  const upDownArrow = useSelector(getUpDownArrow);
  const flatList = useRef<FlatList>(null);
  const downClicked = upDownArrow.downClicked;
  const upClicked = upDownArrow.upClicked;

  const dataList = useMemo(() => basketList.filter((item) => !item.doNotShow), [basketList]);

  const selectedItemIndex = useMemo(
    () => dataList.findIndex((item) => item.id === selectedItem?.id),
    [dataList, selectedItem?.id],
  );

  const getItemByIndex = useCallback(
    (index: number) => dataList[index] as IbasketItem | undefined,
    [dataList],
  );

  const lastItem = last(dataList);
  const dataListLength = dataList.length;
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const disableUpClick = dataList.length === 0 || selectedItemIndex === 0;
    const disableDownClick = dataList.length === 0 || selectedItemIndex === dataListLength - 1;
    dispatch(
      updateUpDownArrow({
        disableUpClick: disableUpClick,
        disableDownClick: disableDownClick,
      }),
    );
  }, [dataList.length, dataListLength, dispatch, selectedItemIndex]);

  const highlightSelectedItem = useCallback(
    (item: IbasketItem) => {
      if (item.id !== undefined && props.updateSelectedBasketItem) {
        props.updateSelectedBasketItem(item);
      }
    },
    [props],
  );

  const handleSelection = useCallback(
    (item: IbasketItem) => {
      if (item && item?.type !== "paymentMode") {
        highlightSelectedItem(item);
      }
    },
    [highlightSelectedItem],
  );

  let scrollRef: FlatList<IbasketItem> | null = null;

  useEffect(() => {
    if (!selectedItem || !scrollRef) {
      return;
    }

    scrollRef.scrollToItem({ item: selectedItem });
  }, [scrollRef, selectedItem]);

  const upArrowClicked = useCallback(() => {
    const upArrowClickedIndex = selectedItemIndex - 1;
    if (upArrowClickedIndex >= 0) {
      const item = getItemByIndex(upArrowClickedIndex);
      if (item) {
        updateSelectedBasketItem?.(item);
      }
    }
  }, [getItemByIndex, selectedItemIndex, updateSelectedBasketItem]);

  const downArrowClicked = useCallback(() => {
    const downArrowClickedIndex = selectedItemIndex + 1;
    if (downArrowClickedIndex < dataListLength) {
      const item = getItemByIndex(downArrowClickedIndex);
      if (item) {
        updateSelectedBasketItem?.(item);
      }
    }
  }, [dataListLength, getItemByIndex, selectedItemIndex, updateSelectedBasketItem]);

  const touchProps = {
    activeOpacity: 1,
    underlayColor: colorConstants.white,
  };

  const renderItem = ({ item, index }: { item: IbasketItem; index: number }) => {
    if (item.type === "paymentMode" && item.total === 0) {
      return null;
    }
    let additionalItemsTotal = 0;
    for (const additionalItem of item.journeyData?.transaction?.additionalItems ?? []) {
      additionalItemsTotal += additionalItem.valueInPence / 100;
    }
    const total = item.total + additionalItemsTotal;
    const price = item.price + additionalItemsTotal;
    return (
      <View testID="renderItemTest" style={styles.itemWrapper}>
        <TouchableHighlight {...touchProps} onPress={() => handleSelection(item)}>
          <View
            testID="testSelectedItem"
            style={[
              styles.itemsRow,
              selectedItemIndex === index ? styles.selected : styles.notSelected,
            ]}
          >
            <View style={styles.itemName}>
              <Text style={styles.tableText}>{item.name}</Text>
            </View>
            <View style={styles.price}>
              <Text testID="basketItemPrice" style={styles.tableText}>
                {typeof item.price === "number" ? appendPoundSymbolWithAmount(price) : ""}
              </Text>
            </View>
            <View style={styles.quantity}>
              <Text testID="basketItemQuantity" style={styles.tableText}>
                {item.quantity || ""}
              </Text>
            </View>
            <View style={styles.itemTotal}>
              <Text testID="basketItemTotal" style={styles.totalItemText}>
                {appendPoundSymbolWithAmount(total)}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  useEffect(() => {
    if (downClicked) {
      downArrowClicked();
      dispatch(
        updateUpDownArrow({
          downClicked: false,
        }),
      );
    }
    if (upClicked) {
      upArrowClicked();
      dispatch(
        updateUpDownArrow({
          upClicked: false,
        }),
      );
    }
  }, [dispatch, downArrowClicked, downClicked, upArrowClicked, upClicked]);

  useEffect(() => {
    const handleArrowKey = function (event: { key: string }) {
      switch (event.key) {
        case "ArrowUp":
          dispatch(
            updateUpDownArrow({
              upClicked: true,
              downClicked: false,
            }),
          );
          break;
        case "ArrowDown":
          dispatch(
            updateUpDownArrow({
              upClicked: false,
              downClicked: true,
            }),
          );
          break;
      }
    };
    document.addEventListener("keydown", handleArrowKey);
    return () => document.removeEventListener("keydown", handleArrowKey);
  }, [dispatch]);

  return (
    <View flex={1} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
      {dataList.length === 0 ? (
        <EmptyBasket />
      ) : (
        <View maxHeight={`${listHeight}px`} flex={1}>
          <View style={styles.tableHeader}>
            <View style={styles.itemName}>
              <Text style={styles.tableHeaderText}>{stringConstants.ItemList.Title}</Text>
            </View>
            <View style={styles.price}>
              <Text style={styles.tableHeaderText}>{stringConstants.ItemList.Price}</Text>
            </View>
            <View style={styles.quantity}>
              <Text style={styles.tableHeaderText}>{stringConstants.ItemList.Qty}</Text>
            </View>
            <View style={styles.total}>
              <Text style={styles.tableHeaderText}>{stringConstants.ItemList.Total}</Text>
            </View>
          </View>
          <FlatList
            onEndReachedThreshold={0.5}
            persistentScrollbar={true}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            testID="Body"
            ref={(ref) => (scrollRef = ref)}
            data={dataList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onContentSizeChange={() => {
              scrollRef?.scrollToEnd({ animated: true });
              if (lastItem) {
                handleSelection(lastItem);
              }
            }}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                flatList.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
          <View testID="basketTest" style={styles.toPay}>
            <BasketPaymentLabel />
          </View>
        </View>
      )}
    </View>
  );
});

BasketItemsList.displayName = "BasketItemsList";

export default BasketItemsList;
