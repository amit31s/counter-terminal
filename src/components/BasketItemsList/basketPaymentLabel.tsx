import { MaterialSymbol } from "@ct/assets/icons";
import { getBasket, getPaymentStatus, useAppSelector } from "@ct/common";
import { colorConstants, TEXT } from "@ct/constants";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { Text, View } from "react-native";
import styles from "./styles";

export const BasketPaymentLabel = () => {
  const { completed } = useAppSelector(getPaymentStatus);
  const { basketValue } = useAppSelector(getBasket);
  const payLabel = {
    basketLabel: "",
    textStyle: {},
    headerStyle: {},
    iconName: "",
    iconColor: "",
  };

  if (completed) {
    return <></>;
  }

  if (basketValue >= 0) {
    payLabel.basketLabel = TEXT.CTTXT00018;
    payLabel.textStyle = styles.customerToPayText;
    payLabel.headerStyle = styles.customerToPayHeader;
    payLabel.iconName = "call_received";
    payLabel.iconColor = colorConstants.white;
  } else if (basketValue <= 0) {
    payLabel.basketLabel = TEXT.CTTXT00019;
    payLabel.textStyle = styles.payToCustomerText;
    payLabel.headerStyle = styles.payToCustomerHeader;
    payLabel.iconName = "arrow_outward";
    payLabel.iconColor = colorConstants.text.black;
  }

  return (
    <View style={payLabel.headerStyle} testID={"BasketPaymentLabel"}>
      <Text style={payLabel.textStyle}>{payLabel.basketLabel}</Text>
      <MaterialSymbol name={payLabel.iconName} color={payLabel.iconColor} />
      <Text style={[payLabel.textStyle, styles.toPayTotal]}>
        {appendPoundSymbolWithAmount(Math.abs(basketValue))}
      </Text>
    </View>
  );
};
