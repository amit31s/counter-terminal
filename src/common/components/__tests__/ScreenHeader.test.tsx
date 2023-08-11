import { renderWithRedux, renderWithReduxAndStore, setupUser } from "@ct/common";
import { generateBackOfficeURL } from "@ct/common/backOfficeUrl";
import { envProvider } from "@ct/common/platformHelper";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import { SCREENS } from "@ct/constants";
import { ScreenHeader } from "../ScreenHeader";

let mPathName = "/";
const mNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actualNav = jest.requireActual("react-router-dom");
  return {
    ...actualNav,
    useLocation: () => ({ pathname: mPathName }),
    useNavigate: () => mNavigate,
  };
});

jest.mock("@ct/common/backOfficeUrl");
const mockGenerateBackOfficeUrl = jest.mocked(generateBackOfficeURL);
const onNavButtonPress = jest.fn();

describe("Screen Header", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    envProvider.REACT_APP_USING_ELECTRON = "false";
    mPathName = "/";
  });

  it("should render screen header title", async () => {
    const { getByText } = renderWithRedux(
      <ScreenHeader title="mock-title" onNavButtonPress={onNavButtonPress} />,
    );
    expect(getByText("mock-title")).toBeTruthy();
  });

  it("home button should navigate home", async () => {
    const user = setupUser();
    const { getByText } = renderWithRedux(<ScreenHeader onNavButtonPress={onNavButtonPress} />);
    await user.click(getByText("Home"));
    expect(mNavigate).toHaveBeenCalledWith({ pathname: SCREENS.HOME }, { state: { from: "/" } });
  });

  it("should hide home button when requested", async () => {
    const { getByText, queryByText } = renderWithRedux(
      <ScreenHeader title="mock-title" hideHome onNavButtonPress={onNavButtonPress} />,
    );
    expect(queryByText("Home")).not.toBeInTheDocument();
    expect(getByText("mock-title")).toBeInTheDocument();
  });

  it("calls custom on home press", async () => {
    const user = setupUser();
    const handleHomePress = jest.fn();
    const { getByText } = renderWithRedux(
      <ScreenHeader
        title="mock-title"
        onHomePress={handleHomePress}
        onNavButtonPress={onNavButtonPress}
      />,
    );
    await user.click(getByText("Home"));
    expect(handleHomePress).toHaveBeenCalledTimes(1);
  });

  it("opens back office on electron", async () => {
    const mockLaunchBo = jest.fn();
    envProvider.REACT_APP_USING_ELECTRON = "true";
    window.electronAPI = {
      launchBo: mockLaunchBo,
      launchCt: jest.fn(),
      deeplink: jest.fn(),
      getSerialNumber: jest.fn(),
      saveLoginDetails: jest.fn(),
      logger: jest.fn(),
      onResume: jest.fn(),
      clearData: jest.fn(),
      requestPresignedUrls: jest.fn(),
      sendPresignedUrls: jest.fn(),
      restartApp: jest.fn(),
    };

    const user = setupUser();
    const { getByText } = renderWithRedux(
      <ScreenHeader title="mock-title" onNavButtonPress={onNavButtonPress} />,
    );
    await user.click(getByText("Back Office"));
    expect(mockLaunchBo).toHaveBeenCalledTimes(1);
  });

  it("opens back office on web", async () => {
    mockGenerateBackOfficeUrl.mockReturnValue("back office url");
    const openSpy = jest.spyOn(window, "open");

    const user = setupUser();
    const { getByText } = renderWithRedux(
      <ScreenHeader title="mock-title" onNavButtonPress={onNavButtonPress} />,
    );
    await user.click(getByText("Back Office"));
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith("back office url");
  });

  it("toggles touch keyboard enabled state", async () => {
    const user = setupUser();
    const {
      store,
      rendered: { getByText, queryByText },
    } = renderWithReduxAndStore(<ScreenHeader onNavButtonPress={onNavButtonPress} />, {
      touchKeyboard: { enabled: false },
    });

    expect(getByText("keyboard_off")).toBeInTheDocument();

    await user.click(getByText("Keypad"));
    expect(store.getState().touchKeyboard.enabled).toBe(true);
    expect(queryByText("keyboard_off")).not.toBeInTheDocument();

    await user.click(getByText("Keypad"));
    expect(store.getState().touchKeyboard.enabled).toBe(false);
    expect(getByText("keyboard_off")).toBeInTheDocument();
  });

  it("calls logout", async () => {
    const user = setupUser();
    const {
      rendered: { getByText },
      store,
    } = renderWithReduxAndStore(
      <ScreenHeader title="mock-title" onNavButtonPress={onNavButtonPress} />,
      {
        auth: {
          user: null,
          userTokenData: null,
          device: {
            nodeID: "",
            deviceID: "",
            deviceType: "",
            branchID: "",
            branchName: "",
            branchAddress: "",
            branchPostcode: "",
            branchUnitCode: "",
            branchUnitCodeVer: "",
          },
          isUserLoggedIn: true,
          session: null,
          loading: false,
          error: null,
          deviceError: null,
          initialScreen: undefined,
          isDeviceRegistered: true,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          userLoginStarted: false,
        },
      },
    );
    await user.click(getByText("Lock"));
    expect(store.getState().auth.isUserLoggedIn).toBe(false);
  });

  it("calls menu press on buttons pressed", async () => {
    const mockHandleMenuPress = jest.fn();
    const user = setupUser();
    const { getByText } = renderWithRedux(<ScreenHeader onNavButtonPress={mockHandleMenuPress} />);

    await user.click(getByText("Menu"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("Menu");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(1);

    await user.click(getByText("Home"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("Home");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(2);

    await user.click(getByText("Keypad"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("Keypad");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(3);

    await user.click(getByText("Back Office"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("BackOffice");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(4);

    await user.click(getByText("Help"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("Help");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(5);

    await user.click(getByText("Lock"));
    expect(mockHandleMenuPress).toHaveBeenLastCalledWith("Lock");
    expect(mockHandleMenuPress).toHaveBeenCalledTimes(6);
  });
});
