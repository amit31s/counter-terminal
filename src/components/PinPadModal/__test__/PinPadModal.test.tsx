import { renderWithRedux } from "@ct/common";
import { PosDisplayEvent } from "postoffice-peripheral-management-service";
import PinPadModal from "../PinPadModal";
const pinPadModalProps = {
  isVisible: true,
  headerText: "test",
  actions: [
    { label: "test", event: "CANCEL" },
    { label: "test1", event: "CANCEL" },
  ] as unknown as PosDisplayEvent[],
  pedActionHandler: jest.fn(),
};
describe("render PinPadModal", () => {
  it("test Pin Pad Modal", async () => {
    const { getByTestId } = renderWithRedux(
      <PinPadModal modalHeaderTitle={"test-title"} {...pinPadModalProps} />,
    );
    expect(getByTestId("PinPadModal")).toBeTruthy();
  });

  it("test Pin Pad Modal default", async () => {
    const { getByTestId } = renderWithRedux(<PinPadModal isVisible={true} />);
    expect(getByTestId("PinPadModal")).toBeTruthy();
  });
});
