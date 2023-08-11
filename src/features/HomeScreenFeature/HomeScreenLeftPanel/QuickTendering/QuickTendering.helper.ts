import { chequePaymentPayload, ircPaymentPayload } from "@ct/common";
import { STATE_CONSTANTS } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces";
import { uuid } from "@ct/utils";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { chequeUUID, ircUUID } from "../../homeScreen.helper";

export const prepareChequePayloadToCommit = async ({
  basketItems,
  entryID,
}: {
  basketItems: IbasketItem[];
  entryID: number;
}): Promise<
  | {
      payloadToCommit: BasketItemPayload[];
      entryID: number;
    }
  | undefined
> => {
  const journeyType = basketItems[0]?.journeyData?.transaction?.journeyType;

  const chequePayment = basketItems.find(
    (entry: IbasketItem) =>
      entry.id === chequeUUID(entry) && entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
  );

  if (!chequePayment) {
    return;
  }
  const payloadToCommit: BasketItemPayload[] = [];
  for (let index = 0; index < basketItems.length; index++) {
    const element = basketItems[index];
    if (element.id === chequeUUID(element)) {
      const chequePayload = await chequePaymentPayload(
        element.total,
        entryID,
        STATE_CONSTANTS.CHEQUE,
        journeyType,
      );
      payloadToCommit.push(chequePayload);
      entryID++;
    }
  }
  return { payloadToCommit, entryID };
};

export const prepareIrcPayloadToCommit = async ({
  basketItems,
  entryID,
}: {
  basketItems: IbasketItem[];
  entryID: number;
}): Promise<
  | {
      payloadToCommit: BasketItemPayload[];
      entryID: number;
    }
  | undefined
> => {
  const ircPayment = basketItems.find(
    (entry: IbasketItem) =>
      entry.id === ircUUID(entry) && entry.commitStatus === STATE_CONSTANTS.NOTINITIATED,
  );

  if (!ircPayment) {
    return;
  }
  const payloadToCommit: BasketItemPayload[] = [];
  for (let index = 0; index < basketItems.length; index++) {
    const element = basketItems[index];
    if (element.id === ircUUID(element)) {
      const chequePayload = await ircPaymentPayload(
        element.total,
        entryID,
        element.localUUID ?? uuid(),
      );
      payloadToCommit.push(chequePayload);
      entryID++;
    }
  }
  return { payloadToCommit, entryID };
};
