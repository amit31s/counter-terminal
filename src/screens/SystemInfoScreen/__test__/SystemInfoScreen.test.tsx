import { renderWithRedux } from "@ct/common";
import { SystemInfoScreen } from "../SystemInfoScreen";
import { authMock } from "@ct/utils/MockData/reduxMock";

describe("render SystemInfoScreen", () => {
  it("test system info screen", async () => {
    const { getByTestId } = renderWithRedux(<SystemInfoScreen />, {
      auth: authMock,
    });
    expect(getByTestId("test_GitInfoFeature")).toBeTruthy();
  });
});
