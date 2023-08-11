import { GetPouchDespatchResponseResponse } from "@ct/api/generator";
import reducer, {
  initialpouchDispatchState,
  resetFailureCount,
  updateAvailablePouchData,
  updateFailureCount,
  updateShowAvailablePouches,
  updateValidatedData,
} from "../pouchDispatchFeature.slice";

describe("pouchDispatch reducer", () => {
  it("should handle updateAvailablePouchData", () => {
    const payload = [
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 2000,
            itemID: "656",
            itemQuantity: 0,
            itemValue: 200000,
            materialType: "NOTE",
          },
          "658": {
            currency: "GBP",
            denomination: 500,
            itemID: "658",
            itemQuantity: 0,
            itemValue: 50000,
            materialType: "NOTE",
          },
        },
        pouchID: "360770922150",
        pouchType: "cash",
        status: "prepared",
        totalValue: 250000,
        transactionID: "b1bb8b5b-277d-4527-b3fa-8b399959e900",
        updatedBy: {
          smartID: "test",
          transactionTimestamp: 1681129441,
          userName: "test",
        },
      },
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 2000,
            itemID: "656",
            itemQuantity: 0,
            itemValue: 200000,
            materialType: "NOTE",
          },
          "658": {
            currency: "GBP",
            denomination: 500,
            itemID: "658",
            itemQuantity: 0,
            itemValue: 50000,
            materialType: "NOTE",
          },
        },
        pouchID: "360770922149",
        pouchType: "cash",
        status: "prepared",
        totalValue: 250000,
        transactionID: "18794590-1c88-41fb-9ea8-d68b78cf5be8",
        updatedBy: {
          smartID: "test",
          transactionTimestamp: 1681129441,
          userName: "test",
        },
      },
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 20,
            itemID: "656",
            itemQuantity: 2,
            itemValue: 4000,
          },
          "657": {
            currency: "GBP",
            denomination: 10,
            itemID: "657",
            itemQuantity: 3,
            itemValue: 3000,
          },
        },
        pouchID: "303070554757",
        pouchType: "cash",
        status: "prepared",
        totalValue: 7000,
        transactionID: "ba8f562e-0886-425b-ab2b-a38387977ec1",
        updatedBy: {
          smartID: "S7GW",
          transactionTimestamp: 1682770424,
          userName: "Test User",
        },
      },
    ] as unknown as GetPouchDespatchResponseResponse[];
    const nextState = reducer(initialpouchDispatchState, updateAvailablePouchData(payload));
    expect(nextState.availablePouchData).toEqual(payload);
  });

  it("should handle updateValidatedData", () => {
    const payload = [
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 2000,
            itemID: "656",
            itemQuantity: 0,
            itemValue: 200000,
            materialType: "NOTE",
          },
          "658": {
            currency: "GBP",
            denomination: 500,
            itemID: "658",
            itemQuantity: 0,
            itemValue: 50000,
            materialType: "NOTE",
          },
        },
        pouchID: "360770922150",
        pouchType: "cash",
        status: "prepared",
        totalValue: 250000,
        transactionID: "b1bb8b5b-277d-4527-b3fa-8b399959e900",
        updatedBy: {
          smartID: "test",
          transactionTimestamp: 1681129441,
          userName: "test",
        },
      },
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 2000,
            itemID: "656",
            itemQuantity: 0,
            itemValue: 200000,
            materialType: "NOTE",
          },
          "658": {
            currency: "GBP",
            denomination: 500,
            itemID: "658",
            itemQuantity: 0,
            itemValue: 50000,
            materialType: "NOTE",
          },
        },
        pouchID: "360770922149",
        pouchType: "cash",
        status: "prepared",
        totalValue: 250000,
        transactionID: "18794590-1c88-41fb-9ea8-d68b78cf5be8",
        updatedBy: {
          smartID: "test",
          transactionTimestamp: 1681129441,
          userName: "test",
        },
      },
      {
        assignedBranchID: "2314010",
        itemID: "6286",
        items: {
          "656": {
            currency: "GBP",
            denomination: 20,
            itemID: "656",
            itemQuantity: 2,
            itemValue: 4000,
          },
          "657": {
            currency: "GBP",
            denomination: 10,
            itemID: "657",
            itemQuantity: 3,
            itemValue: 3000,
          },
        },
        pouchID: "303070554757",
        pouchType: "cash",
        status: "prepared",
        totalValue: 7000,
        transactionID: "ba8f562e-0886-425b-ab2b-a38387977ec1",
        updatedBy: {
          smartID: "S7GW",
          transactionTimestamp: 1682770424,
          userName: "Test User",
        },
      },
    ] as unknown as GetPouchDespatchResponseResponse[];
    const nextState = reducer(initialpouchDispatchState, updateValidatedData(payload));
    expect(nextState.validatedData).toEqual(payload);
  });

  it("should handle updateShowAvailablePouches", () => {
    const payload = true;
    const nextState = reducer(initialpouchDispatchState, updateShowAvailablePouches(payload));
    expect(nextState.showAvailablePouches).toEqual(payload);
  });

  it("should handle updateFailureCount", () => {
    const previousState = {
      validatedData: [],
      availablePouchData: [],
      showAvailablePouches: false,
      failureCount: 0,
    };
    const nextState = reducer(previousState, updateFailureCount());
    expect(nextState.failureCount).toEqual(1);
  });

  it("should handle resetFailureCount", () => {
    const previousState = {
      validatedData: [],
      availablePouchData: [],
      showAvailablePouches: false,
      failureCount: 1,
    };
    const nextState = reducer(previousState, resetFailureCount());
    expect(nextState.failureCount).toEqual(0);
  });
});
