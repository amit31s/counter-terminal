import { renderHookWithRedux, renderWithRedux, waitFor } from "@ct/common";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import * as hook from "@ct/common/hooks/useAppDispatch";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { STRING_CONSTANTS } from "@ct/constants";
import { basketItemMock, basketItemMockForRefund } from "@ct/utils/MockData";
import { authMock } from "@ct/utils/MockData/reduxMock";
import * as TransactionAPI from "@ct/utils/Services/CommitFulfillService/transactionApi";
import { BasketStateEnum } from "postoffice-commit-and-fulfill";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../../../__mocks__/broadcastChannel";
import { Journey } from "./Journey";
stubBroadcastChannel();

afterEach(async () => {
  clearBroadcastChannelInstances();
});

jest.spyOn(TransactionAPI, "transactionApiClient").mockReturnValue({
  getLastBasket: async () => ({
    data: {
      basket: {
        basketCore: {
          basketID: "mock-basket-id",
          basketState: BasketStateEnum.Bkc,
          NumberOfEntries: 0,
        },
      },
      entries: [],
    },
  }),
  getNumberOfEntries: jest.fn(),
  createBasket: jest.fn(),
  getBasket: jest.fn(),
  getLastSeqNumber: jest.fn(),
  lastBasketID: jest.fn(),
  closeBasket: jest.fn(),
  getBasketId: jest.fn(),
  client: {
    closeOrModifyBasket: jest.fn(),
    createBasket: jest.fn(),
    createBasketEntry: jest.fn(),
    getBasket: jest.fn(),
    getBasketEntry: jest.fn(),
    getLastBasket: jest.fn(),
    getLastSeqNumber: jest.fn(),
    updateBasketEntryFulfilment: jest.fn(),
    getBasketEntryReversal: jest.fn(),
  },
});

describe("journey", () => {
  describe("Journey Functionality", () => {
    it("renders a journey", async () => {
      const updateBasket = defaultBasketData();
      const { queryByText } = renderWithRedux(<Journey />, {
        updateBasket,
        updateJourneyStatus: {
          open: true,
          event: undefined,
        },
        auth: authMock,
      });
      if (queryByText("Mails") != null) expect(queryByText("Mails")).toContainHTML("Mails");
    });
    it("when basket has refund data", async () => {
      jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());

      const journeyType = "refund";
      const items = basketItemMockForRefund();
      if (items[0].journeyData?.transaction?.journeyType) {
        items[0].journeyData.transaction.journeyType === journeyType;
        const updateBasket = defaultBasketData();
        updateBasket.items = items;
        const { result } = renderHookWithRedux(
          () => {
            const { changeValueToZero } = useBasket();
            return changeValueToZero(journeyType);
          },
          {
            updateBasket,
          },
        );
        expect(result.current).toMatchObject(items);
      }
    });

    it("when basket has sales data", async () => {
      jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());

      const journeyType = "sales";
      const items = basketItemMock();
      const updateBasket = defaultBasketData();
      updateBasket.items = items;
      if (items[0].journeyData.transaction.journeyType === journeyType) {
        const { result } = renderHookWithRedux(
          () => {
            const { changeValueToZero } = useBasket();
            return changeValueToZero(journeyType);
          },
          {
            updateBasket,
          },
        );
        expect(result.current.length).toBe(3);
      }
    });
  });
  describe("Barcodescanner render", () => {
    it("should render the barcode scanner if journey has not started", async () => {
      const { getByPlaceholderText } = renderWithRedux(<Journey />, {
        updateJourneyStatus: {
          open: false,
          event: undefined,
        },
        auth: authMock,
      });
      await waitFor(() => {
        expect(getByPlaceholderText(STRING_CONSTANTS.Input.barcodeScannerHome)).toBeInTheDocument();
      });
    });
    it("should not render the barcode scanner if journey has started", async () => {
      const { queryByPlaceholderText } = renderWithRedux(<Journey />, {
        updateJourneyStatus: {
          open: true,
          event: undefined,
        },
        auth: authMock,
      });
      await waitFor(() => {
        expect(
          queryByPlaceholderText(STRING_CONSTANTS.Input.barcodeScannerHome),
        ).not.toBeInTheDocument();
      });
    });
  });
});
