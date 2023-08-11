import { SERVER_ROOT } from "@ct/common";
import { ERROR_CODES } from "@ct/common/ErrorCodes";
import { STORAGE_KEYS } from "@ct/common/enums";
import { APP_CONSTANTS } from "@ct/constants";
import { getUserIdToken } from "@ct/utils/Services/auth";
import { getItem } from "@ct/utils/Storage";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import {
  BasketStateEnum,
  Configuration,
  TransactionsApi,
  TransactionsApiInterface,
} from "postoffice-commit-and-fulfill";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { API_LOGS_FN, API_LOGS_MSG } from "@ct/common/constants/APILogs";

const apiLogger = logManager(LOGGER_TYPE.apiLogger);

function basketId(branchID: string, nodeId: number) {
  return (seqNumber: number) => `${branchID}-${nodeId}-${seqNumber}`;
}

function createBasket(branchId: string, nodeId: number, client: TransactionsApiInterface) {
  return async () => {
    const lastId = await client.getLastSeqNumber(branchId, nodeId, getUserIdToken());
    if (!lastId) {
      throw new Error("Last sequence number not set");
    }

    const basketIdN = basketId(branchId, nodeId)(lastId.data.lastSeqNumber + 1);
    const resp = await client.createBasket(getUserIdToken(), {
      basketID: basketIdN,
    });

    return {
      basketId: basketIdN,
      response: resp,
    };
  };
}

function getBasket(client: TransactionsApiInterface) {
  return async (basketID: string) => await client.getBasket(basketID);
}

function getLastSeqNumber(branchId: string, nodeId: number, client: TransactionsApiInterface) {
  return async () => await client.getLastSeqNumber(branchId, nodeId, getUserIdToken());
}

function getLastBasketID(branchId: string, nodeId: number, client: TransactionsApiInterface) {
  return async () => {
    const lastId = await client.getLastSeqNumber(branchId, nodeId, getUserIdToken());
    if (!lastId) {
      throw new Error("Last sequence number not set");
    }

    return basketId(branchId, nodeId)(lastId.data.lastSeqNumber);
  };
}

function getLastBasket(branchID: string, nodeID: number, client: TransactionsApiInterface) {
  return async () => {
    try {
      return await client.getLastBasket(branchID, nodeID, getUserIdToken());
    } catch (error) {
      const errorResponse = get(error, "response.data.errorCode");
      if (errorResponse === ERROR_CODES.transactionEngine.noBasketExist) {
        return {
          data: {
            basket: {
              basketCore: {
                basketID: "",
                basketState: BasketStateEnum.Bkc,
                NumberOfEntries: 0,
              },
            },
            entries: [],
          },
        };
      } else {
        throw error;
      }
    }
  };
}

function closeBasket(branchId: string, nodeId: number, client: TransactionsApiInterface) {
  return async (seqNumber: number, numberOfEntries: number) => {
    const id = basketId(branchId, nodeId)(seqNumber);
    return client.closeOrModifyBasket(getUserIdToken(), {
      basketID: id,
      basketState: BasketStateEnum.Bkc,
      NumberOfEntries: numberOfEntries,
    });
  };
}

function getNumberOfEntries(branchID: string, nodeID: number, client: TransactionsApiInterface) {
  return async () => {
    try {
      const { data: lastSavedBasket } = await client.getLastBasket(
        branchID,
        nodeID,
        getUserIdToken(),
      );
      if (!lastSavedBasket) {
        apiLogger.error({
          methodName: API_LOGS_FN.getNumberOfEntries,
          error: API_LOGS_MSG.nothingReturnedGLBAPI,
        });
        return;
      }

      const numberOfEntries = lastSavedBasket?.basket?.basketCore?.NumberOfEntries;

      if (lastSavedBasket?.basket?.basketCore?.basketState === BasketStateEnum.Bkc) {
        return 0;
      }

      if (typeof numberOfEntries !== "number") {
        apiLogger.error({
          methodName: API_LOGS_FN.getNumberOfEntries,
          error: API_LOGS_MSG.numberEntriesNotDefined,
          logData: lastSavedBasket,
        });
        return;
      }
      return numberOfEntries;
    } catch (error) {
      const errorResponse = get(error, "response.data.errorCode");
      if (errorResponse === ERROR_CODES.transactionEngine.noBasketExist) {
        return 0;
      } else {
        throw error;
      }
    }
  };
}

export const transactionApiClient = () => {
  const basePath = SERVER_ROOT + "/transactions/" + "v3";
  const deviceName = getItem(APP_CONSTANTS.CONST0009) ?? "";
  const nodeID = Number(getItem(STORAGE_KEYS.CTSTK0005));
  const branchID = getItem(STORAGE_KEYS.CTSTK0004);

  const client: TransactionsApiInterface = new TransactionsApi(
    new Configuration({
      basePath: basePath,
      accessToken: () => {
        return getItem(APP_CONSTANTS.CONST0010(deviceName)) ?? "";
      },
    }),
  );

  return {
    createBasket: createBasket(branchID, nodeID, client),
    getBasket: getBasket(client),
    getLastSeqNumber: getLastSeqNumber(branchID, nodeID, client),
    lastBasketID: getLastBasketID(branchID, nodeID, client),
    closeBasket: closeBasket(branchID, nodeID, client),
    getBasketId: basketId(branchID, nodeID),
    getLastBasket: getLastBasket(branchID, nodeID, client),
    getNumberOfEntries: getNumberOfEntries(branchID, nodeID, client),
    client,
  };
};
