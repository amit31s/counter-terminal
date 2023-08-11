import {
  CurrencyInput,
  CustomButton,
  getPouchAcceptanceList,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { setValidatedData, setZerovaluePouch } from "@ct/common/state/pouchAcceptance";
import { COLOR_CONSTANTS, stringConstants } from "@ct/constants";
import { poundToPence } from "@ct/utils";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { cloneDeep } from "lodash";
import { Center, Flex, Text, View } from "native-base";
import { useState } from "react";
import { useGetPouchForAcceptance } from "../useGetPouchForAcceptance";

export const ZeroValuePouch = () => {
  const { data } = useAppSelector(getPouchAcceptanceList);
  const { validatedData } = useGetPouchForAcceptance();

  const [pouchValue, setPouchValue] = useState(0);
  const dispatch = useAppDispatch();

  const isDisabled = pouchValue === 0;

  const updatePouchValue = () => {
    if (!data) {
      return;
    }
    const clonedData = cloneDeep(data);
    clonedData.totalValue = poundToPence(pouchValue);
    dispatch(setValidatedData([...validatedData, clonedData]));
    dispatch(setZerovaluePouch(null));
  };

  return (
    <Center height={846}>
      <Text
        fontFamily={FontFamily.FONT_NUNITO_BOLD}
        testID="ValueAcceptanceHeaderText"
        fontSize={24}
        textAlign={"center"}
      >
        {stringConstants.Pouch.NoAssociationWithPouch}
      </Text>
      <View height={9} marginTop={25}>
        <CurrencyInput value={pouchValue} onChangeText={(val) => setPouchValue(val)} />
      </View>
      <Flex direction="row" top={20}>
        <CustomButton
          w="176px"
          h="96px"
          mt="30px"
          onChange={() => dispatch(setZerovaluePouch(null))}
          testID={stringConstants.Button.Cancel_Button}
          buttonId={stringConstants.Button.Cancel_Button}
          bg={COLOR_CONSTANTS.buttonColors.white}
          borderColor={COLOR_CONSTANTS.cancelBtnBorderColor}
          borderWidth={1}
        >
          <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.black}>
            {stringConstants.Button.Cancel_Button}
          </Text>
        </CustomButton>
        <CustomButton
          isDisabled={isDisabled}
          w="176px"
          h="96px"
          mt="30px"
          marginLeft="30px"
          onChange={() => updatePouchValue()}
          testID={stringConstants.Button.CashDrawer_Proceed}
          buttonId={stringConstants.Button.CashDrawer_Proceed}
        >
          <Text
            fontFamily={FontFamily.FONT_NUNITO_BOLD}
            color={isDisabled ? COLOR_CONSTANTS.disabledTextColour : COLOR_CONSTANTS.white}
          >
            {stringConstants.Button.CashDrawer_Proceed}
          </Text>
        </CustomButton>
      </Flex>
    </Center>
  );
};
