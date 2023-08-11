import { render, setupUser, waitFor } from "@ct/common";
import * as hooks from "../../hooks/useSpringPressable";
import { PressableText } from ".";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("pressableText", () => {
  it("renders the component", () => {
    const { getByText } = render(<PressableText id={"any"} text={"test"} />);
    expect(getByText("test")).toBeInTheDocument();
  });

  describe("pressable value text color changes", () => {
    describe("ispressed is true", () => {
      it("expect text color to be secondary color ", async () => {
        jest.spyOn(hooks, "useSpringPressable").mockReturnValue({
          handleSpringPress: jest.fn(),
          isPressed: true,
          animatedStyle: [undefined],
        });
        const { getByText } = render(<PressableText id={"any"} text={"test"} />);
        expect(getByText("test")).toHaveStyle("color:rgb(46, 26, 71)");
      });
    });

    describe("ispressed is false", () => {
      it(" expect text color to be white", async () => {
        jest.spyOn(hooks, "useSpringPressable").mockReturnValue({
          handleSpringPress: jest.fn(),
          isPressed: false,
          animatedStyle: [undefined],
        });
        const { getByText } = render(<PressableText id={"any"} text={"test"} />);
        expect(getByText("test")).toHaveStyle("color:rgb(255, 255, 255)");
      });
    });
  });

  describe("pressable events", () => {
    describe("onPress", () => {
      it("calls handlePressAction", async () => {
        const user = setupUser();
        const onChange = jest.fn();
        const { getByText } = render(
          <PressableText id={"any"} text={"test"} onChange={onChange} />,
        );
        await user.click(getByText("test"));
        await waitFor(() => {
          expect(onChange).toBeCalledWith({ id: "any" });
        });
      });
    });
    describe("onPressIn", () => {
      it("calls handle springPress with value true", async () => {
        const user = setupUser();
        const handleSpringPress = jest.fn();
        jest.spyOn(hooks, "useSpringPressable").mockReturnValue({
          handleSpringPress,
          isPressed: false,
          animatedStyle: [undefined],
        });
        const { getByText } = render(<PressableText id={"any"} text={"test"} />);
        await user.pointer({ target: getByText("test"), keys: "[MouseLeft>]" });
        await waitFor(() => {
          expect(handleSpringPress).toHaveBeenCalledWith(true);
        });
        expect(handleSpringPress).toBeCalledTimes(1);
      });
    });

    describe("onPressOut", () => {
      it("calls handle springPress with value false", async () => {
        const user = setupUser();
        const handleSpringPress = jest.fn();
        jest.spyOn(hooks, "useSpringPressable").mockReturnValue({
          handleSpringPress,
          isPressed: true,
          animatedStyle: [undefined],
        });
        const { getByText } = render(<PressableText id={"any"} text={"test"} />);
        await user.pointer({ target: getByText("test"), keys: "[MouseLeft>]" });
        await user.pointer({ target: getByText("test"), keys: "[/MouseLeft]" });
        await waitFor(() => {
          expect(handleSpringPress).toHaveBeenCalledWith(false);
        });
        expect(handleSpringPress).toBeCalledTimes(2);
      });
    });
  });
});
