import { renderWithRedux } from "@ct/common";
import { ShowAvailablePouch } from "./ShowAvailablePouch";

describe("Render ShowAvailablepouch", () => {
  it("should not show ShowAvailablepouch showAvailablePouches flag is false", () => {
    const { queryByTestId } = renderWithRedux(<ShowAvailablePouch />, {
      updatePouchDispatchList: {
        validatedData: [],
        availablePouchData: [],
        showAvailablePouches: false,
        failureCount: 0,
      },
    });
    expect(queryByTestId("availablePouch")).toBeFalsy();
  });

  it("show ShowAvailablepouch showAvailablePouches flag is true", () => {
    const { getByTestId } = renderWithRedux(<ShowAvailablePouch />, {
      updatePouchDispatchList: {
        validatedData: [],
        availablePouchData: [],
        showAvailablePouches: true,
        failureCount: 0,
      },
    });

    expect(getByTestId("availablePouch")).toBeTruthy();
  });
});
