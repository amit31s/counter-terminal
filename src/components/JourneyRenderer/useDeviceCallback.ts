import {
  useAppDispatch,
  useAppSelector,
  useMagneticSwipeCardReader,
  useOpenBasket,
  useScanner,
} from "@ct/common";
import { updateReceiptData } from "@ct/common/state/HomeScreen/updateRecieptData.slice";
import {
  LabelFulfilmentStage,
  setLabelFulfilmentStage,
} from "@ct/common/state/labelFulfillment.slice";
import { Device, DeviceActionsCallback } from "@ct/utils";
import { useCallback, useEffect, useRef } from "react";
import { JourneyData } from ".";
import { AppData } from "./useAppData";
import { useGetTransactionsForRefundJourney } from "./useGetTransactionsForRefundJourney";

export function useDeviceCallback(
  appData: AppData,
  journeyOnComplete: (data: JourneyData) => Promise<void>,
) {
  const dispatch = useAppDispatch();
  const { openBasket } = useOpenBasket();
  const { basketTransactions } = useGetTransactionsForRefundJourney();

  const resolveScan = useRef<((value: { barcode: string }) => void) | null>(null);
  useScanner(
    useCallback((text: string) => {
      resolveScan.current?.({ barcode: text });
    }, []),
  );

  const resolveSwipe = useRef<((value: { inputValue: string }) => void) | null>(null);
  useMagneticSwipeCardReader({
    onSwipe: useCallback((inputValue: string) => resolveSwipe.current?.({ inputValue }), []),
  });

  const resolveLabel = useRef<((value: { result: LabelFulfilmentStage }) => void) | null>(null);
  const { stage: labelFulfilmentStage } = useAppSelector((rootState) => rootState.labelFulfilment);

  useEffect(() => {
    if (
      resolveLabel.current === null ||
      labelFulfilmentStage === "NOT_REQUESTED" ||
      labelFulfilmentStage === "INITIATED"
    ) {
      return;
    }

    resolveLabel.current({ result: labelFulfilmentStage });
    dispatch(setLabelFulfilmentStage("NOT_REQUESTED"));
    resolveLabel.current = null;
  }, [dispatch, labelFulfilmentStage]);

  return useCallback(
    async (
      device: string,
      action: string,
      params: Record<string, unknown> | null,
    ): Promise<Record<string, unknown>> => {
      if (action === "print" && params?.value !== null) {
        dispatch(updateReceiptData(params?.value as string));
      } else if (action === "getBasketID") {
        const { basketId } = await openBasket();
        const outputObject = {
          basketId: basketId,
        };
        return { outputObject };
      } else if (action === "getBTransactions") {
        const transactions = await basketTransactions(params?.barcodeTransaction as string);
        const outputObject = {
          basketTransactions: transactions,
        };
        return { outputObject };
      } else if (action === "scan") {
        return new Promise((resolve) => {
          resolveScan.current = resolve;
        });
      } else if (action === "swipe") {
        return new Promise((resolve) => {
          resolveSwipe.current = resolve;
        });
      } else if (action === "commitLabel") {
        return new Promise(async (resolve) => {
          if (typeof params?.data !== "object") {
            resolve({
              error: `Expected item data object, got: ${typeof params?.data}`,
            });
          }
          resolveLabel.current = resolve;
          dispatch(setLabelFulfilmentStage("INITIATED"));
          await journeyOnComplete(params?.data);
        });
      }

      return await DeviceActionsCallback(device as Device, action, params, appData);
    },
    [appData, basketTransactions, dispatch, journeyOnComplete, openBasket],
  );
}
