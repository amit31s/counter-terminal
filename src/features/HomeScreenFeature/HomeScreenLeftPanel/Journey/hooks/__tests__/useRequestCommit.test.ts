import { renderHookWithRedux } from "@ct/common";
import * as hooks from "@ct/common/hooks/homeScreenHooks/basketOpenCloseCommitHooks/useCommitBasket";
import { CommitStatus, IUpdateBasketState } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { uuid } from "@ct/utils/utils";
import { useRequestCommitOnItemAdded } from "../useRequestCommit";

const itemA: IbasketItem = {
  id: uuid(),
  entryID: new Date().getTime(),
  quantity: 1,
  total: 0,
  price: 0,
  commitStatus: CommitStatus.notInitiated,
  fulFillmentStatus: "fulfillmentNotInitiated",
  source: "nbit",
  additionalItemsValue: 0,
};

const mockCommitBasket = jest.fn();
jest.spyOn(hooks, "useCommitBasket").mockReturnValue({
  commitBasket: mockCommitBasket,
  commitAggregatedItems: jest.fn(),
  retryCommit: jest.fn(),
  commitCashEntry: jest.fn(),
  commitCardEntry: jest.fn(),
});

describe("useRequestOnCommit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls setIsCommitRequested called if basketItemCount less than countRef", async () => {
    renderHookWithRedux(() => useRequestCommitOnItemAdded(), {
      updateBasket: { items: [itemA] } as unknown as IUpdateBasketState,
      loadingStatus: [{ id: null, modalProps: {} }],
    });
    expect(mockCommitBasket).toBeCalledTimes(1);
  });
});
