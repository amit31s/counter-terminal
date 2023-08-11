import { render, setupUser } from "@ct/common";
import { TEXT, colorConstants } from "@ct/constants";
import { Notification, NotificationStatus, backgroundAndBorderColor } from "./Notification";

const onClosePress = jest.fn();

describe("notification component", () => {
  describe("background and border", () => {
    it("should render correct background and border color", () => {
      const statusTypes = Object.values(NotificationStatus);
      statusTypes.forEach((statusType) => {
        const { notificationBackground, notificationBorder } = colorConstants;
        expect(backgroundAndBorderColor(statusType)).toEqual({
          backgroundColor: notificationBackground,
          borderColor: notificationBorder,
        });
      });
    });
  });

  describe("component holder", () => {
    it("renders with correct styling", () => {
      const { getByTestId } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const componentHolder = getByTestId(TEXT.CTTXT00010);
      expect(componentHolder).toMatchSnapshot();
    });
  });
  describe("title text", () => {
    it("renders correctly", () => {
      const { getByText } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const titleText = getByText("Title");
      expect(titleText).toBeTruthy();
    });

    it("has the correct styling", () => {
      const { getByText } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const title = getByText("Title");
      expect(title).toMatchSnapshot();
    });
  });

  describe("body text", () => {
    it("renders correctly", () => {
      const { getByText } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const bodyText = getByText("Body");
      expect(bodyText).toBeTruthy();
    });

    it("has the correct styling", () => {
      const { getByText } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const bodyText = getByText("Body");
      expect(bodyText).toMatchSnapshot();
    });
  });

  describe("close button", () => {
    it("fires onClosePress once on click", async () => {
      const user = setupUser();
      const { getByTestId } = render(
        <Notification
          onClosePress={onClosePress}
          title="Title"
          message="Body"
          id={TEXT.CTTXT00010}
          type={NotificationStatus.WARNING}
        />,
      );
      const closeButton = getByTestId(TEXT.CTTXT00011);
      await user.click(closeButton);
      expect(onClosePress).toBeCalledTimes(1);
    });
  });
});
