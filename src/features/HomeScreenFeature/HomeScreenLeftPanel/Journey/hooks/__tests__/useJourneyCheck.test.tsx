import { cashItemID, renderHook, useAppDispatch, useAppSelector } from "@ct/common";
import { useCheckInternet } from "@ct/common/hooks/commonHooks/useCheckInternet";
import { useAddBasketItem } from "@ct/common/hooks/useAddBasketItem";
import * as index from "@ct/common/state/common/noNetwork.slice";
import { TEXT } from "@ct/constants";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { EntryType } from "@ct/interfaces";
import { ERROR } from "../../../../../../common/enums/errorEnum";
import { getItemJourneyType, useJourneyCheck } from "../useJourneyCheck";

jest.mock("@ct/common/hooks/commonHooks/useCheckInternet");
jest.mock("@ct/common/hooks/useAddBasketItem");
jest.mock("@ct/common", () => ({
  ...jest.requireActual("@ct/common"),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe("getItemJourneyType", () => {
  it("returns refund if journeyType is refund", () => {
    const journeyData = {
      basketDataList: [
        {
          transaction: {
            journeyType: "refund",
          },
        },
      ],
    };
    expect(getItemJourneyType(journeyData)).toBe(JOURNEYENUM.REFUND);
  });

  it("returns sales if journeyType is not equal to refund", () => {
    const journeyData = {
      basketDataList: [
        {
          transaction: {
            journeyType: "another",
          },
        },
      ],
    };
    expect(getItemJourneyType(journeyData)).toBe(JOURNEYENUM.SALES);
  });
});

describe("useJourneyCheck", () => {
  const checkInternet = jest.fn();
  const addBasketItem = jest.fn();
  const dispatch = jest.fn();
  const journeyData = {
    basketDataList: [
      {
        transaction: {
          journeyType: "refund",
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCheckInternet as jest.Mock).mockReturnValue({ checkInternet });
    (useAddBasketItem as jest.Mock).mockReturnValue(addBasketItem);
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
    (useAppSelector as jest.Mock).mockReturnValue({
      basketItemCount: 0,
      journeyType: "sales",
    });
  });

  it("should execute showNoNetworkModal function after getting itemStatus if internet is not available", async () => {
    const showNoNetworkModalFunc = jest.spyOn(index, "showNoNetworkModal");
    checkInternet.mockReturnValue(true);
    addBasketItem.mockReturnValue(ERROR.NETWORK_ERROR);
    const { result } = renderHook(() => useJourneyCheck());
    await result.current(journeyData);
    expect(showNoNetworkModalFunc).toHaveBeenCalledTimes(1);
  });

  it("should show journey notice modal if basket item count greater than 0", async () => {
    checkInternet.mockReturnValue(true);
    (useAppSelector as jest.Mock).mockReturnValue({
      basketItemCount: 1,
      journeyType: "sales",
    });
    const { result } = renderHook(() => useJourneyCheck());
    await result.current(journeyData);
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ id: "homeScreenJourneyNotice" }),
      }),
    );
  });

  it("should show journey notice modal if adding cash only item to basket with card payment", async () => {
    checkInternet.mockReturnValue(true);
    (useAppSelector as jest.Mock).mockReturnValue({
      basketItems: [{ type: EntryType.paymentMode }],
      basketItemCount: 1,
      journeyType: "sales",
    });
    const { result } = renderHook(() => useJourneyCheck());
    const itemData = {
      basketDataList: [
        {
          transaction: {
            tokens: {
              methodOfPayment: "cash",
            },
          },
        },
      ],
    };
    await result.current(itemData);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          modalProps: expect.objectContaining({
            content: TEXT.CTTXT00077,
          }),
        }),
      }),
    );
  });

  it("should not show journey notice modal if adding cash only item to basket with cash payment", async () => {
    checkInternet.mockReturnValue(true);
    addBasketItem.mockReturnValue(true);
    (useAppSelector as jest.Mock).mockReturnValue({
      basketItems: [
        { type: EntryType.paymentMode, journeyData: { transaction: { itemID: cashItemID } } },
      ],
      basketItemCount: 1,
      journeyType: "sales",
    });
    const { result } = renderHook(() => useJourneyCheck());
    const itemData = {
      basketDataList: [
        {
          transaction: {
            tokens: {
              methodOfPayment: "cash",
            },
          },
        },
      ],
    };
    await result.current(itemData);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });
});
