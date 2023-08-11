import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { GitInfoFeature } from "./GitInfoFeature";
import { authMock } from "@ct/utils/MockData/reduxMock";

describe("Git Info Feature", () => {
  it("should render licence button", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<GitInfoFeature />, {
      auth: authMock,
    });
    expect(getByTestId(stringConstants.GitInfoScreen.checkLicences)).toBeTruthy();
    await user.click(getByTestId(stringConstants.GitInfoScreen.checkLicences));
  });
  it("should render environment variable config button", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<GitInfoFeature />, {
      auth: {
        ...authMock,
        user: {
          id: "TEST",
          provider: "",
          createdAt: 0,
          roles: [{ role: "Admin", fadCode: "123456L" }],
        },
      },
    });
    expect(getByTestId(stringConstants.GitInfoScreen.environmentVariableConfig)).toBeTruthy();
    await user.click(getByTestId(stringConstants.GitInfoScreen.environmentVariableConfig));
  });
  it("should render feature flag config button", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<GitInfoFeature />, {
      auth: {
        ...authMock,
        user: {
          id: "TEST",
          provider: "",
          createdAt: 0,
          roles: [{ role: "Admin", fadCode: "123456L" }],
        },
      },
    });
    expect(getByTestId(stringConstants.GitInfoScreen.featureFlagConfig)).toBeTruthy();
    await user.click(getByTestId(stringConstants.GitInfoScreen.featureFlagConfig));
  });
});
