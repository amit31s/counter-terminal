import { appendPoundSymbolWithAmount } from "@ct/utils";
import { Text } from "native-base";

export const TransactionRefundMessage = ({ price }: { price: number }) => {
  return (
    <>
      <Text mt={5} textAlign={"center"} fontSize={18}>
        Unable to complete transaction.
      </Text>
      {/* Rule disabled as text is not actually raw, appears to be an ESLint error. */}
      <Text mt={5} textAlign={"center"} fontSize={18}>
        Please refund
        {/* Rule disabled as text is not actually raw, appears to be an ESLint error. */}
        <Text bold> {appendPoundSymbolWithAmount(price)}</Text> to the customer.
      </Text>
    </>
  );
};
