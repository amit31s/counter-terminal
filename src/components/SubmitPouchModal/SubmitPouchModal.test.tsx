import { render } from "@ct/common";
import { SubmitPouchModal } from "@ct/components";
import { imageConstants, stringConstants } from "@ct/constants";
import { Text, View } from "native-base";

describe("Submit Pouch Modal", () => {
  it("renders submit pouch modal content", async () => {
    const view = render(<SubmitPouchModal isOpen={true} content="test submit pouch content" />);
    expect(await view.findByText("test submit pouch content")).toBeTruthy();
  });

  it("test title found in submit pouch modal", async () => {
    const { getByTestId } = render(
      <SubmitPouchModal
        isOpen={true}
        content="test submit pouch content"
        title="test submit pouch title"
      />,
    );
    expect(getByTestId(stringConstants.SubmitPouchModal.titleTestId)).toBeTruthy();
  });

  it("test title not found if not assigned", async () => {
    const { queryByTestId } = render(<SubmitPouchModal isOpen={true} content="test content" />);
    expect(queryByTestId(stringConstants.SubmitPouchModal.titleTestId)).toBeFalsy();
  });

  it("test renders custom content text component", async () => {
    const { getByTestId } = render(
      <SubmitPouchModal
        isOpen={true}
        content={<Text testID="test custom component">Custom Content</Text>}
      />,
    );
    expect(getByTestId("test custom component")).toBeTruthy();
  });

  it("test renders action buttons", async () => {
    const { getByTestId } = render(
      <SubmitPouchModal
        isOpen={true}
        content="test content"
        primaryButtonProps={{ testID: "PrimaryButtonTestId", label: "primary button" }}
        secondaryButtonProps={{ testID: "SecondaryButtonTestId", label: "secondary button" }}
        otherButtonProps={{ testID: "OtherButtonTestId", label: "other button" }}
      />,
    );
    expect(getByTestId("PrimaryButtonTestId")).toBeTruthy();
    expect(getByTestId("SecondaryButtonTestId")).toBeTruthy();
    expect(getByTestId("OtherButtonTestId")).toBeTruthy();
  });

  it("test render icon displaying", async () => {
    const { getByTestId } = render(
      <SubmitPouchModal
        isOpen={true}
        content="test content"
        icon={<View testID={"test icon"} />}
      />,
    );
    expect(getByTestId("test icon")).toBeTruthy();
  });

  it("matches the snapshot", async () => {
    const view = render(
      <SubmitPouchModal
        isOpen={true}
        title="Test Title"
        content="Lorem ipsum."
        primaryButtonProps={{ label: "Primary Button" }}
        secondaryButtonProps={{ label: "Secondary Button" }}
        otherButtonProps={{ label: "other button" }}
        imageProps={{ source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(view.baseElement).toMatchSnapshot();
  });
});
