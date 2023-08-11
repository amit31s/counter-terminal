import { usePostAssociatedData } from "@ct/api/generator";
import { STORAGE_KEYS } from "@ct/common/enums";
import { SCREENS } from "@ct/constants";
import { setItem } from "@ct/utils";
import { useNavigate } from "react-router-dom";

export interface CashDrawerObject {
  entityType: string;
  entityID: string;
  operationType: string;
}

export const prepareCashDrawerRequestPayload = async (
  barcodeId: string,
): Promise<CashDrawerObject> => {
  return {
    entityID: barcodeId,
    entityType: "cash_drawer",
    operationType: "association",
  };
};

export const useCashDrawerScanner = () => {
  const navigate = useNavigate();

  const { mutate, isSuccess, isError, error } = usePostAssociatedData({
    mutation: {
      onSuccess: (_, variables) => {
        setItem(STORAGE_KEYS.CTSTK0006, variables.data.entityID);
        navigate(SCREENS.HOME, { state: { from: SCREENS.CASH_DRAWER } });
      },
    },
  });

  const associateCashDrawer = async (barcodeId: string) => {
    if (!barcodeId) {
      return;
    }
    const data = await prepareCashDrawerRequestPayload(barcodeId);
    return mutate({ data });
  };
  return { associateCashDrawer, isSuccess, isError, error };
};
