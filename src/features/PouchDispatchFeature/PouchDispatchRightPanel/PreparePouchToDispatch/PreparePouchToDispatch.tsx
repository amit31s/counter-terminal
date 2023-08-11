import { CustomButton, getLoadingStatus, getPouchDispatchList, useAppSelector } from "@ct/common";
import { LoadingId } from "@ct/common/state/loadingStatus.slice";
import { COLOR_CONSTANTS, SCREENS, stringConstants } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { openBackOfficeForPreparePouchList } from "@ct/utils/Services/pouchDispatchService";
import { Center, Flex, Text } from "native-base";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const PreparePouchToDispatch = () => {
  const { availablePouchData } = useAppSelector(getPouchDispatchList);
  const loadingStatus = useAppSelector(getLoadingStatus);
  const navigate = useNavigate();
  const isLoadingAvailablePouch = useMemo(
    () => loadingStatus.some((element) => element.id === LoadingId.LOAD_POUCH_TO_DISPATCH),
    [loadingStatus],
  );

  const cancel = () => {
    navigate(SCREENS.HOME, { state: { from: SCREENS.POUCH_DESPATCH } });
  };

  if (isLoadingAvailablePouch) {
    return <></>;
  }

  return (
    <>
      {availablePouchData.length === 0 && (
        <Center flex={1}>
          <Flex direction="row" justifyContent={"center"}>
            <CustomButton
              w="176px"
              h="96px"
              mt="30px"
              onChange={cancel}
              testID={stringConstants.Button.Cancel_Button}
              buttonId={stringConstants.Button.Cancel_Button}
            >
              <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.white}>
                {stringConstants.Button.Cancel_Button}
              </Text>
            </CustomButton>
            <CustomButton
              w="289px"
              h="96px"
              mt="30px"
              marginLeft="30px"
              onChange={openBackOfficeForPreparePouchList}
              testID={stringConstants.Button.PreparePouches}
              buttonId={stringConstants.Button.PreparePouches}
            >
              <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.white}>
                {stringConstants.Button.PreparePouches}
              </Text>
            </CustomButton>
          </Flex>
        </Center>
      )}
    </>
  );
};
