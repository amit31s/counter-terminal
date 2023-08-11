import { EntryResponseFulfilmentType } from "@ct/api/generator";
import { getBasket, useAppSelector } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { CustomModal } from "@ct/components";
import { TEXT, colorConstants, stringConstants } from "@ct/constants";
import { IbasketItem, Tokens } from "@ct/interfaces/basket.interface";
import {
  appendPoundSymbolWithAmount,
  getItem,
  removeItem,
  useGetCommitFulfillClient,
} from "@ct/utils";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { Box, FlatList, Flex, Text, View } from "native-base";
import { FulfilmentStateEnum } from "postoffice-commit-and-fulfill";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { decideMessage, getItemTotal, getTransactionStatusText } from "../../homeScreen.helper";

const buttonStyles = StyleSheet.create({
  base: {
    marginHorizontal: "auto",
  },
});

const tokens: Tokens = {
  PED: {
    transactionResultCode: "07",
    responseCode: "40",
  },
  Remote: {},
  None: {},
  label: {},
};

export const TxRecoveryModalContent = () => {
  const { basketItems, basketId } = useAppSelector(getBasket);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [nbitBasketItems, setNbitBasketItems] = useState<IbasketItem[]>([]);
  const [_recoveredItemCount, setRecoveredItemCount] = useState(0);
  const client = useGetCommitFulfillClient();
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);
  const { changeValueToZero } = useBasket();

  const handleConfirmClick = useCallback(async () => {
    try {
      setIsDisable(true);
      const cnf = await client;
      const copy = [...nbitBasketItems];
      const shiftedItem = copy.shift();
      const entryID = shiftedItem?.journeyData?.transaction?.entryID;
      const entryType = shiftedItem?.journeyData?.transaction?.entryType;
      const fulfilmentSettled = ["banking"].includes(entryType)
        ? FulfilmentStateEnum.Indeterminate
        : FulfilmentStateEnum.Failure;
      const fulfilmentType = shiftedItem?.journeyData?.transaction?.tokens
        ?.fulfilmentType as EntryResponseFulfilmentType;
      setNbitBasketItems(copy);
      setRecoveredItemCount((v) => {
        const count = v + 1;
        if (count >= basketItems.length) {
          removeItem(STORAGE_KEYS.CTSTK0002);
        }
        return count;
      });

      if (cnf && entryID && shiftedItem.fulFillmentStatus === FulfilmentStateEnum.Pending) {
        await cnf.setFulfilmentStatus(
          basketId,
          "" + entryID,
          fulfilmentSettled,
          tokens[fulfilmentType],
        );
        /* changing the value to zero for indeterminate items */
        changeValueToZero(entryID);
      }
    } catch (error) {
      appLogger.error({
        methodName: "handleConfirmClick",
        error: error as Error,
      });
    } finally {
      setIsDisable(false);
    }
  }, [appLogger, basketId, basketItems, changeValueToZero, client, nbitBasketItems]);

  useEffect(() => {
    const confirmNbitBasketItems = getItem(STORAGE_KEYS.CTSTK0002);
    if (nbitBasketItems.length > 0 && confirmNbitBasketItems === "n") {
      setIsModalOpen(true);
      return;
    }
    setIsModalOpen(false);
  }, [nbitBasketItems]);

  useEffect(() => {
    if (!nbitBasketItems.length) {
      const nbitItems = basketItems.filter((item) => item.source === "nbit");
      setNbitBasketItems(nbitItems);
    }
  }, [basketItems, nbitBasketItems.length]);

  if (!nbitBasketItems.length) {
    return <></>;
  }

  return (
    <CustomModal
      testID="txRecoveryModel"
      isOpen={isModalOpen}
      content={
        <View>
          <Text
            variant="large"
            paddingBottom="5"
            textAlign="center"
            color={colorConstants.mainTextColour}
          >
            {TEXT.CTTXT00035}
          </Text>
          <View
            justifyContent="center"
            flex="1"
            borderBottomColor={colorConstants.transactionRecoveryItemBorderColor}
          >
            <FlatList
              testID="Body"
              ListHeaderComponent={
                <Flex
                  height={60}
                  direction="row"
                  bg={colorConstants.primaryBlueTextColor}
                  alignItems={"center"}
                >
                  <Box flexBasis={"200%"} flexShrink={1} flexGrow={1}>
                    <Text px={5} variant="medium-bold" color={colorConstants.white}>
                      Product
                    </Text>
                  </Box>

                  <Box flexBasis={"100%"} flexShrink={1} flexGrow={1}>
                    <Text px={5} variant="medium-bold" color={colorConstants.white}>
                      Status
                    </Text>
                  </Box>

                  <Box flexBasis={"100%"} flexShrink={1} flexGrow={1} alignItems={"end"}>
                    <Text mr={5} variant="medium-bold" color={colorConstants.white}>
                      Value
                    </Text>
                  </Box>
                </Flex>
              }
              data={[nbitBasketItems[0]]}
              renderItem={({ item }) => (
                <Flex
                  direction="row"
                  borderBottomWidth="1"
                  borderColor={colorConstants.transactionRecoveryItemBorderColor}
                  height="82px"
                >
                  <Box
                    flexBasis={"200%"}
                    py={1.5}
                    my={0.5}
                    flexShrink={1}
                    flexGrow={1}
                    justifyContent="center"
                  >
                    <Text px={5} variant="body" fontSize="24px" lineHeight="34px">
                      {item.name}
                    </Text>
                  </Box>
                  <Box
                    flexBasis={"100%"}
                    py={1.5}
                    my={0.5}
                    flexShrink={1}
                    flexGrow={1}
                    justifyContent="center"
                  >
                    <Text px={5} variant="body" fontSize="24px" lineHeight="34px">
                      {getTransactionStatusText(nbitBasketItems[0].fulFillmentStatus)}
                    </Text>
                  </Box>
                  <Box
                    flexBasis={"100%"}
                    py={1.5}
                    my={0.5}
                    flexShrink={1}
                    flexGrow={1}
                    alignItems={"end"}
                    justifyContent="center"
                  >
                    <Text variant="body" mr={5} fontSize="24px" lineHeight="34px">
                      {appendPoundSymbolWithAmount(getItemTotal(item))}
                    </Text>
                  </Box>
                </Flex>
              )}
              keyExtractor={(_, index: number) => index.toString()}
            />
          </View>
          <Text
            paddingTop="10px"
            lineHeight="33px"
            textAlign="center"
            color={colorConstants.secondaryTextColour}
          >
            {decideMessage(nbitBasketItems)}
          </Text>
        </View>
      }
      width="100%"
      primaryButtonProps={{
        isDisabled: isDisable,
        label: stringConstants.Button.Confirm,
        onPress: handleConfirmClick,
        styles: buttonStyles.base,
        testID: "txRecoveryModelConfirm",
      }}
      contentSize="large"
    />
  );
};
