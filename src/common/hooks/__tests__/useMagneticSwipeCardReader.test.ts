import { renderHook } from "@ct/common";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../../__mocks__/broadcastChannel";
import { maskValue, useMagneticSwipeCardReader } from "../useMagneticSwipeCardReader";

stubBroadcastChannel();

jest.doMock("@ct/common/backendUrl", () => {
  const originalModule = jest.requireActual("@ct/common/backendUrl");
  return {
    __esModule: true,
    ...originalModule,
    POL_DEVICE_SERVER_SIMULATED: true,
  };
});

afterEach(async () => {
  clearBroadcastChannelInstances();
});

describe("useMagneticSwipeCardReader", () => {
  it("should return swiped value when scanned", () => {
    const expectedValue = "12345678";

    renderHook(() =>
      useMagneticSwipeCardReader({
        onSwipe(cardValue: string) {
          expect(cardValue).toEqual(expectedValue);
        },
      }),
    );

    setTimeout(() => {
      const channel = new BroadcastChannel("MSR");
      channel.postMessage(expectedValue);
    }, 50);
  });

  it("should mask value", () => {
    expect(maskValue("1234567891234567")).toEqual("1234*******34567");
  });
});
