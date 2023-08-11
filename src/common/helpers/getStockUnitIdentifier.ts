import { getItem } from "@ct/utils";
import { STORAGE_KEYS } from "../enums";

export function getStockUnitIdentifier(): string {
  return getItem(STORAGE_KEYS.CTSTK0006);
}
