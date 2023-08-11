import { getNumpadFlag } from "@ct/common";
import { COLOR_CONSTANTS, stringConstants } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Text, View } from "native-base";
import { useSelector } from "react-redux";
import { StyledShoppingBasketIcon } from "@ct/assets/icons";

export const EmptyBasket = () => {
  const numpadFlag = useSelector(getNumpadFlag);
  return (
    <View
      testID="test-empty-basket"
      borderColor={COLOR_CONSTANTS.basketHeader}
      borderWidth={3}
      marginBottom={numpadFlag.flag ? "20px" : 0}
      alignItems={"center"}
      flex={1}
      justifyContent="center"
    >
      <View>
        <StyledShoppingBasketIcon />
      </View>
      <Text
        fontFamily={FontFamily.FONT_NUNITO_REGULAR}
        fontWeight={"light"}
        marginTop={numpadFlag.flag ? 5 : 9}
      >
        {stringConstants.emptyBasket}
      </Text>
    </View>
  );
};
