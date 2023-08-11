import { useGetAssociationUnassociationDetails } from "@ct/api/generator";
import { STORAGE_KEYS } from "@ct/common/enums";
import { CashLocation } from "@ct/common/state/cashTransfer/cashTransfer.slice";
import { getItem } from "@ct/utils/Storage/Storage";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useState } from "react";

export const useLoadCashLocations = () => {
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);

  const [cashLocationData, setCashLocationData] = useState<CashLocation[]>([]);
  useGetAssociationUnassociationDetails(
    { selfId: getItem(STORAGE_KEYS.CTSTK0006) },
    {
      query: {
        enabled: cashLocationData.length === 0,
        onError(error: Error) {
          appLogger.error({
            methodName: "useLoadCashLocations",
            error: error,
          });
        },
        onSuccess(data) {
          const locations: CashLocation[] = [];
          if (data?.safe) {
            locations.push({ ...data.safe, ...{ entityType: "safe" } });
          }
          if (data?.associated) {
            const newData = data.associated.map((associatedData) => ({
              ...associatedData,
              entityType: "cash_drawer",
            }));
            locations.push(...newData);
          }
          setCashLocationData((prevLocations) => [...prevLocations, ...locations]);
        },
      },
    },
  );
  return { data: cashLocationData };
};
