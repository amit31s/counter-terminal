import { getFulfillmentError, useAppSelector } from "@ct/common";
import { TEXT } from "@ct/constants";
import { Text } from "native-base";

export const TransactionDeclinedMessage = () => {
  const { noticeId, noticeDescription } = useAppSelector(getFulfillmentError);
  return (
    <>
      <Text variant="medium-bold" textAlign="center">
        {noticeId ? `${noticeId} - ${TEXT.CTTXT00029}` : TEXT.CTTXT00029}
      </Text>
      <Text variant="small" color="black" pt="16px" textAlign="center">
        {noticeDescription}
      </Text>
    </>
  );
};
