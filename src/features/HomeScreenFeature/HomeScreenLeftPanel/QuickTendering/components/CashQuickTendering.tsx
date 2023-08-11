import { getBasket, getPaymentStatus, useAppSelector } from "@ct/common";
import { StyledButton } from "@ct/components";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { Flex, Text } from "native-base";
import { ReactElement, useCallback } from "react";
import { buttonStyles } from "./buttonStyles";

type CashButtonProps = {
  id: number;
  amount: number;
  isDisabled: boolean;
  handleDispatchAfterCashClick: (
    cashPayment: number,
    amount: number,
    deductAmount: boolean,
  ) => void;
};

function CashButton({
  id,
  amount,
  isDisabled,
  handleDispatchAfterCashClick,
}: CashButtonProps): ReactElement {
  const { paidByCash } = useAppSelector(getPaymentStatus);
  const handlePress = useCallback(() => {
    if (id === 0) {
      handleDispatchAfterCashClick(Math.abs(paidByCash), amount, true);
      return;
    }
    handleDispatchAfterCashClick(Math.abs(paidByCash), amount, false);
  }, [amount, handleDispatchAfterCashClick, id, paidByCash]);

  return (
    <StyledButton
      onPress={handlePress}
      testID={`QuickTenderingBtn${id}`}
      type="quaternary"
      label={appendPoundSymbolWithAmount(amount)}
      isDisabled={isDisabled}
      styles={id === 0 ? buttonStyles.startButton : buttonStyles.baseButtonStyle}
    />
  );
}

export type CashQuickTenderingProps = {
  areButtonsDisabled: boolean;
  handleDispatchAfterCashClick: (
    cashPayment: number,
    amount: number,
    deductAmount: boolean,
  ) => void;
};

const buttons = [
  { id: 1, amount: 5 },
  { id: 2, amount: 10 },
  { id: 3, amount: 20 },
];

export function CashQuickTendering({
  areButtonsDisabled,
  handleDispatchAfterCashClick,
}: CashQuickTenderingProps): ReactElement {
  const { basketValue } = useAppSelector(getBasket);

  return (
    <>
      <Text variant="medium-bold">Cash Quick Tendering</Text>
      <Flex flexDirection="row" mt="20px">
        <CashButton
          id={0}
          amount={Math.abs(basketValue)}
          isDisabled={areButtonsDisabled}
          handleDispatchAfterCashClick={handleDispatchAfterCashClick}
        />
        {buttons.map(({ id, amount }) => (
          <CashButton
            key={id}
            id={id}
            amount={amount}
            isDisabled={areButtonsDisabled}
            handleDispatchAfterCashClick={handleDispatchAfterCashClick}
          />
        ))}
      </Flex>
    </>
  );
}
