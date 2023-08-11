import { renderWithRedux } from "@ct/common";
import { AuthRoutes } from "../AuthRoutes";
import { authMock } from "@ct/utils/MockData/reduxMock";
import * as useCheckBranchPermission from "../useCheckBranchPermission";

const mockLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockLocation,
}));

jest.mock("is-electron", () => {
  return {
    __esModule: true,
    default: jest.fn(() => true),
  };
});

jest.mock("@ct/common/hooks/useIdleTimer", () => ({
  useIdleTimerHooks: () => ({
    start: jest.fn(),
  }),
}));

describe("AuthRoutes ", () => {
  it("should render loading", () => {
    const { getByTestId } = renderWithRedux(
      <AuthRoutes>
        <div />
      </AuthRoutes>,
      {
        auth: authMock,
      },
    );
    expect(getByTestId("test-loading-component")).toBeTruthy();
  });
  it("should render user login", () => {
    renderWithRedux(
      <AuthRoutes>
        <div />
      </AuthRoutes>,
      {
        auth: {
          ...authMock,
          isDeviceRegistered: true,
          authStatus: "userChecked",
        },
      },
    );
    setTimeout(() => {
      expect(mockLocation).toBeCalled();
    }, 1000);
  });
  it("should render not allowed to this Branch", () => {
    renderWithRedux(
      <AuthRoutes>
        <div />
      </AuthRoutes>,
      {
        auth: {
          ...authMock,
          isDeviceRegistered: true,
          isUserLoggedIn: true,
        },
      },
    );
    setTimeout(() => {
      expect(mockLocation).toBeCalled();
    }, 1000);
  });

  it("should render child component", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require("is-electron"), "default").mockReturnValue(false);
    jest.spyOn(useCheckBranchPermission, "useCheckBranchPermission").mockReturnValue(true);
    const { getByText } = renderWithRedux(
      <AuthRoutes>
        <div>Child component</div>
      </AuthRoutes>,
      {
        auth: {
          ...authMock,
          isDeviceRegistered: true,
          isUserLoggedIn: true,
        },
      },
    );
    setTimeout(() => {
      expect(getByText("Child component")).toBeInTheDocument();
    }, 1000);
  });
  it("should render outlet component", () => {
    jest.spyOn(useCheckBranchPermission, "useCheckBranchPermission").mockReturnValue(true);
    const { getByText } = renderWithRedux(<AuthRoutes />, {
      auth: {
        ...authMock,
        isDeviceRegistered: true,
        isUserLoggedIn: true,
      },
    });
    setTimeout(() => {
      expect(getByText("Child component")).toBeInTheDocument();
    }, 1000);
  });
});
