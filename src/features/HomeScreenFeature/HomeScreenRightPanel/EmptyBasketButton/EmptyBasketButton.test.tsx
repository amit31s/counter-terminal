import { renderWithRedux, setupUser } from "@ct/common";
import * as hooks from "@ct/common/hooks/homeScreenHooks/useVoidItemOrBasket";
import * as selector from "@ct/common/hooks/useAppSelector";
import * as showNoNetworkModalSlice from "@ct/common/state/common/noNetwork.slice";
import * as inactiveLoaderSlice from "@ct/common/state/loadingStatus.slice";
import * as networkErrorChecker from "@ct/utils/utils";

import { EntryType } from "@ct/interfaces";
import { IbasketItem } from "postoffice-prepare-receipt-context/dist/mails/types";
import React from "react";
import { EmptyBasketButton } from "./EmptyBasketButton";

describe("voidBasketButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setStateMock = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);

  describe("component render", () => {
    describe("styled button", () => {
      it("renders with the correct text", () => {
        const { getByText } = renderWithRedux(<EmptyBasketButton />);
        const button = getByText("Empty basket");
        expect(button).toBeInTheDocument();
      });
      describe("button status", () => {
        describe("disabled", () => {
          it("renders the button as disabled", async () => {
            jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
              isDisabled: true,
              isItemVoidable: jest.fn(),
              isBasketVoidable: jest.fn(),
            });
            const { getByText } = renderWithRedux(<EmptyBasketButton />);
            const button = getByText("Empty basket");
            expect(button).toBeTruthy();
          });
        });
        describe("enabled", () => {
          it("renders the button as enabled", async () => {
            jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
              isDisabled: false,
              isItemVoidable: jest.fn(),
              isBasketVoidable: jest.fn(),
            });
            const { getByText } = renderWithRedux(<EmptyBasketButton />);
            const button = getByText("Empty basket");
            expect(button).not.toHaveAttribute("aria-disabled", "true");
          });
        });
      });
    });
    describe("voidBasketClick function", () => {
      const selectedItem = {
        id: "1",
        total: 1,
        name: "Item 1",
        price: 1,
        quantity: 1,
        type: EntryType.paymentMode,
      };
      const basketItems: IbasketItem[] = [
        {
          id: "1",
          total: 1,
          name: "Item 1",
          price: 1,
          quantity: 1,
          type: EntryType.paymentMode,
        },
        {
          id: "2",
          name: "Item 2",
          price: 2,
          quantity: 1,
          total: 2,
        },
      ];
      it("should set setIsVoidableModal to true if it has selected item and is not voidable ", async () => {
        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: false,
          isItemVoidable: jest.fn(),
          isBasketVoidable: jest.fn(),
        });
        jest.spyOn(selector, "useAppSelector").mockReturnValueOnce({ selectedItem, basketItems });
        const user = setupUser();
        const test = jest.fn().mockImplementation(() => {
          return Promise.resolve(false);
        });
        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: false,
          isItemVoidable: jest.fn(),
          isBasketVoidable: test,
        });

        const { getByText } = renderWithRedux(<EmptyBasketButton />);
        const button = getByText("Empty basket");
        await user.click(button);
        expect(setStateMock).toBeCalledWith(true);
        expect(setStateMock).not.toBeCalledWith(
          expect.objectContaining({ testID: "Are you sure you want to void the basket?" }),
        );
      });

      it("should setModalProp with voidBasketConfirmation constant if voidable  ", async () => {
        jest.spyOn(selector, "useAppSelector").mockReturnValueOnce({ selectedItem, basketItems });
        const user = setupUser();
        const test = jest.fn().mockImplementation(() => {
          return Promise.resolve(true);
        });
        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: false,
          isItemVoidable: jest.fn(),
          isBasketVoidable: test,
        });

        const { getByText } = renderWithRedux(<EmptyBasketButton />);
        const button = getByText("Empty basket");
        await user.click(button);
        expect(setStateMock).toBeCalledWith(
          expect.objectContaining({ testID: "Are you sure you want to void the basket?" }),
        );
      });

      it(" calls setLoadingInactive with void basket if function throws an error", async () => {
        const user = setupUser();
        const test = jest.fn().mockImplementation(() => {
          return Promise.reject();
        });
        const inactiveLoader = jest.spyOn(inactiveLoaderSlice, "setLoadingInactive");
        jest.spyOn(selector, "useAppSelector").mockReturnValueOnce({ selectedItem, basketItems });

        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: false,
          isItemVoidable: jest.fn(),
          isBasketVoidable: test,
        });
        jest.spyOn(networkErrorChecker, "isNetworkError").mockReturnValue(true);
        const showNoNetworkFunc = jest.spyOn(showNoNetworkModalSlice, "showNoNetworkModal");

        const { getByText } = renderWithRedux(<EmptyBasketButton />);
        const button = getByText("Empty basket");
        await user.click(button);
        expect(inactiveLoader).toHaveBeenCalledWith("voidBasket");
        expect(showNoNetworkFunc).toBeCalledTimes(1);
      });
    });
  });
});
