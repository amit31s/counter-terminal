import { cardPaymentPayload, useAppDispatch, useCommitBasket } from "@ct/common";
import { ERROR } from "@ct/common/enums";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { LoadingId, setLoadingActive } from "@ct/common/state/loadingStatus.slice";
import { TEXT, stringConstants } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { uuid } from "@ct/utils";
import { PaymentTokeniserResult } from "postoffice-product-journey-api-clients";
import { Dispatch, SetStateAction } from "react";

export default async function addCardToBasket(
  basketItems: IbasketItem[],
  referenceDataCheck: PaymentTokeniserResult,
  pan: string,
  paymentId: string,
  amount: number,
  transactionId: string,
  journeyType: string,
  commitCardEntry: ReturnType<typeof useCommitBasket>["commitCardEntry"],
  setPaymentUUID: Dispatch<SetStateAction<string | null>>,
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  const basketArray: IbasketItem[] = Object.assign([], basketItems);
  const itemUUID = uuid();
  const cardEntry: IbasketItem = await cardPaymentPayload(
    referenceDataCheck,
    pan,
    paymentId,
    amount,
    transactionId,
    itemUUID,
    journeyType,
  );

  setPaymentUUID(itemUUID);
  dispatch(
    setLoadingActive({
      id: LoadingId.PIN_PAD,
      modalProps: { title: stringConstants.pinPadModalTitle, content: TEXT.CTTXT0007 },
    }),
  );
  const resp = await commitCardEntry(cardEntry, basketArray);

  if (resp === ERROR.NETWORK_ERROR) {
    dispatch(showNoNetworkModal());
    return false;
  }

  if (resp?.fulfilmentStatusAllItems !== "success" || resp.commitStatusAllItems !== "success") {
    return false;
  }

  return true;
}
