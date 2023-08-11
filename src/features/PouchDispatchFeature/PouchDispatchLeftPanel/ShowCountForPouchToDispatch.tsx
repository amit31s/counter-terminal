import { getLoadingStatus, getPouchDispatchList, useAppSelector } from "@ct/common";
import { LoadingId } from "@ct/common/state/loadingStatus.slice";
import { TEXT } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";
import { useMemo } from "react";

export const Message = () => {
  const { availablePouchData } = useAppSelector(getPouchDispatchList);
  const textContent = !availablePouchData.length
    ? TEXT.CTTXT00071
    : TEXT.CTTXT00069(availablePouchData.length);
  return (
    <Text fontSize={28} textAlign={"center"} fontFamily={FontFamily.FONT_NUNITO_BOLD} width="766px">
      {textContent}
    </Text>
  );
};

export const ShowCountForPouchToDispatch = () => {
  const loadingStatus = useAppSelector(getLoadingStatus);
  const isLoadingAvailablePouch = useMemo(
    () => loadingStatus.some((element) => element.id === LoadingId.LOAD_POUCH_TO_DISPATCH),
    [loadingStatus],
  );

  if (isLoadingAvailablePouch) {
    return <></>;
  }

  return (
    <Center flex={1} testID={"show-count-for-dispatch"}>
      <Message />
    </Center>
  );
};
