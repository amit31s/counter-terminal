import { renderWithRedux } from "@ct/common";
import { EnvironmentVariableConfigScreen } from "./EnvironmentVariableConfigScreen";

describe("environment variable config screen tests", () => {
  it("renders correctly", async () => {
    renderWithRedux(<EnvironmentVariableConfigScreen />);
  });
});
