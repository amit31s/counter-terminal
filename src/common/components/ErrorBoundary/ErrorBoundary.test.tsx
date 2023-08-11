import { fireEvent, render } from "@ct/common";
import { envProvider } from "@ct/common/platformHelper";
import { Text } from "native-base";
import { ErrorBoundary } from "./ErrorBoundary";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

afterEach(() => {
  jest.clearAllMocks();
});

const Bomb = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("💥");
  } else {
    return (
      <>
        <Text>Everything is OK</Text>
      </>
    );
  }
};

const renderComponent = (shouldThrow = false) => {
  envProvider.REACT_APP_USING_ELECTRON = "true";

  return render(
    <ErrorBoundary>
      <Bomb shouldThrow={shouldThrow} />
    </ErrorBoundary>,
  );
};

it("catches the error and logs it", () => {
  const { getByText } = renderComponent(true);
  const mockRestartApp = window.electronAPI?.restartApp;

  fireEvent.click(getByText("Restart App"));

  expect(mockRestartApp).toHaveBeenCalledTimes(1);
});

it("renders the child component when no error is thrown", () => {
  const { getByText } = renderComponent();
  expect(getByText("Everything is OK")).toBeDefined();
});

it("renders the error message when an error is thrown", () => {
  const errorMessage = "💥";
  const { getByText } = renderComponent(true);
  expect(getByText(errorMessage)).toBeDefined();
});

it("renders the stack trace when an error is thrown", () => {
  const stackTrace = "The stack trace is:";
  const { getByText } = renderComponent(true);
  expect(getByText(stackTrace)).toBeDefined();
});

it("renders the 'Go to Home Page' link when an error is thrown", () => {
  const { getByText } = renderComponent(true);
  expect(getByText("Go to Home Page")).toBeDefined();
});
