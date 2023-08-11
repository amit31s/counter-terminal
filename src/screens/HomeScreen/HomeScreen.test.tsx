import { act, renderWithRedux, setupUser } from "@ct/common";
import { JourneyEngine } from "postoffice-spm-journey-engine";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../__mocks__/broadcastChannel";
import { HomeScreen } from "./index";

stubBroadcastChannel();

afterEach(async () => {
  clearBroadcastChannelInstances();
});

jest.mock("@ct/utils/Services/RemoteConfigService", () => ({
  remoteConfigService: jest.fn().mockImplementation(() => ({
    isSynced: jest.fn().mockReturnValue(false),
    clear: jest.fn(),
    sync: jest.fn(),
  })),
}));

const mockProvider = jest.spyOn(JourneyEngine, "Provider");

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render home screen left panel with barcode on web", () => {
    const { getByTestId } = renderWithRedux(<HomeScreen />);
    expect(getByTestId("barcode")).toBeTruthy();
  });

  it("sends a reset interrupt on home pressed and modal confirmation", async () => {
    jest.useFakeTimers();
    const user = setupUser(true);
    const { getByText, queryByText } = renderWithRedux(<HomeScreen />);

    expect(queryByText("Return to home")).not.toBeInTheDocument();

    await user.click(getByText("Home"));
    expect(getByText("Return to home")).toBeVisible();

    mockProvider.mockClear();
    await user.click(getByText("Proceed"));
    expect(queryByText("Return to home")).not.toBeInTheDocument();

    expect(mockProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        interruptionInputData: expect.objectContaining({
          type: "reset",
          value: "",
        }),
      }),
      {},
    );
    expect(mockProvider).not.toHaveBeenCalledWith(
      expect.objectContaining({
        interruptionInputData: undefined,
      }),
      {},
    );

    mockProvider.mockClear();
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockProvider).not.toHaveBeenCalledWith(
      expect.objectContaining({
        interruptionInputData: expect.objectContaining({
          type: "reset",
          value: "",
        }),
      }),
      {},
    );
    expect(mockProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        interruptionInputData: undefined,
      }),
      {},
    );

    jest.useRealTimers();
  });

  it("does not send a reset interrupt on home pressed and modal cancellation", async () => {
    const user = setupUser();
    const { getByText, queryByText } = renderWithRedux(<HomeScreen />);

    expect(queryByText("Return to home")).not.toBeInTheDocument();

    await user.click(getByText("Home"));
    expect(getByText("Return to home")).toBeVisible();

    mockProvider.mockClear();
    await user.click(getByText("Cancel"));
    expect(queryByText("Return to home")).not.toBeInTheDocument();

    expect(mockProvider).not.toHaveBeenCalledWith(
      expect.objectContaining({
        interruptionInputData: expect.objectContaining({
          type: "reset",
          value: "",
        }),
      }),
      {},
    );
  });
});
