import { renderHook } from "@ct/common";
import { useGetTimer } from "../useGetTimer";

describe("useGetTimer", () => {
  it("should return minutes and seconds", async () => {
    // Arrange
    const showSuspendBasketNotification = true;

    // Act
    const { result } = renderHook(() => useGetTimer(showSuspendBasketNotification));

    // Assert
    expect(result.current.minutes).toBeDefined();
    expect(result.current.seconds).toBeDefined();
  });
});
