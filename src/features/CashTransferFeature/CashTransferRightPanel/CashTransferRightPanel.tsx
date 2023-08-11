import { cashTransferSelector } from "@ct/common";
import { useSelector } from "react-redux";
import { CashInput } from "./CashInput";
import { CashTransferSuccess } from "./CashTransferSuccess";
import { SelectCashLocationMessage } from "./SelectCashLocationMessage";

export const CashTransferRightPanel = () => {
  const cashTransfer = useSelector(cashTransferSelector);
  const isSelected = Object.keys(cashTransfer.selectedItem).length > 1;

  if (!isSelected) {
    return <SelectCashLocationMessage />;
  }

  if (cashTransfer.transferred) {
    return <CashTransferSuccess />;
  }
  return <CashInput selectedEntity={cashTransfer.selectedItem?.accountingLocationID ?? ""} />;
};
