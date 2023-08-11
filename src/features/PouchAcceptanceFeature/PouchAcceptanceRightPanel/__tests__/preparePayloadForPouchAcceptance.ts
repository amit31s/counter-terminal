import { PouchAcceptanceDetails, PouchType } from "@ct/api/generator";
import * as utils from "@ct/utils/utils";
import { validateAndPreparePayloadForPouchAcceptance } from "../preparePayloadForPouchAcceptance";

const stockunitIdentifier = "S01";
jest.mock("@ct/utils/Storage", () => ({
  ...jest.requireActual("@ct/utils/Storage"),
  getItem: () => stockunitIdentifier,
}));

const fadCode = "2314010";
const pouchBarcode = "311400021589";
const res = {
  id: "311400021589#acceptance",
  stockunitIdentifier: stockunitIdentifier,
  accountReferenceID: "311400021589",
  quantity: 1,
  valueInPence: 1600000,
  additionalItems: [
    {
      itemID: "test",
      valueInPence: -1,
      quantity: -1,
      tokens: { denominationValue: 0, currencyCode: "GBP", materialType: "NOTE" },
    },
  ],
  itemID: "6287",
  transactionMode: 24,
  fadCode: "2314010",
  tokens: {
    assignedBranchID: "assignedBranchID",
    pouchType: "cash",
    pouchBarcode: "311400021589",
    userName: "",
  },
};

const resForDespatch = {
  id: "311400021589#despatch",
  stockunitIdentifier: stockunitIdentifier,
  accountReferenceID: "311400021589",
  quantity: -1,
  valueInPence: -1600000,
  additionalItems: [
    {
      itemID: "test",
      valueInPence: 1,
      quantity: 1,
      tokens: { denominationValue: 0, currencyCode: "GBP", materialType: "NOTE" },
    },
  ],
  itemID: "6287",
  transactionMode: 28,
  fadCode: "2314010",
  tokens: {
    assignedBranchID: "assignedBranchID",
    pouchType: "cash",
    pouchBarcode: "311400021589",
    userName: "",
  },
};

const req: PouchAcceptanceDetails = {
  itemID: "6287",
  items: {
    test: {
      itemID: "test",
      materialType: "NOTE",
      currency: "GBP",
      denomination: 0,
      itemValue: 1,
      itemQuantity: 1,
    },
  },
  status: "expected",
  assignedBranchName: "Meanwood",
  totalValue: 1600000,
  pouchID: pouchBarcode,
  assignedBranchID: "assignedBranchID",
  updatedBy: {},
  isBranchValid: "test",
  isPouchValid: "test",
  isPouchValueAssociated: "test",
  pouchType: "cash",
  transactionID: "test",
};

describe("Testing preparePayloadForPouchAcceptance Service", () => {
  it("Testing validateAndPreparePayloadForPouchAcceptance method", () => {
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);

    const data = validateAndPreparePayloadForPouchAcceptance(req, fadCode, "acceptance");
    expect(data).toStrictEqual(res);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method with despatch type", () => {
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(resForDespatch.id);

    const data = validateAndPreparePayloadForPouchAcceptance(req, fadCode, "despatch");
    expect(data).toStrictEqual(resForDespatch);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without totalValue", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: "6287",
      items: {
        test: {
          itemID: "test",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 0,
          itemValue: 1,
          itemQuantity: 1,
        },
      },
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 0,
      pouchID: pouchBarcode,
      assignedBranchID: "assignedBranchID",
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      pouchType: "cash",
      transactionID: "test",
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without assignedBranchID", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: "6287",
      items: {
        test: {
          itemID: "test",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 0,
          itemValue: 1,
          itemQuantity: 1,
        },
      },
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 1600000,
      pouchID: pouchBarcode,
      assignedBranchID: undefined,
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      pouchType: "cash",
      transactionID: "test",
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without pouchType", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: "6287",
      items: {
        test: {
          itemID: "test",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 0,
          itemValue: 1,
          itemQuantity: 1,
        },
      },
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 1600000,
      pouchID: pouchBarcode,
      assignedBranchID: "assignedBranchID",
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      transactionID: "test",
      pouchType: undefined as unknown as PouchType,
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without pouchID", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: "6287",
      items: {
        test: {
          itemID: "test",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 0,
          itemValue: 1,
          itemQuantity: 1,
        },
      },
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 1600000,
      pouchID: undefined as unknown as string,
      assignedBranchID: "assignedBranchID",
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      transactionID: "test",
      pouchType: "cash",
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without itemID", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: undefined,
      items: {
        test: {
          itemID: "test",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 0,
          itemValue: 1,
          itemQuantity: 1,
        },
      },
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 1600000,
      pouchID: pouchBarcode,
      assignedBranchID: "assignedBranchID",
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      transactionID: "test",
      pouchType: "cash",
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });

  it("Testing validateAndPreparePayloadForPouchAcceptance method without additionalItems", () => {
    const reqWithoutItems: PouchAcceptanceDetails = {
      itemID: undefined,
      items: {},
      status: "expected",
      assignedBranchName: "Meanwood",
      totalValue: 1600000,
      pouchID: pouchBarcode,
      assignedBranchID: "assignedBranchID",
      updatedBy: {},
      isBranchValid: "test",
      isPouchValid: "test",
      isPouchValueAssociated: "test",
      transactionID: "test",
      pouchType: "cash",
    };
    const spy = jest.spyOn(utils, "uuid");
    spy.mockReturnValue(res.id);
    const data = validateAndPreparePayloadForPouchAcceptance(
      reqWithoutItems,
      fadCode,
      "acceptance",
    );
    expect(data).toStrictEqual(undefined);
  });
});
