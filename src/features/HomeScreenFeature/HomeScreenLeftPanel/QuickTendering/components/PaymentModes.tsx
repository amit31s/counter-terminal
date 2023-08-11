import {
  getBasket,
  getPaymentStatus,
  getProductByProdNo,
  ircItemID,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { StyledButton } from "@ct/components";
import { BUTTON, TEXT } from "@ct/constants";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { Flex, Text } from "native-base";
import { Dispatch, ReactElement, SetStateAction, useCallback } from "react";
import { InitialInvalidInputStates } from "..";
import { buttonStyles } from "./buttonStyles";

export type PaymentModesProps = {
  areButtonsDisabled: boolean;
  inputAmount: number;
  amount: number;
  cardClicked: () => void;
  setInvalidInputForCard: Dispatch<SetStateAction<boolean>>;
  setInputAmount: Dispatch<SetStateAction<number>>;
  handleDispatchAfterCashClick: (
    cashPayment: number,
    amount: number,
    deductAmount?: boolean,
  ) => void;
  handleDispatchAfterChequeClick: (amount: number, deductAmount?: boolean) => void;
  handleDispatchAfterIRCClick: (amount: number, name: string) => void;
  setWillPerformAfterPaymentCommit: Dispatch<SetStateAction<boolean>>;
  setInvalidChequeAmount: Dispatch<SetStateAction<boolean>>;
  setInvalidInput: React.Dispatch<React.SetStateAction<InitialInvalidInputStates>>;
};

export function PaymentModes({
  amount,
  areButtonsDisabled,
  inputAmount,
  cardClicked,
  handleDispatchAfterCashClick,
  handleDispatchAfterChequeClick,
  handleDispatchAfterIRCClick,
  setInputAmount,
  setInvalidChequeAmount,
  setInvalidInputForCard,
  setWillPerformAfterPaymentCommit,
  setInvalidInput,
}: PaymentModesProps): ReactElement {
  const { paidByCash } = useAppSelector(getPaymentStatus);
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const dispatch = useAppDispatch();

  const isCashOnly = basketItems.some(
    (item) => item.journeyData?.transaction?.tokens?.methodOfPayment === "cash",
  );

  // TODO: We need to remove this after tendering rules, This is temparary workaround to enable/disable IRC
  const hasMailItem = basketItems.some(
    (item) => item.journeyData?.transaction?.entryType === "mails",
  );

  const cashClicked = useCallback(async () => {
    setInvalidInputForCard(false);
    setInvalidChequeAmount(false);
    setInvalidInput({ invalidIRC: false });
    if (inputAmount) {
      handleDispatchAfterCashClick(Math.abs(paidByCash), amount);
      setInputAmount(0);
    } else {
      handleDispatchAfterCashClick(Math.abs(paidByCash), amount, true);
      setWillPerformAfterPaymentCommit(true);
    }
  }, [
    amount,
    handleDispatchAfterCashClick,
    inputAmount,
    paidByCash,
    setInputAmount,
    setInvalidChequeAmount,
    setInvalidInput,
    setInvalidInputForCard,
    setWillPerformAfterPaymentCommit,
  ]);

  const chequeClicked = useCallback(async () => {
    setInvalidInputForCard(false);
    setInvalidInput({ invalidIRC: false });
    if (inputAmount > basketValue) {
      setInvalidChequeAmount(true);
      return;
    }
    setInvalidChequeAmount(false);
    if (inputAmount) {
      handleDispatchAfterChequeClick(amount);
      setInputAmount(0);
    } else {
      handleDispatchAfterChequeClick(amount, true);
      setWillPerformAfterPaymentCommit(true);
    }
  }, [
    amount,
    basketValue,
    handleDispatchAfterChequeClick,
    inputAmount,
    setInputAmount,
    setInvalidChequeAmount,
    setInvalidInput,
    setInvalidInputForCard,
    setWillPerformAfterPaymentCommit,
  ]);

  const ircClicked = useCallback(async () => {
    const { mediumName, minimumValue, maximumValue } = await getProductByProdNo(ircItemID);
    const minValue = Number(minimumValue);
    const maxValue = Number(maximumValue);
    setInvalidInputForCard(false);
    setInvalidChequeAmount(false);
    if (inputAmount > basketValue) {
      setInvalidInput({ invalidIRC: true });
      return;
    }
    setInvalidInput({ invalidIRC: false });
    if (inputAmount >= minValue && inputAmount <= maxValue) {
      handleDispatchAfterIRCClick(inputAmount, String(mediumName));
      setInputAmount(0);
      return;
    }
    dispatch(
      setLoadingActive({
        id: LoadingId.IRC_INVALID_AMOUNT,
        modalProps: {
          icon: false,
          title: TEXT.CTTXT00080,
          content: TEXT.CTTXT00081(
            appendPoundSymbolWithAmount(minValue),
            appendPoundSymbolWithAmount(maxValue),
          ),
          primaryButtonProps: {
            label: BUTTON.CTBTN0004,
            testID: BUTTON.CTBTN0004,
            onPress: () => {
              dispatch(setLoadingInactive(LoadingId.IRC_INVALID_AMOUNT));
            },
          },
        },
      }),
    );
  }, [
    basketValue,
    dispatch,
    handleDispatchAfterIRCClick,
    inputAmount,
    setInputAmount,
    setInvalidChequeAmount,
    setInvalidInput,
    setInvalidInputForCard,
  ]);

  return (
    <>
      <Text variant="medium-bold" mt="40px">
        Payment Mode
      </Text>
      <Flex flexDirection={"row"} mt="20px">
        <StyledButton
          onPress={cashClicked}
          testID={BUTTON.CTBTN0013}
          type="quaternary"
          label={BUTTON.CTBTN0013}
          isDisabled={areButtonsDisabled}
          styles={buttonStyles.startButton}
        />
        <StyledButton
          onPress={useCallback(() => {
            setInvalidChequeAmount(false);
            setInvalidInput({ invalidIRC: false });
            cardClicked();
          }, [cardClicked, setInvalidChequeAmount, setInvalidInput])}
          testID={BUTTON.CTBTN0010}
          type="quaternary"
          label={BUTTON.CTBTN0010}
          isDisabled={areButtonsDisabled || basketValue <= 0 || isCashOnly}
          styles={buttonStyles.baseButtonStyle}
        />
        <StyledButton
          onPress={chequeClicked}
          type="quaternary"
          testID={BUTTON.CTBTN0017}
          label={BUTTON.CTBTN0017}
          isDisabled={areButtonsDisabled || basketValue <= 0 || isCashOnly}
          styles={buttonStyles.baseButtonStyle}
        />
        <StyledButton
          onPress={ircClicked}
          testID={BUTTON.CTBTN0018}
          label={BUTTON.CTBTN0018}
          type="quaternary"
          isDisabled={!hasMailItem || areButtonsDisabled || basketValue <= 0 || isCashOnly}
          styles={buttonStyles.baseButtonStyle}
        />
      </Flex>
    </>
  );
}
