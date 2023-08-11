import {
  getBasket,
  getQuantityFlag,
  useAppDispatch,
  useAppSelector,
  useGetHomeScreenStage,
} from "@ct/common";
import { updateQuantityFlag } from "@ct/common/state/HomeScreen/updateQuantityFlag.slice";
import { BUTTON } from "@ct/constants";
import { EntryType } from "@ct/interfaces";
import { isEmpty } from "lodash";
import { BasketButton } from "postoffice-spm-components";
import { useCallback } from "react";

export const Quantity = () => {
  const { stage } = useGetHomeScreenStage();

  const dispatch = useAppDispatch();
  const quantityFlag = useAppSelector(getQuantityFlag);
  const { basketItems, selectedItem } = useAppSelector(getBasket);

  const dispatchQuantityFlagData = useCallback(() => {
    dispatch(
      updateQuantityFlag({
        flag: !quantityFlag.flag,
      }),
    );
  }, [dispatch, quantityFlag.flag]);

  const isDisabled =
    basketItems.length === 0 ||
    stage === "tendering" ||
    stage === "completed" ||
    isEmpty(selectedItem) ||
    selectedItem.commitStatus !== "notInitiated" ||
    selectedItem.journeyData?.transaction?.quantityFixed === "false" ||
    selectedItem?.type === EntryType.paymentMode;
  return (
    <BasketButton
      title={BUTTON.CTBTN0014}
      testID={BUTTON.CTBTN0014}
      disabled={isDisabled || quantityFlag.flag}
      variant="keypad"
      onPress={dispatchQuantityFlagData}
    />
  );
};
