import { PedActions } from "postoffice-peripheral-management-service";

// actions that don't require a transaction id for processing

const pinPadActionsWithNoTransactionId = [PedActions.POSEvent, PedActions.GetCardToken];

// to prevent journey developers from calling actions that are not permitted
// we have a list of permitted actions to enforce centrally before device called

const permittedJourneyPinPadActions = [
  PedActions.WithdrawalX,
  PedActions.DepositX,
  PedActions.POSEvent,
  PedActions.AbortX,
  PedActions.BalanceEnquiryX,
  PedActions.ChangePinX,
  PedActions.GetCardToken,
];

const withdrawalAndDepositActions = [PedActions.WithdrawalX, PedActions.DepositX];
const eventActions = [PedActions.POSEvent];

export const errorChecker = (
  transactionId: string,
  action: string,
  amount: number,
  event: string,
) => {
  const pedAction = action as PedActions;

  // ensure journey only performing permitted actions

  if (!permittedJourneyPinPadActions.includes(pedAction)) {
    throw new Error(`Action ${action} is not supported within a journey`);
  }

  if (!transactionId && !pinPadActionsWithNoTransactionId.includes(pedAction)) {
    throw new Error(`transactionId is a mandatory param`);
  }

  // enforce amount
  if (withdrawalAndDepositActions.includes(pedAction) && amount === 0) {
    throw new Error(`amount is a mandatory param for ${action}`);
  }

  // enforce event
  if (eventActions.includes(pedAction) && !event) {
    throw new Error(`event is a mandatory param for ${action}`);
  }
};
