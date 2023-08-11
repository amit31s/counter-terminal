import { renderWithRedux } from "@ct/common";
import { defaultPaymentStatusData } from "@ct/common/state/initialStateData";
import { STATE_CONSTANTS, STRING_CONSTANTS } from "@ct/constants";
import {
  clearBroadcastChannelInstances,
  stubBroadcastChannel,
} from "../../../../__mocks__/broadcastChannel";
import { HomeScreenLeftPanel } from "./HomeScreenLeftPanel";

stubBroadcastChannel();

jest.mock("@ct/utils/Services/RemoteConfigService", () => ({
  remoteConfigService: jest.fn().mockImplementation(() => ({
    isSynced: jest.fn().mockReturnValue(false),
    clear: jest.fn(),
    sync: jest.fn(),
  })),
}));

describe("HomeScreenLeftPanel", () => {
  afterEach(async () => {
    clearBroadcastChannelInstances();
  });

  it("should render home screen left panel with barcode", () => {
    const { getByTestId } = renderWithRedux(<HomeScreenLeftPanel />);
    expect(getByTestId("barcode")).toBeTruthy();
  });

  it("should render home screen left panel with quick tendering when state is tendering", () => {
    const { getByText } = renderWithRedux(<HomeScreenLeftPanel />, {
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_TENDERING,
        completeClicked: false,
        time: 0,
      },
    });
    expect(getByText("Cash Quick Tendering")).toBeTruthy();
  });

  it("should render home screen left panel with quick tendering when state is repay", () => {
    const { getByText } = renderWithRedux(<HomeScreenLeftPanel />, {
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_REPAY,
        completeClicked: false,
        time: 0,
      },
    });
    expect(getByText("Cash Quick Tendering")).toBeTruthy();
  });

  it("should render home screen left panel with refund", () => {
    const { getByTestId } = renderWithRedux(<HomeScreenLeftPanel />, {
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_REFUND,
        completeClicked: false,
        time: 0,
      },
    });
    expect(getByTestId("refundView")).toBeTruthy();
  });

  it("should render home screen left panel with transaction completed", () => {
    const { getByText } = renderWithRedux(<HomeScreenLeftPanel />, {
      updatePaymentStatus: { ...defaultPaymentStatusData(), completed: true },
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_COMPLETED,
        completeClicked: false,
        time: 0,
      },
    });
    expect(getByText(STRING_CONSTANTS.transactionComplete)).toBeTruthy();
  });
});
