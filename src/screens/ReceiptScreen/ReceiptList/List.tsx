import {
  PrintedReceipt,
  PrintedReceipts,
} from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import { colorConstants, stringConstants } from "@ct/constants";
import { appendPoundSymbolWithAmount, penceToPound } from "@ct/utils";
import moment from "moment";
import { Box, Pressable, Text } from "native-base";
import { RadioButton } from "postoffice-spm-components";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet } from "react-native";

const radioButtonStyle = StyleSheet.create({
  radioButtonStyle: {
    paddingLeft: 0,
  },
});

export type ListProps = {
  selectedReceipt: PrintedReceipt | null;
  setSelectedReceipt: Dispatch<SetStateAction<PrintedReceipt | null>>;
  receiptList: PrintedReceipts;
};

const List = ({ selectedReceipt, setSelectedReceipt, receiptList }: ListProps) => {
  return (
    <Box alignItems="stretch">
      <Box
        flexDir="row"
        h="56px"
        alignItems="stretch"
        bgColor={colorConstants.screenHeader}
        borderBottomColor="#D3D4D7"
        borderBottomWidth="1px"
        borderBottomStyle="solid"
      >
        <Box flex={1} px="20px" justifyContent="center">
          <Text variant="body-bold" color="white">
            {stringConstants.ReceiptList.Select}
          </Text>
        </Box>
        <Box flex={6} px="20px" justifyContent="center">
          <Text variant="body-bold" color="white">
            {stringConstants.ReceiptList.Time}
          </Text>
        </Box>
        <Box flex={3} px="20px" justifyContent="center">
          <Text variant="body-bold" color="white" textAlign="right">
            {stringConstants.ReceiptList.Total}
          </Text>
        </Box>
      </Box>
      {receiptList.map((receipt, i) => {
        const context = (typeof receipt.templateId === "string" ? receipt : receipt.templateId)
          ?.context;
        return (
          <Pressable
            key={receipt.id}
            flexDir="row"
            h="56px"
            alignItems="stretch"
            bgColor={
              receipt.id === selectedReceipt?.id
                ? colorConstants.receiptBackgroud
                : i % 2 > 0
                ? "#FAFBFB"
                : "white"
            }
            borderBottomColor="#D3D4D7"
            borderBottomWidth="1px"
            borderBottomStyle="solid"
            onPress={() => {
              setSelectedReceipt(receipt);
            }}
          >
            <Box flex={1} px="20px" justifyContent="center" overflow="hidden">
              <RadioButton
                checked={selectedReceipt?.id === receipt.id}
                onChange={() => {
                  setSelectedReceipt(receipt);
                }}
                accessibilityLabel={`Select receipt printed at ${moment
                  .unix(receipt.printTimestamp)
                  .format("HH:mm")}`}
                style={radioButtonStyle.radioButtonStyle}
              />
            </Box>
            <Box flex={6} px="20px" justifyContent="center">
              <Text variant="body">{moment.unix(receipt.printTimestamp).format("HH:mm")}</Text>
            </Box>
            <Box flex={3} px="20px" justifyContent="center">
              <Text variant="body" textAlign="right">
                {typeof context?.dueToPostOffice !== "number" ||
                typeof context?.dueToCustomer !== "number"
                  ? "–"
                  : appendPoundSymbolWithAmount(
                      penceToPound(context.dueToPostOffice - context.dueToCustomer),
                    )}
              </Text>
            </Box>
          </Pressable>
        );
      })}
    </Box>
  );
};

export default List;
