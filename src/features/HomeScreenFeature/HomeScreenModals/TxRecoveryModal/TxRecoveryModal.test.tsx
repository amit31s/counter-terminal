import { BasketCoreFulfilmentState } from "@ct/api/generator";
import { renderWithRedux, setupUser, waitFor } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { TEXT } from "@ct/constants";
import { basketItemMock } from "@ct/utils/MockData";
import { FulfilmentStateEnum } from "postoffice-commit-and-fulfill";
import { TxRecoveryModalContent } from "./TxRecoveryModal";

jest.mock("@ct/utils/Storage", () => ({
  ...jest.requireActual("@ct/utils/Storage"),
  getItem: () => "n",
}));

describe("transaction recovery Modal", () => {
  it("doesn't render when basket length is zero", async () => {
    const updateBasket = defaultBasketData();
    const { queryByTestId } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(queryByTestId("txRecoveryModel")).toBeFalsy();
  });

  it("renders when basket length is not zero", async () => {
    const items = basketItemMock();
    items[0].source = "nbit";
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { getByTestId } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(getByTestId("txRecoveryModel")).toBeTruthy();
    expect(getByTestId("txRecoveryModelConfirm")).toBeTruthy();
  });

  it("Show label confirmation if NBIT basket contains mails label", async () => {
    const items = basketItemMock();
    items[0] = {
      id: "PS Virgin etu £25c96f70f-3a53-4e83-852b-87b91876326d",
      name: "PS Virgin etu £2",
      commitStatus: CommitStatus.success,
      additionalItemsValue: 0,
      fulFillmentStatus: "success",
      total: 0,
      quantity: 1,
      price: 0,
      source: "nbit",
      journeyData: {
        transaction: {
          entryID: "2",
          itemID: "6401",
          tokens: {
            productDescription: "PS Virgin etu £2",
            fulfilmentAction: "label",
          },
        },
      },
    };
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { getByTestId, getByText } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(getByTestId("txRecoveryModel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00042)).toBeTruthy();
  });

  it("Show payment has been made to the customer if NBIT basket contains withdrawal", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [
      {
        id: "PS Virgin etu £25c96f70f-3a53-4e83-852b-87b91876326d",
        name: "PS Virgin etu £2",
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        total: 0,
        quantity: 1,
        price: 0,
        source: "nbit",
        journeyData: {
          transaction: {
            entryID: "2",
            itemID: "6401",
            tokens: {
              productDescription: "PS Virgin etu £2",
              fulfilmentAction: "withdrawal",
            },
          },
        },
      },
    ];
    const { getByTestId, getByText } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(getByTestId("txRecoveryModel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00037)).toBeTruthy();
  });

  it("Show correct negative cash payment message", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [
      {
        id: "Cash",
        name: "Cash",
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        total: -10,
        quantity: 1,
        price: -10,
        source: "nbit",
        journeyData: {
          transaction: {
            entryID: "1",
            itemID: "1",
          },
        },
      },
    ];
    const { getByTestId, getByText } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(getByTestId("txRecoveryModel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00036)).toBeTruthy();
  });

  it("Show correct positive cash payment message", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [
      {
        id: "Cash",
        name: "Cash",
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        total: 10,
        quantity: 1,
        price: 10,
        source: "nbit",
        journeyData: {
          transaction: {
            entryID: "1",
            itemID: "1",
          },
        },
      },
    ];
    const { getByTestId, getByText } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    expect(getByTestId("txRecoveryModel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00037)).toBeTruthy();
  });

  it("Should show Failed when transaction is pending", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [
      {
        id: "MockID",
        name: "Mock Name",
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: BasketCoreFulfilmentState.pending,
        total: 10,
        quantity: 1,
        price: 10,
        source: "nbit",
        journeyData: {
          transaction: {
            entryID: "1",
            itemID: "1",
          },
        },
      },
    ];
    const { getByText } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });
    expect(getByText(TEXT.CTTXT00043)).toBeTruthy();
  });
  it("should close modal when click on confirm button", async () => {
    const user = setupUser();
    const items = basketItemMock();
    items[0] = {
      id: "PS Virgin etu £25c96f70f-3a53-4e83-852b-87b91876326d",
      name: "PS Virgin etu £2",
      commitStatus: CommitStatus.success,
      additionalItemsValue: 0,
      fulFillmentStatus: FulfilmentStateEnum.Pending,
      total: 0,
      quantity: 1,
      price: 0,
      source: "nbit",
      journeyData: {
        transaction: {
          entryID: "2",
          itemID: "6401",
          tokens: {
            productDescription: "PS Virgin etu £2",
            fulfilmentAction: "label",
          },
        },
      },
    };
    items[1].source = "nbit";
    items[2].source = "nbit";
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { findByTestId, getByTestId } = renderWithRedux(<TxRecoveryModalContent />, {
      updateBasket,
    });

    for (let index = 0; index < updateBasket.items.length; index++) {
      const button = await findByTestId("txRecoveryModelConfirm");
      await waitFor(() => {
        expect(button).not.toHaveAttribute("aria-disabled", "false");
      });
      await user.click(button);
    }
    expect(getByTestId("txRecoveryModelConfirm")).toBeInTheDocument();
  });
});
