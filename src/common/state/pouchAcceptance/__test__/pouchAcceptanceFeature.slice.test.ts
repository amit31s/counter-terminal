import { PouchAcceptanceDetails, PouchAcceptanceDetailsItems } from "@ct/api/generator";
import reducer, {
  PouchAcceptanceState,
  resetPouchAcceptanceList,
  setShowAvailablePouches,
  setZerovaluePouch,
} from "../pouchAcceptanceFeature.slice";
const mockAdditionalItem: PouchAcceptanceDetailsItems = {
  test: {
    itemID: "test",
    materialType: "NOTE",
    currency: "GBP",
    denomination: 0,
    itemValue: 0,
    itemQuantity: 0,
  },
};

const mockPouchDTO: PouchAcceptanceDetails = {
  items: mockAdditionalItem,
  pouchID: "test-pouchID",
  pouchType: "cash",
  totalValue: 0,
  assignedBranchID: "test",
  assignedBranchName: "test",
  status: "expected",
  updatedBy: {},
  itemID: "test",
  isBranchValid: "test",
  isPouchValid: "test",
  isPouchValueAssociated: "test",
  transactionID: "test",
};

const mockInitialState: PouchAcceptanceState = {
  data: null,
  validatedData: [],
  showAvailablePouches: false,
  availablePouchData: [],
};

describe("render pouchAcceptanctFeature slice", () => {
  test("test setShowAvailablePouches and resetPouchAcceptanceList", () => {
    const updateAction = setShowAvailablePouches(true);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.showAvailablePouches).toBe(true);

    const action = resetPouchAcceptanceList();
    const result = reducer(mockInitialState, action);
    expect(result.showAvailablePouches).toBe(false);
  });

  test("test setZerovaluePouch", () => {
    const updateAction = setZerovaluePouch(mockPouchDTO);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.data?.pouchID).toBe("test-pouchID");
  });
});
