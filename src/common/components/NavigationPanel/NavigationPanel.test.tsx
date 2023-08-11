import { renderWithRedux, setupUser, waitFor } from "@ct/common";
import * as mockSuspendedBasket from "@ct/common/hooks/homeScreenHooks/useGetSuspendedBasket";
import * as mockVoidItemOrBasket from "@ct/common/hooks/homeScreenHooks/useVoidItemOrBasket";
import * as mockSelector from "@ct/common/hooks/useAppSelector";
import * as mockNetworkFailureModal from "@ct/common/state/common/noNetwork.slice";
import { SCREENS, STRING_CONSTANTS, TEXT } from "@ct/constants";
import { EntryType } from "@ct/interfaces";
import * as mockClearSuspendedBasket from "@ct/utils/Services/homeService";
import * as mockNetworkError from "@ct/utils/utils";
import { IbasketItem } from "postoffice-prepare-receipt-context/dist/mails/types";
import React from "react";
import { NavigationPanel } from "./NavigationPanel";

afterEach(() => jest.clearAllMocks());

const setStateMock = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStateMock: any = (useState: any) => [useState, setStateMock];
jest.spyOn(React, "useState").mockImplementation(useStateMock);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actualNav = jest.requireActual("react-router-dom");
  return {
    ...actualNav,
    useNavigate: () => mockNavigate,
  };
});
describe("Navigation Panel", () => {
  describe("rendering", () => {
    const mockItemPressed = jest.fn();
    it("should render navigation panel", async () => {
      const { getByTestId } = renderWithRedux(
        <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
      );
      const navigationPanelLayout = getByTestId("navigationPanelLayout");
      expect(navigationPanelLayout).toBeTruthy();
    });

    it("should render navigation panel touchable click", async () => {
      const { getByTestId } = renderWithRedux(
        <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
      );
      const navigationPanelTouchable = getByTestId("navigationPanelBackground");
      expect(navigationPanelTouchable).toBeTruthy();
    });

    it("should close the panel when clicked off of the buttons", async () => {
      const user = setupUser();
      const { getByTestId } = renderWithRedux(
        <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
      );
      const navigationPanelTouchable = getByTestId("navigationPanelBackground");
      await user.click(navigationPanelTouchable);
      expect(mockItemPressed).toBeCalledWith(false);
    });
  });
  describe("button click events", () => {
    describe("cash transfer out button", () => {
      describe("empty basket", () => {
        it("navigates to cash transfer out screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const cashTransferOutButton = getByTestId("navigation_panel_item_Cash transfer out");
          await user.click(cashTransferOutButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.CASH_TRANSFER);
        });
      });
    });

    describe("devices button", () => {
      describe("basket in progress", () => {
        it("navigates to devices screen", async () => {
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

          const mockBranchData = { branchID: "1234", branchName: "any", branchPostCode: "any" };

          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce(mockBranchData);
          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce({ basketItems });
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const devicesButton = getByTestId("navigation_panel_item_Devices");
          await user.click(devicesButton);
          await waitFor(() => {
            expect(mockNavigate).toBeCalledWith(SCREENS.PMS_MODULE);
          });
        });
      });

      describe("empty basket", () => {
        it("navigates to devices screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const devicesButton = getByTestId("navigation_panel_item_Devices");
          await user.click(devicesButton);
          await waitFor(() => {
            expect(mockNavigate).toBeCalledWith(SCREENS.PMS_MODULE);
          });
        });
      });
    });
    describe("licenses button", () => {
      describe("in progress basket", () => {
        it("navigates to licenses screen", async () => {
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

          const mockBranchData = { branchID: "1234", branchName: "any", branchPostCode: "any" };
          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce(mockBranchData);
          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce({ basketItems });
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { findByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const licensesButton = await findByTestId("navigation_panel_item_Licences");
          await user.click(licensesButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.LICENCE_INFO);
        });
      });
      describe("empty basket", () => {
        it("navigates to licenses screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { findByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const licensesButton = await findByTestId("navigation_panel_item_Licences");
          await user.click(licensesButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.LICENCE_INFO);
        });
      });
    });
    describe("log off button", () => {
      describe("empty basket", () => {
        it("sets logoff confirmation modal content", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const logOffButton = getByTestId("navigation_panel_item_Log off");
          await user.click(logOffButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: STRING_CONSTANTS.logoutModalTxt }),
            );
          });
        });
      });
      describe("suspended basket", () => {
        it("sets unable to logoff modal content", async () => {
          const suspendBasketMockReturn = {
            suspendedBasket: { item: [], time: 1, expireAt: 1 },
            existsSuspendBasket: true,
            setExistsSuspendBasket: jest.fn(),
            setSuspendedBasket: jest.fn(),
          };
          const user = setupUser();
          const mockItemPressed = jest.fn();
          jest
            .spyOn(mockSuspendedBasket, "useGetSuspendedBasket")
            .mockReturnValue(suspendBasketMockReturn);
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const logOffButton = getByTestId("navigation_panel_item_Log off");
          await user.click(logOffButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: STRING_CONSTANTS.logOffMsgIfSuspendedBasket }),
            );
          });
        });
      });
    });
    describe("log out cash drawer button", () => {
      describe("error case", () => {
        it("loads unauthorised modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { findByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const logOutButton = await findByTestId("navigation_panel_item_Logout cash drawer");
          await user.click(logOutButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalled();
          });
        });
      });
    });
    describe("pouch acceptance button", () => {
      describe("empty basket", () => {
        it("does navigates to pouch acceptance screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const pouchAcceptanceButton = getByTestId("navigation_panel_item_Pouch acceptance");
          await user.click(pouchAcceptanceButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.POUCH_ACCEPTANCE);
        });
      });
    });
    describe("pouch dispatch button", () => {
      describe("empty basket", () => {
        it("navigates to pouch dispatch screen ", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const pouchDespatchButton = getByTestId("navigation_panel_item_Pouch dispatch");
          await user.click(pouchDespatchButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.POUCH_DESPATCH);
        });
      });
    });
    describe("recall basket button", () => {
      describe("suspended basket exists", () => {
        it("triggers updateData after recall basket function", async () => {
          const suspendBasketMockReturn = {
            suspendedBasket: { item: [], time: 1, expireAt: 1 },
            existsSuspendBasket: true,
            setExistsSuspendBasket: jest.fn(),
            setSuspendedBasket: jest.fn(),
          };
          const user = setupUser();
          const mockItemPressed = jest.fn();
          jest
            .spyOn(mockSuspendedBasket, "useGetSuspendedBasket")
            .mockReturnValue(suspendBasketMockReturn);
          const clearSuspendedBasketFunc = jest.spyOn(
            mockClearSuspendedBasket,
            "clearSuspendedBasket",
          );
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const recallBasketButton = getByTestId("navigation_panel_item_Recall basket");
          await user.click(recallBasketButton);
          expect(clearSuspendedBasketFunc).toBeCalledTimes(1);
        });
      });
      describe("suspended basket does not exists", () => {
        it("does not trigger updateData after recall basket function", async () => {
          const suspendBasketMockReturn = {
            suspendedBasket: { item: [], time: 1, expireAt: 1 },
            existsSuspendBasket: false,
            setExistsSuspendBasket: jest.fn(),
            setSuspendedBasket: jest.fn(),
          };
          const user = setupUser();
          const mockItemPressed = jest.fn();
          jest
            .spyOn(mockSuspendedBasket, "useGetSuspendedBasket")
            .mockReturnValue(suspendBasketMockReturn);
          const clearSuspendedBasketFunc = jest.spyOn(
            mockClearSuspendedBasket,
            "clearSuspendedBasket",
          );
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const recallBasketButton = getByTestId("navigation_panel_item_Recall basket");
          await user.click(recallBasketButton);
          expect(clearSuspendedBasketFunc).toBeCalledTimes(0);
        });
      });
    });
    describe("reprint receipt button", () => {
      describe("empty basket", () => {
        it("navigates to reprint receipt screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const cashTransferOutButton = getByTestId("navigation_panel_item_Reprint receipt");
          await user.click(cashTransferOutButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.RECEIPT);
        });
      });
    });
    describe("suspend basket button", () => {
      describe("basket in progress", () => {
        describe("success case", () => {
          it("generates modal warning for suspending active basket", async () => {
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

            const isVoidableMock = {
              isDisabled: true,
              isItemVoidable: jest.fn(),
              isBasketVoidable: jest.fn(() => Promise.resolve(true)),
            };
            const mockBranchData = { branchID: "1234", branchName: "any", branchPostCode: "any" };
            jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce(mockBranchData);
            jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce({ basketItems });
            jest.spyOn(mockVoidItemOrBasket, "useVoidItemOrBasket").mockReturnValue(isVoidableMock);
            const user = setupUser();
            const mockItemPressed = jest.fn();
            const { getByTestId } = renderWithRedux(
              <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
            );
            const suspendBasketButton = getByTestId("navigation_panel_item_Suspend basket");
            await user.click(suspendBasketButton);
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ content: TEXT.CTTXT00074 }),
            );
          });
        });
        describe("errors", () => {
          it("triggers showNoNetwork modal if error is due no network", async () => {
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

            const isVoidableMock = {
              isDisabled: true,
              isItemVoidable: jest.fn(),
              isBasketVoidable: jest.fn(() => Promise.reject()),
            };
            const mockBranchData = { branchID: "1234", branchName: "any", branchPostCode: "any" };
            jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce(mockBranchData);
            jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce({ basketItems });
            jest.spyOn(mockVoidItemOrBasket, "useVoidItemOrBasket").mockReturnValue(isVoidableMock);
            jest.spyOn(mockNetworkError, "isNetworkError").mockReturnValue(true);
            const networkFailModal = jest.spyOn(mockNetworkFailureModal, "showNoNetworkModal");
            const user = setupUser();
            const mockItemPressed = jest.fn();
            const { getByTestId } = renderWithRedux(
              <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
            );
            const suspendBasketButton = getByTestId("navigation_panel_item_Suspend basket");
            await user.click(suspendBasketButton);
            await waitFor(() => {
              expect(networkFailModal).toBeCalledTimes(1);
            });
          });
        });
      });
    });
    describe("system info", () => {
      describe("basket in progress", () => {
        it("navigates to the system info screen", async () => {
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

          const mockBranchData = { branchID: "1234", branchName: "any", branchPostCode: "any" };
          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce(mockBranchData);
          jest.spyOn(mockSelector, "useAppSelector").mockReturnValueOnce({ basketItems });
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const systemInfoButton = getByTestId("navigation_panel_item_System info");
          await user.click(systemInfoButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.SYSTEM_INFO);
        });
      });
      describe("basket empty", () => {
        it("navigates to the system info screen", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const systemInfoButton = getByTestId("navigation_panel_item_System info");
          await user.click(systemInfoButton);
          expect(mockNavigate).toBeCalledWith(SCREENS.SYSTEM_INFO);
        });
      });
    });

    describe("undefined work in progress buttons", () => {
      describe("Reversals", () => {
        it("calls development in progress error modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const reversalButton = getByTestId("navigation_panel_item_Reversal");
          await user.click(reversalButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: TEXT.CTTXT00079 }),
            );
          });
        });
      });
      describe("Stock check", () => {
        it("calls development in progress error modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const stockCheckButton = getByTestId("navigation_panel_item_Stock check");
          await user.click(stockCheckButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: TEXT.CTTXT00079 }),
            );
          });
        });
      });
      describe("Transaction log", () => {
        it("calls development in progress error modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const transactionLogButton = getByTestId("navigation_panel_item_Transaction log");
          await user.click(transactionLogButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: TEXT.CTTXT00079 }),
            );
          });
        });
      });
      describe("Cheque cut off", () => {
        it("calls development in progress error modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const chequeCutOffButton = getByTestId("navigation_panel_item_Cheque cut off");
          await user.click(chequeCutOffButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: TEXT.CTTXT00079 }),
            );
          });
        });
      });
      describe("Cash Balance", () => {
        it("calls development in progress error modal", async () => {
          const user = setupUser();
          const mockItemPressed = jest.fn();
          const { getByTestId } = renderWithRedux(
            <NavigationPanel setShowNavigationMenu={mockItemPressed} />,
          );
          const cashBalanceButton = getByTestId("navigation_panel_item_Cash balance");
          await user.click(cashBalanceButton);
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({ title: TEXT.CTTXT00079 }),
            );
          });
        });
      });
    });
  });
});
