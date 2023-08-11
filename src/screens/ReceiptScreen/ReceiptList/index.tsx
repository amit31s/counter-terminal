import { useAppSelector } from "@ct/common";
import { getPrintedReceipts } from "@ct/common/selectors/ReceiptScreenSelector";
import { PrintedReceipt } from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import { colorConstants } from "@ct/constants";
import { clone } from "lodash";
import { Box, Text } from "native-base";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import List from "./List";
import Pagination from "./Pagination";

export type ReceiptListProps = {
  selectedReceipt: PrintedReceipt | null;
  setSelectedReceipt: Dispatch<SetStateAction<PrintedReceipt | null>>;
};

const ReceiptList = ({ selectedReceipt, setSelectedReceipt }: ReceiptListProps) => {
  const receipts = useAppSelector(getPrintedReceipts);

  const [page, setPage] = useState(0);

  const receiptList = useMemo(() => {
    const sorted = clone(receipts);
    sorted.sort((a, b) => b.printTimestamp - a.printTimestamp);
    return sorted.slice(page * 10, (page + 1) * 10);
  }, [page, receipts]);

  useEffect(() => {
    setSelectedReceipt(null);
  }, [receiptList, setSelectedReceipt]);

  return (
    <Box
      flex={1}
      bgColor="white"
      p="24px"
      shadow={4}
      alignItems="stretch"
      mr="48px"
      justifyContent="space-between"
    >
      {receiptList.length === 0 ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text variant="medium-bold" color={colorConstants.text.disabled}>
            No receipts available
          </Text>
        </Box>
      ) : (
        <>
          <List
            selectedReceipt={selectedReceipt}
            setSelectedReceipt={setSelectedReceipt}
            receiptList={receiptList}
          />
          <Pagination page={page} setPage={setPage} />
        </>
      )}
    </Box>
  );
};

export default ReceiptList;
