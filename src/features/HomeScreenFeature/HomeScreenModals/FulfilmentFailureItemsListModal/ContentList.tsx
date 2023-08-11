import { TEXT } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { Box, FlatList, Flex, ScrollView, Text } from "native-base";
import { ContentListHeader } from "./ContentListHeader";
import { TransactionRefundMessage } from "./TransactionRefundMessage";

interface ContentListProps {
  data: IbasketItem[];
  price: number;
}

export const ContentList = ({ data, price }: ContentListProps) => {
  return (
    <>
      <Text variant="large" textAlign="center" mb="16px">
        {TEXT.CTTXT0001}
      </Text>
      <ScrollView maxHeight={"30vh"}>
        <FlatList
          ListHeaderComponent={<ContentListHeader />}
          data={data}
          renderItem={({ item: basketItem }) => (
            <Flex direction="row" borderBottomWidth="1" borderColor="coolGray.200">
              <Box
                flexBasis={"200%"}
                py={1.5}
                my={0.5}
                flexShrink={1}
                flexGrow={1}
                justifyContent="center"
              >
                <Text px={5} variant="body">
                  {basketItem.name}
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
                <Text px={5} variant="body">
                  Failed
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
                <Text variant="body" mr={5}>
                  {appendPoundSymbolWithAmount(basketItem.price)}
                </Text>
              </Box>
            </Flex>
          )}
          keyExtractor={({ id }) => id}
        />
      </ScrollView>
      <TransactionRefundMessage price={price} />
    </>
  );
};
