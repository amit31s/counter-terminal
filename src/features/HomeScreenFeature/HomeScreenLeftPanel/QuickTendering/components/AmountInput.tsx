import { CurrencyInput, getBasket, useAppSelector } from "@ct/common";
import { TEXT, colorConstants, stringConstants } from "@ct/constants";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { InputGroup, Text, View } from "native-base";
import { Dispatch, ReactElement, SetStateAction, useCallback } from "react";
import { InitialInvalidInputStates } from "..";

export type AmountInputProps = {
  isInvalidCardInput: boolean;
  setIsInvalidCardInput: Dispatch<SetStateAction<boolean>>;
  inputAmount: number;
  setInputAmount: Dispatch<SetStateAction<number>>;
  amount: number;
  isInvalidChequeAmount: boolean;
  setInvalidChequeAmount: Dispatch<SetStateAction<boolean>>;
  isInvalidInput: InitialInvalidInputStates;
  setInvalidInput: React.Dispatch<React.SetStateAction<InitialInvalidInputStates>>;
};

export function AmountInput({
  isInvalidCardInput,
  setIsInvalidCardInput,
  inputAmount,
  setInputAmount,
  amount,
  isInvalidChequeAmount,
  setInvalidChequeAmount,
  isInvalidInput,
  setInvalidInput,
}: AmountInputProps): ReactElement {
  const { postOfficeTenderingAmount, basketValue } = useAppSelector(getBasket);

  const amountInputChangeCallback = useCallback(
    (amountIn: number) => {
      if (
        (isInvalidCardInput && amount <= basketValue) ||
        (isInvalidCardInput && amount <= postOfficeTenderingAmount)
      ) {
        setIsInvalidCardInput(false);
        setInvalidChequeAmount(false);
        setInvalidInput({
          invalidIRC: false,
        });
      }
      setInputAmount(amountIn);
    },
    [
      isInvalidCardInput,
      amount,
      basketValue,
      postOfficeTenderingAmount,
      setInputAmount,
      setIsInvalidCardInput,
      setInvalidChequeAmount,
      setInvalidInput,
    ],
  );

  return (
    <>
      <Text variant="medium-bold" mt="40px">
        Amount
      </Text>
      {(isInvalidCardInput || isInvalidChequeAmount || isInvalidInput.invalidIRC) && (
        <Text
          variant="body"
          _light={{ color: colorConstants.alertBorder }}
          _dark={{ color: colorConstants.alertBorder }}
          mt="13px"
          mb="10px"
        >
          {isInvalidCardInput &&
            stringConstants.transactionalMessages.cardLimitMessage(
              appendPoundSymbolWithAmount(basketValue),
            )}
          {isInvalidChequeAmount && TEXT.CTTXT00072(appendPoundSymbolWithAmount(basketValue))}
          {isInvalidInput.invalidIRC && TEXT.CTTXT00082(appendPoundSymbolWithAmount(basketValue))}
        </Text>
      )}

      <View
        mt={isInvalidCardInput || isInvalidChequeAmount || isInvalidInput.invalidIRC ? 0 : "20px"}
        testID="CurrencyInputContainer"
      >
        <View testID={stringConstants.RefundScreen.AmountInputTestId}>
          <InputGroup h={"20"} w={"xl"}>
            <CurrencyInput value={inputAmount} onChangeText={amountInputChangeCallback} />
          </InputGroup>
        </View>
      </View>
    </>
  );
}
