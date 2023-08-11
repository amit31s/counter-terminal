import { StyledChevronLeftOutlinedIcon, StyledChevronRightOutlinedIcon } from "@ct/assets/icons";
import { useAppSelector } from "@ct/common";
import { getPrintedReceipts } from "@ct/common/selectors/ReceiptScreenSelector";
import { COLOR_CONSTANTS } from "@ct/constants";
import { Box, Pressable, Text } from "native-base";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type PaginationProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const Pagination = ({ page, setPage }: PaginationProps) => {
  const receipts = useAppSelector(getPrintedReceipts);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount((previousPageCount) => {
      const newPageCount = Math.max(1, Math.ceil(receipts.length / 10));
      if (newPageCount !== previousPageCount) {
        setPage(0);
      }
      return newPageCount;
    });
  }, [receipts, setPage]);

  return (
    <Box h="56px" flexDir="row" alignItems="stretch" justifyContent="center">
      <Pressable
        flexDir="row"
        mr="40px"
        w="140px"
        justifyContent="end"
        alignItems="center"
        isDisabled={page <= 0}
        _pressed={{ opacity: 0.5 }}
        _disabled={{ opacity: 0.25 }}
        onPress={() => setPage((currentPage) => currentPage - 1)}
        accessibilityLabel="Previous"
      >
        <Box w="24px" h="24px">
          <StyledChevronLeftOutlinedIcon style={{ color: COLOR_CONSTANTS.primaryBlueTextColor }} />
        </Box>
        <Text variant="small" color={COLOR_CONSTANTS.primaryBlueTextColor}>
          Previous
        </Text>
      </Pressable>
      {Array(pageCount)
        .fill(0)
        .map((_, i) => (
          <Pressable
            key={i}
            mr="10px"
            w="56px"
            justifyContent="center"
            alignItems="center"
            _pressed={{ opacity: 0.5 }}
            borderWidth={i === page ? "1px" : 0}
            borderStyle="solid"
            borderColor="#D3D4D7"
            borderRadius="4px"
            onPress={() => setPage(i)}
            accessibilityLabel={(i + 1).toString()}
          >
            <Text variant="body-bold" color={COLOR_CONSTANTS.primaryBlueTextColor}>
              {i + 1}
            </Text>
          </Pressable>
        ))}
      <Pressable
        flexDir="row"
        ml="30px"
        w="140px"
        justifyContent="start"
        alignItems="center"
        isDisabled={page >= pageCount - 1}
        _pressed={{ opacity: 0.5 }}
        _disabled={{ opacity: 0.25 }}
        onPress={() => setPage((currentPage) => currentPage + 1)}
        accessibilityLabel="Next"
      >
        <Text variant="small" color={COLOR_CONSTANTS.primaryBlueTextColor}>
          Next
        </Text>
        <Box w="24px" h="24px">
          <StyledChevronRightOutlinedIcon style={{ color: COLOR_CONSTANTS.primaryBlueTextColor }} />
        </Box>
      </Pressable>
    </Box>
  );
};

export default Pagination;
