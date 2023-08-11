import { tokeniserClient } from "./buildClient";

type getProductByProdNoResult = {
  mediumName: unknown;
  longName: unknown;
  itemType: unknown;
  existingReversalAllowed: unknown;
  vatCode: unknown;
  minimumValue: unknown;
  maximumValue: unknown;
};

export const getProductByProdNo = async (cashItemID: string): Promise<getProductByProdNoResult> => {
  const {
    mediumName,
    longName,
    itemType,
    existingReversalAllowed,
    vatCode,
    minimumValue,
    maximumValue,
  } = await tokeniserClient.getProduct({
    ProdNo: cashItemID,
  });

  return {
    mediumName,
    longName,
    itemType,
    existingReversalAllowed,
    vatCode,
    minimumValue,
    maximumValue,
  };
};
