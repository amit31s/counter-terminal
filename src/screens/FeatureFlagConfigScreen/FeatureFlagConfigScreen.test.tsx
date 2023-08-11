import { renderWithRedux } from "@ct/common";
import { FeatureFlagConfigScreen } from "./FeatureFlagConfigScreen";

describe("feature flag config screen tests", () => {
  it("renders correctly", async () => {
    renderWithRedux(<FeatureFlagConfigScreen />);
  });
});
