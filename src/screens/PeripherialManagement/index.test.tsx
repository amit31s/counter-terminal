/**
 * @jest-environment jsdom
 */

import { renderWithRedux, RootState, setupUser } from "@ct/common";
import { authMock } from "@ct/utils/MockData/reduxMock";
import { setup } from "postoffice-peripheral-management-service";
import WebSocketAsPromised from "websocket-as-promised";
import { PMSModule } from "..";
import { testIds } from "./testData";

export enum AuthConfigType {
  USER_CONFIG = "userConfig",
  DEVICE_CONFIG = "deviceConfig",
}

const testReduxState: Partial<RootState> = {
  auth: authMock,
};

jest.mock("postoffice-peripheral-management-service");

describe("ingenico PED function simulator", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    const mSetup = jest.mocked(setup);
    mSetup.mockReturnValue({
      connection: wsClient,
      buildClient: jest.fn().mockReturnValue({
        initialise: jest.fn().mockReturnValue(true),
        print: jest.fn().mockReturnValue(true),
        printConfigurationLabels: jest.fn().mockReturnValue(true),
        calibrate: jest.fn().mockReturnValue(true),
      }),
    });
  });

  it("renders the function simulator screen", () => {
    const { getByTestId } = renderWithRedux(<PMSModule />, testReduxState);
    expect(getByTestId(testIds.ingenicoWrapper)).toBeTruthy();
  });

  it("correctly closes the modal when 'Close Modal' is pressed", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const initialiseButton = getByTestId(testIds.initialiseButton);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(initialiseButton);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const closeButton = getByTestId(testIds.closeButton);

    await user.click(closeButton);

    expect(queryByText("Close")).not.toBeInTheDocument();
  });

  it("Ped correctly initalises", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const initialiseButton = getByTestId(testIds.initialiseButton);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(initialiseButton);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const responseText = getByTestId(testIds.responseText);
    expect(responseText).toBeTruthy();
  });

  it("prints test label", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const testPrintButton = getByTestId(testIds.testPrintButton);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(testPrintButton);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const responseText = getByTestId(testIds.responseText);
    expect(responseText).toBeTruthy();
  });

  it("prints MonarchsHead label", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const testPrintButton = getByTestId(testIds.testPrintButton2);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(testPrintButton);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const responseText = getByTestId(testIds.responseText);
    expect(responseText).toBeTruthy();
  });

  it("calibrates label printers", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const button = getByTestId(`${testIds.labelPrinterWrapper}-calibrate`);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(button);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const responseText = getByTestId(testIds.responseText);
    expect(responseText).toBeTruthy();
  });

  it("prints configuration labels", async () => {
    const user = setupUser();
    const { getByTestId, queryByText, getByText } = renderWithRedux(<PMSModule />, testReduxState);
    const button = getByTestId(`${testIds.labelPrinterWrapper}-config`);

    expect(queryByText("Close")).not.toBeInTheDocument();

    await user.click(button);

    expect(getByText("Close")).not.toHaveAttribute("aria-disabled", "true");

    const responseText = getByTestId(testIds.responseText);
    expect(responseText).toBeTruthy();
  });
});
