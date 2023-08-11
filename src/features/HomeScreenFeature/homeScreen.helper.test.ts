import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { SalesReceiptData } from "@ct/common/state/updateSalesReceipt.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { DeviceAttributes } from "@ct/interfaces/device.interface";
import { basketItemMock } from "@ct/utils/MockData";
import { CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import {
  alignSalesPrintData,
  allItemsCommited,
  basketcommitted,
  decideMessage,
  getAggregatedItems,
  getItemTotal,
  getNotInitiatedItems,
  getTransactionStatusText,
  isAggregatedCommitPending,
  isCommitInitiated,
  isCommitPending,
  printFailureCardReceipt,
  syncSelectedItem,
} from "./homeScreen.helper";

import { STATE_CONSTANTS } from "@ct/constants";
import * as utils from "./homeScreen.helper";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Testing homeScreenHelper Service", () => {
  it("Testing basketcommitted failure case with notInitiated", () => {
    const itemsForFailure: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 0,
        voidable: true,
        commitStatus: CommitStatus.notInitiated,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 0,
        source: "nbit",
      },
    ];
    expect(basketcommitted(itemsForFailure)).toBe(false);
  });

  it("Testing basketcommitted success case", () => {
    const itemsForSuccess: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 0,
        voidable: true,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 0,
        source: "nbit",
      },
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 0,
        voidable: true,
        commitStatus: CommitStatus.success,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 0,
        source: "nbit",
        additionalItemsValue: 0,
      },
    ];
    expect(basketcommitted(itemsForSuccess)).toBe(true);
  });

  it("Testing isCommitPending: Should return object when any item failed", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.success;
    }
    basketItem[0].commitStatus = CommitStatus.fail;
    expect(typeof isCommitPending(basketItem)).toBe("object");
  });

  it("Testing isCommitPending: Should return object when commit not initiated  ", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.notInitiated;
    }
    expect(typeof isCommitPending(basketItem)).toBe("object");
  });

  it("Testing isCommitPending: Should return undefined when all item commited", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.success;
    }
    expect(isCommitPending(basketItem)).toBe(undefined);
  });

  it("Testing isAggregatedCommitPending: Should return object when any item failed", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.success;
      obj.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Aggregated;
    }
    basketItem[0].commitStatus = CommitStatus.fail;
    expect(typeof isAggregatedCommitPending(basketItem)).toBe("object");
  });

  it("Testing isAggregatedCommitPending: Should return object when commit not initiated  ", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.notInitiated;
      obj.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Aggregated;
    }
    expect(typeof isAggregatedCommitPending(basketItem)).toBe("object");
  });

  it("Testing isAggregatedCommitPending: Should return undefined when all item commited", () => {
    const basketItem = basketItemMock();
    for (const obj of basketItem) {
      obj.commitStatus = CommitStatus.success;
      obj.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Aggregated;
    }
    expect(isAggregatedCommitPending(basketItem)).toBe(undefined);
  });

  it("Testing getNotInitiatedItems failure case with fail", () => {
    const itemsForFailure: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 0,
        voidable: true,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 0,
        source: "nbit",
      },
    ];
    expect(getNotInitiatedItems(itemsForFailure).count).toBe(0);
  });
  it("Testing getNotInitiatedItems success case with notInitiated", () => {
    const itemsForFailure: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 0,
        voidable: true,
        commitStatus: CommitStatus.notInitiated,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 0,
        source: "nbit",
      },
    ];
    expect(getNotInitiatedItems(itemsForFailure).count).toBe(1);
  });
  it("Testing alignSalesPrintData with all data", () => {
    const basketItems: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 2.01,
        voidable: true,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 2.01,
        source: "nbit",
      },
    ];
    const device: DeviceAttributes = {
      nodeID: "56",
      deviceID: "testname",
      deviceType: "counter",
      branchID: "1348467",
      branchName: "Moulton",
      branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
      branchPostcode: "123654",
      branchUnitCode: "00",
      branchUnitCodeVer: "12",
    };
    const paidByCard = 2.01;
    const paidByCash = 2.01;
    const remainingBalance = 0;
    const postOfficeToPay = 0;
    const customerToPay = 0;
    const receiptData: SalesReceiptData = {
      isSuccessReceipt: true,
      isFailureReceipt: false,
      branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
      fadCode: "134846",
      vatRegNo: "GB 172 6705",
      DateOfIssue: "08/04/2022 11:14",
      sessionId: "6-80125",
      items: [
        { itemTitle: "Postage Stamp", qty: 1, price: "3.25", total: "3.25" },
        { itemTitle: "Ist Class BK x 12", qty: 1, price: "3.25", total: "3.25" },
      ],
      customerToPay: "0",
      postOfficeToPay: "0",
      amountPaidByCard: "5.54",
      amountPaidByCash: "8.00",
      balance: "0",
      empName: "Bimlendu",
      cardDetails: [
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0045\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: A0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n5541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £60.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0046\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: B0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n2541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £50.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0047\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: C0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n4541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £20.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
      ],
    };
    const basketId = "2345-1-4";
    const initialPrintData = {
      basketItems,
      device,
      paidByCard,
      paidByCash,
      remainingBalance,
      postOfficeToPay,
      customerToPay,
      receiptData,
      basketId,
    };
    expect(alignSalesPrintData(initialPrintData).fadCode).toBe("134846");
    expect(alignSalesPrintData(initialPrintData).cardDetails).toStrictEqual([
      "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0045\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: A0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n5541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £60.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
      "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0046\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: B0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n2541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £50.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
      "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0047\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: C0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n4541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £20.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
    ]);
    expect(alignSalesPrintData(initialPrintData).amountPaidByCash).toBe("2.01");
    expect(alignSalesPrintData(initialPrintData).amountPaidByCard).toBe("2.01");
    expect(alignSalesPrintData(initialPrintData).customerToPay).toBe("0");
    expect(alignSalesPrintData(initialPrintData).postOfficeToPay).toBe("0");
    expect(alignSalesPrintData(initialPrintData).balance).toBe("0.00");
  });

  it("Testing balance value should be less then or equal to 0", () => {
    const basketItems: IbasketItem[] = [
      {
        id: "Global Priority Ret: EU344961022GB1657790897440cd0f2259799d",
        item: ["Global Priority Ret: EU344961022GB"],
        quantity: 1,
        total: 2.01,
        voidable: true,
        commitStatus: CommitStatus.fail,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 2.01,
        source: "nbit",
      },
    ];
    const device: DeviceAttributes = {
      nodeID: "56",
      deviceID: "testname",
      deviceType: "counter",
      branchID: "1348467",
      branchName: "Moulton",
      branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
      branchPostcode: "123654",
      branchUnitCode: "00",
      branchUnitCodeVer: "12",
    };
    const paidByCard = 2.01;
    const paidByCash = 2.01;
    const remainingBalance = -2;
    const postOfficeToPay = 0;
    const customerToPay = 0;
    const receiptData: SalesReceiptData = {
      isSuccessReceipt: true,
      isFailureReceipt: false,
      branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
      fadCode: "134846",
      vatRegNo: "GB 172 6705",
      DateOfIssue: "08/04/2022 11:14",
      sessionId: "6-80125",
      items: [
        { itemTitle: "Postage Stamp", qty: 1, price: "3.25", total: "3.25" },
        { itemTitle: "Ist Class BK x 12", qty: 1, price: "3.25", total: "3.25" },
      ],
      customerToPay: "0",
      postOfficeToPay: "0",
      amountPaidByCard: "5.54",
      amountPaidByCash: "8.00",
      balance: "",
      empName: "Bimlendu",
      cardDetails: [
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0045\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: A0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n5541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £60.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0046\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: B0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n2541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £50.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
        "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0047\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: C0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n4541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £20.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n",
      ],
    };
    const basketId = "2345-1-4";
    const initialPrintData = {
      basketItems,
      device,
      paidByCard,
      paidByCash,
      remainingBalance,
      postOfficeToPay,
      customerToPay,
      receiptData,
      basketId,
    };
    expect(-Number(alignSalesPrintData(initialPrintData).balance)).toBeLessThanOrEqual(0);
    expect(alignSalesPrintData(initialPrintData).balance).toBe("2");
  });

  it("Testing syncSelectedItem should return undefined if no match found", () => {
    const mockData = basketItemMock();
    const item = syncSelectedItem("xxxxx", mockData);
    expect(item).toBe(undefined);
  });
  it("Testing syncSelectedItem should return matched item", () => {
    const mockData = basketItemMock();
    const item = syncSelectedItem(mockData[0].id, mockData);
    expect(item).toMatchObject(mockData[0]);
  });
  it("Testing printFailureCardReceipt with all data", () => {
    const device: DeviceAttributes = {
      nodeID: "56",
      deviceID: "testname",
      deviceType: "counter",
      branchID: "1348467",
      branchName: "Moulton",
      branchAddress: "Beximical on sea devoshine square east sunsex TN40 1AA",
      branchPostcode: "123654",
      branchUnitCode: "00",
      branchUnitCodeVer: "12",
    };
    const cardDetails =
      "CARD PAYMENT               \nMasterCard\nCard Number: 541333XXXXXX0045\nICC\nAuth Code: 091605\nMerchant ID: ***99911\nTerminal ID: ****0001\nApplication ID: A0000000041010\nPAN Seq No: 03\n$$$UserData1$$$\nTRX ID: \n4541775942279750928fUKiuZgU04gHXZieEqSqtzR\nlUO\nAmount:                             £50.00\nPIN VERIFIED\n             PAYMENT APPROVED             \n            CARDHOLDER RECEIPT            \n";
    const basketId = "2345-1-4";
    expect(printFailureCardReceipt(cardDetails, basketId, device).sessionId).toBe("2345-1-4");
    expect(printFailureCardReceipt(cardDetails, basketId, device).empName).toBe("TBC");
    expect(printFailureCardReceipt(cardDetails, basketId, device).fadCode).toBe("134846");
  });

  it("Testing isCommitInitiated for single item", () => {
    const mockData = basketItemMock();
    mockData[0].commitStatus = CommitStatus.commitInitiated;
    const item = isCommitInitiated(mockData[0]);
    expect(item).toBe(true);
  });

  it("Testing isCommitInitiated for basket items array", () => {
    const mockData = basketItemMock();
    mockData[0].commitStatus = CommitStatus.commitInitiated;
    const item = isCommitInitiated(mockData);
    expect(item).toBe(true);
  });
  it("Testing isCommitInitiated for basket items array before commit", () => {
    const mockData = basketItemMock();
    const item = isCommitInitiated(mockData);
    expect(item).toBe(false);
  });

  it("Testing allItemsCommited", () => {
    const sussessMock = basketItemMock().map((o) => {
      o.commitStatus = CommitStatus.success;
      return o;
    });

    const failedMock = basketItemMock().map((o) => {
      o.commitStatus = CommitStatus.commitInitiated;
      return o;
    });

    const successRes = allItemsCommited(sussessMock);
    const failedRes = allItemsCommited(failedMock);

    expect(successRes).toBe(true);
    expect(failedRes).toBe(false);
  });

  it("Testing getAggregatedItems without aggregated items", () => {
    const sussessMock = basketItemMock().map((o) => {
      if (o.journeyData?.transaction?.commitAndFulfillPoint) {
        o.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Immediate;
      }
      return o;
    });

    const items = getAggregatedItems(sussessMock);

    expect(items.count).toBe(0);
    expect(items.items).toStrictEqual([]);
  });

  it("Testing getAggregatedItems with aggregated items", () => {
    const sussessMock = basketItemMock().map((o) => {
      if (o.journeyData?.transaction?.commitAndFulfillPoint) {
        console.log("element.journeyData.transaction.commitAndFulfillPoint");

        o.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Aggregated;
      }
      return o;
    });
    for (let index = 0; index < sussessMock.length; index++) {
      const element = sussessMock[index];
      console.log(element.journeyData.transaction.commitAndFulfillPoint);
    }
    const items = getAggregatedItems(sussessMock);

    expect(items.count).toBe(sussessMock.length);
    expect(items.items.length).toStrictEqual(sussessMock.length);
  });

  describe("TxRecoveryModal helpers", () => {
    describe("getTransactionStatusText", () => {
      const cases = [
        ["success", "Successful"],
        ["notRequired", "Successful"],
        ["failure", "Failed"],
        ["pending", "Failed"],
        ["indeterminate", "Failed"],
        ["default", "Failed"],
      ];
      it.each(cases)("fulfillmentStatus(%s) should return %s", (fulfillmentStatus, expected) => {
        expect(getTransactionStatusText(fulfillmentStatus)).toEqual(expected);
      });
    });

    describe("getItemTotal", () => {
      describe("additional items not present", () => {
        it("returns correct value when additional items is an empty array", () => {
          const itemWithNoAdditionalItems = {
            id: "Blind Signed For",
            name: "Blind Signed For",
            commitStatus: "success",
            fulFillmentStatus: "success",
            total: 1.5,
            quantity: 1,
            price: 1.5,
            source: "nbit",
            additionalItemsValue: 0,
            journeyData: {
              transaction: {
                additionalItems: [],
                entryID: "1",
                itemID: "1",
                tokens: {
                  productDescription: "Blind Signed For ",
                  fulfilmentAction: "label",
                  fulfilmentType: "label",
                },
              },
            },
          } as IbasketItem;
          expect(getItemTotal(itemWithNoAdditionalItems)).toBe(1.5);
        });
        it("returns correct value when additional items is missing", () => {
          const itemWithNoAdditionalItems = {
            id: "Blind Signed For",
            name: "Blind Signed For",
            commitStatus: "success",
            fulFillmentStatus: "success",
            total: 1.5,
            quantity: 2,
            price: 1.5,
            source: "nbit",
            additionalItemsValue: 0,
            journeyData: {
              transaction: {
                entryID: "1",
                itemID: "1",
                tokens: {
                  productDescription: "Blind Signed For ",
                  fulfilmentAction: "label",
                  fulfilmentType: "label",
                },
              },
            },
          } as IbasketItem;
          expect(getItemTotal(itemWithNoAdditionalItems)).toBe(3.0);
        });
      });
      describe("additional items present", () => {
        it("returns correct value when additional items are balanced", () => {
          const itemWithAdditionalItems = {
            id: "Blind Signed For",
            name: "Blind Signed For",
            commitStatus: "success",
            fulFillmentStatus: "success",
            total: 1.5,
            quantity: 1,
            price: 1.5,
            source: "nbit",
            additionalItemsValue: 0,
            journeyData: {
              transaction: {
                additionalItems: [
                  {
                    itemID: "1",
                    valueInPence: 150,
                    value: 1.5,
                    quantity: 1,
                    tokens: {},
                  },
                  {
                    itemID: "2",
                    valueInPence: -150,
                    value: -1.5,
                    quantity: 1,
                    tokens: {},
                  },
                ],
                entryID: "1",
                itemID: "1",
                tokens: {
                  productDescription: "Blind Signed For ",
                  fulfilmentAction: "label",
                  fulfilmentType: "label",
                },
              },
            },
          } as IbasketItem;
          expect(getItemTotal(itemWithAdditionalItems)).toBe(1.5);
        });

        it("returns correct value when additional items are un-balanced", () => {
          const itemWithAdditionalItems = {
            id: "Blind Signed For",
            name: "Blind Signed For",
            commitStatus: "success",
            fulFillmentStatus: "success",
            total: 1.5,
            quantity: 1,
            price: 1.5,
            additionalItemsValue: 6,
            source: "nbit",
            journeyData: {
              transaction: {
                additionalItems: [
                  {
                    itemID: "1",
                    valueInPence: 150,
                    value: 1.5,
                    quantity: 1,
                    tokens: {},
                  },
                  {
                    itemID: "2",
                    valueInPence: -150,
                    value: -1.5,
                    quantity: 1,
                    tokens: {},
                  },
                  {
                    itemID: "3",
                    valueInPence: 300,
                    value: 3.0,
                    quantity: 2,
                    tokens: {},
                  },
                ],
                entryID: "1",
                itemID: "1",
                tokens: {
                  productDescription: "Blind Signed For ",
                  fulfilmentAction: "label",
                  fulfilmentType: "label",
                },
              },
            },
          } as IbasketItem;
          expect(getItemTotal(itemWithAdditionalItems)).toBe(7.5);
        });
      });
    });
    describe("decideMessage", () => {
      describe("transactions status is failed", () => {
        it("returns empty string", () => {
          const basketItems = [
            {
              id: "Cash1",
              name: "Cash",
              commitStatus: "success",
              fulFillmentStatus: "failure",
              total: 20,
              quantity: 1,
              price: 20,
              source: "nbit",
              journeyData: {
                transaction: {
                  entryID: "2",
                  itemID: "1",
                  tokens: {
                    productDescription: "Cash",
                  },
                },
              },
              type: "paymentMode",
            },
          ] as IbasketItem[];
          jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Failed");
          expect(decideMessage(basketItems)).toBe("");
        });
      });
      describe("transaction status successful", () => {
        describe("itemID equals cash item ID (1)", () => {
          describe("price greater than 0", () => {
            it("returns confirm payment made message", () => {
              const basketItems = [
                {
                  id: "Cash1",
                  name: "Cash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "1",
                      tokens: {
                        productDescription: "Cash",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been made to the customer.",
              );
            });
          });
          describe("price equals 0", () => {
            it("returns confirm payment received message", () => {
              const basketItems = [
                {
                  id: "Cash1",
                  name: "Cash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 0,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "1",
                      tokens: {
                        productDescription: "Cash",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been received from the customer.",
              );
            });
          });
          describe("price less than 0", () => {
            it("returns confirm payment received message", () => {
              const basketItems = [
                {
                  id: "Cash1",
                  name: "Cash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: -20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "1",
                      tokens: {
                        productDescription: "Cash",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been received from the customer.",
              );
            });
          });
        });
        describe("itemID does not equal cash item ID", () => {
          describe("debit case", () => {
            it("returns confirm payment received message", () => {
              const basketItems = [
                {
                  id: "Debit-NonCash1",
                  name: "NonCash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "2",
                      tokens: {
                        productDescription: "NonCash",
                        fulfilmentAction: "debit",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been received from the customer.",
              );
            });
          });
          describe("deposit case", () => {
            it("returns confirm payment received message", () => {
              const basketItems = [
                {
                  id: "Deposit-NonCash1",
                  name: "NonCash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "2",
                      tokens: {
                        productDescription: "NonCash",
                        fulfilmentAction: "deposit",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been received from the customer.",
              );
            });
          });
          describe("withdrawal case", () => {
            it("returns confirm payment made message", () => {
              const basketItems = [
                {
                  id: "Deposit-NonCash1",
                  name: "NonCash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "2",
                      tokens: {
                        productDescription: "NonCash",
                        fulfilmentAction: "withdrawal",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that payment has been made to the customer.",
              );
            });
          });
          describe("label print case ", () => {
            it("returns confirm payment received message", () => {
              const basketItems = [
                {
                  id: "Deposit-NonCash1",
                  name: "NonCash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "2",
                      tokens: {
                        productDescription: "NonCash",
                        fulfilmentAction: "label",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe(
                "Please confirm that the label was printed successfully.",
              );
            });
          });
          describe("default case", () => {
            it("returns an empty string if no prior conditions met", () => {
              const basketItems = [
                {
                  id: "Deposit-NonCash1",
                  name: "NonCash",
                  commitStatus: "success",
                  fulFillmentStatus: "success",
                  total: 20,
                  quantity: 1,
                  price: 20,
                  source: "nbit",
                  journeyData: {
                    transaction: {
                      entryID: "2",
                      itemID: "2",
                      tokens: {
                        productDescription: "NonCash",
                        fulfilmentAction: "default-case",
                      },
                    },
                  },
                  type: "paymentMode",
                },
              ] as IbasketItem[];
              jest.spyOn(utils, "getTransactionStatusText").mockReturnValue("Successful");
              expect(decideMessage(basketItems)).toBe("");
            });
          });
        });
      });
    });
  });
  it("Should return chequeUUID", () => {
    const localUUID = "56a582d2-10e0-11ee-be56-0242ac120002";
    const item: IbasketItem = {
      id: STATE_CONSTANTS.CHEQUE,
      item: [STATE_CONSTANTS.CHEQUE],
      quantity: 1,
      total: 0,
      voidable: true,
      commitStatus: CommitStatus.notInitiated,
      additionalItemsValue: 0,
      fulFillmentStatus: "fulfillmentNotInitiated",
      price: 0,
      source: "nbit",
      localUUID: localUUID,
    };
    const id = utils.chequeUUID(item);
    expect(id).toEqual(STATE_CONSTANTS.CHEQUE + localUUID);
  });
});
