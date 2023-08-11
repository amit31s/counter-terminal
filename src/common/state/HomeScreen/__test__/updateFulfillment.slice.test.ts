import reducer, {
  FulFillmentItem,
  FulfillmentStatusEnum,
  resetFulfillment,
  updateFulfillment,
  UpdateFulfillmentState,
} from "../updateFulfillment.slice";

const mockFulfillmentItem: FulFillmentItem = {
  id: "test-fulfillmentItem",
  fulfillmentStatus: FulfillmentStatusEnum.NOT_INITIATED,
  error: "test-error",
};

const mockState: UpdateFulfillmentState = {
  fulfillmentRequired: false,
  item: [mockFulfillmentItem],
  fulfillmentStatus: FulfillmentStatusEnum.SUCCESS,
  deviceId: "test-device-id",
};
const mockInitialState: UpdateFulfillmentState = {
  fulfillmentRequired: false,
  item: [],
  fulfillmentStatus: FulfillmentStatusEnum.NOT_INITIATED,
  deviceId: "",
};

describe("render updateFulfillment slice", () => {
  test("test updateFulfillment and resetFulfillment", () => {
    const updateAction = updateFulfillment(mockState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.item.length).toBe(1);

    const action = resetFulfillment(mockInitialState);
    const result = reducer(mockInitialState, action);
    expect(result.item.length).toBe(0);
  });
});
