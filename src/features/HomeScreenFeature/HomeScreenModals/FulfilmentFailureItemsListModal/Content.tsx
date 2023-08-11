import { getFulfillmentData, useAppSelector } from "@ct/common";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { FulFillmentItem } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { isEqual } from "lodash";
import { CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import { useEffect, useMemo, useState } from "react";
import { ContentList } from "./ContentList";
import { TransactionDeclinedMessage } from "./TransactionDeclinedMessage";

export const getDataAndRefundPrice = (
  failedItems: FulFillmentItem[],
  basketItemByUuid: (id: string) => IbasketItem | undefined,
) => {
  let priceToRefund = 0;
  const newData: IbasketItem[] = [];
  failedItems.forEach((item) => {
    const { id } = item;
    const failedItem = basketItemByUuid(id) as IbasketItem;
    if (failedItem) {
      priceToRefund += failedItem?.price;
      newData.push(failedItem);
    }
  });
  return { priceToRefund, newData };
};

export const getCommitStatus = (data: IbasketItem[]) => {
  if (data.length !== 1) return false;
  const target = data[0];
  const commitAndFulfillPoint = target?.journeyData?.transaction?.commitAndFulfillPoint;
  const conditionA = commitAndFulfillPoint === CommitAndFulfillPointEnum.Immediate;
  const conditionB =
    target.price <= 0 && commitAndFulfillPoint !== CommitAndFulfillPointEnum.Aggregated;
  return conditionA || conditionB;
};

export const Content = () => {
  const { failedItems } = useAppSelector(getFulfillmentData);
  const { basketItemByUuid } = useBasket();
  const [data, setData] = useState<IbasketItem[]>([]);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!failedItems.length) {
      if (!data.length) {
        return;
      }
      setData([]);
      return;
    }
    const { priceToRefund, newData } = getDataAndRefundPrice(failedItems, basketItemByUuid);
    if (priceToRefund !== price) {
      setPrice(priceToRefund);
    }
    if (!isEqual(data, newData)) {
      setData(newData);
    }
  }, [basketItemByUuid, data, failedItems, price]);

  const beforePaymentFailure = useMemo(() => {
    return getCommitStatus(data);
  }, [data]);

  return beforePaymentFailure ? (
    <TransactionDeclinedMessage />
  ) : (
    <ContentList data={data} price={price} />
  );
};
