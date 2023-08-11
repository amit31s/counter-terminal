import { renderWithRedux } from "@ct/common";
import { AuthRedirect } from "../AuthRedirect";
import { authMock } from "@ct/utils/MockData/reduxMock";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
jest.mock("@ct/utils/Storage", () => ({
  ...jest.requireActual("@ct/utils/Storage"),
  getItem: () => null,
}));

jest.mock("@ct/common/backendUrl", () => {
  const originalModule = jest.requireActual("@ct/common/backendUrl");
  return {
    __esModule: true,
    ...originalModule,
    INITIALISE_PED_ON_LOGIN: true,
    POL_DEVICE_SERVER_SIMULATED: false,
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const routerDom = require("react-router-dom");
describe("AuthRedirect", () => {
  it("should render failed message", () => {
    jest.spyOn(routerDom, "useSearchParams").mockImplementation(() => [new Map()]);
    const { getByText } = renderWithRedux(<AuthRedirect />, {
      auth: authMock,
    });
    expect(getByText("Failed to load user information. Try again")).toBeInTheDocument();
  });
  it("should render redirecting message", () => {
    jest
      .spyOn(routerDom, "useSearchParams")
      .mockImplementation(() => [
        new Map([
          [
            "CognitoIdentityServiceProvider.3cik6dslnf1b6fj9qcanpgojqp.LastAuthUser",
            "forgerock_DDPN",
          ],
        ]),
      ]);
    jest.spyOn(routerDom, "useLocation").mockImplementation(() => ({
      state: {
        "/login": "login",
      },
    }));
    const { getByText } = renderWithRedux(<AuthRedirect />);
    expect(getByText("Redirecting...")).toBeInTheDocument();
  });
  it("should navigate to cash drawer screen", () => {
    jest
      .spyOn(routerDom, "useSearchParams")
      .mockImplementation(() => [
        new Map([
          [
            "CognitoIdentityServiceProvider.3cik6dslnf1b6fj9qcanpgojqp.LastAuthUser",
            "forgerock_DDPN",
          ],
        ]),
      ]);
    renderWithRedux(<AuthRedirect />, {
      auth: authMock,
    });
    expect(mockNavigate).toBeCalled();
  });
  it("should navigate to home screen", () => {
    jest
      .spyOn(routerDom, "useSearchParams")
      .mockImplementation(() => [
        new Map([
          [
            "CognitoIdentityServiceProvider.3cik6dslnf1b6fj9qcanpgojqp.LastAuthUser",
            "forgerock_DDPN",
          ],
        ]),
      ]);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require("@ct/utils/Storage"), "getItem").mockImplementation(() => "test");
    renderWithRedux(<AuthRedirect />, {
      auth: authMock,
    });
    expect(mockNavigate).toBeCalled();
  });
});
