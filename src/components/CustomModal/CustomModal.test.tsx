import { render } from "@ct/common";
import { CustomModal } from "@ct/components";
import { imageConstants, stringConstants } from "@ct/constants";

describe("Custom Modal", () => {
  it("renders anything", async () => {
    const view = render(<CustomModal isOpen={true} content="test" />);
    expect(await view.findByText("test")).toBeTruthy();
  });

  it("renders a title when asked", async () => {
    const { getByTestId } = render(<CustomModal isOpen={true} content="test" title="test title" />);
    expect(getByTestId(stringConstants.CustomModal.titleTestId)).toBeTruthy();
  });

  it("doesn't render a title when not asked", async () => {
    const { queryByTestId } = render(<CustomModal isOpen={true} content="test" />);
    expect(queryByTestId(stringConstants.CustomModal.titleTestId)).toBeFalsy();
  });

  it("renders close button when asked", async () => {
    const { getByTestId } = render(<CustomModal isOpen={true} content="test" showCloseButton />);
    expect(getByTestId(stringConstants.CustomModal.closeButtonTestId)).toBeTruthy();
  });

  it("doesn't render close button when not asked", async () => {
    const { queryByTestId } = render(<CustomModal isOpen={true} content="test" />);
    expect(queryByTestId(stringConstants.CustomModal.closeButtonTestId)).toBeFalsy();
  });

  it("renders custom content", async () => {
    const { getByText } = render(<CustomModal isOpen={true} content={<p>Custom Content</p>} />);
    expect(getByText("Custom Content")).toBeTruthy();
  });

  it("renders action buttons", async () => {
    const { getByTestId } = render(
      <CustomModal
        isOpen={true}
        content="test"
        primaryButtonProps={{ testID: "PrimaryButtonTestId", label: "primary button" }}
        secondaryButtonProps={{ testID: "SecondaryButtonTestId", label: "secondary button" }}
      />,
    );
    expect(getByTestId("PrimaryButtonTestId")).toBeTruthy();
    expect(getByTestId("SecondaryButtonTestId")).toBeTruthy();
  });

  it("renders side image", async () => {
    const { getByTestId } = render(
      <CustomModal
        isOpen={true}
        content="test"
        imageProps={{ testID: "ImageTestId", source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(getByTestId("ImageTestId")).toBeTruthy();
  });

  it("matches the snapshot", async () => {
    const view = render(
      <CustomModal
        isOpen={true}
        title="Test Title"
        content="Lorem ipsum."
        showCloseButton
        primaryButtonProps={{ label: "Primary Button" }}
        secondaryButtonProps={{ label: "Secondary Button" }}
        imageProps={{ source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(view.baseElement).toMatchSnapshot();
  });

  it("renders custom modal with invalid primaryButtonProps", async () => {
    const { getByTestId } = render(
      <CustomModal
        isOpen={true}
        content="test"
        primaryButtonProps={undefined}
        imageProps={{ testID: "ImageTestId", source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(getByTestId("ImageTestId")).toBeTruthy();
  });

  it("renders custom modal with array of primaryButtonProps", async () => {
    const { getByTestId } = render(
      <CustomModal
        isOpen={true}
        content="test"
        icon={<></>}
        title={"test-title"}
        primaryButtonProps={[{ label: "Primary Button" }]}
        secondaryButtonProps={[{ label: "Secondary Button" }]}
        imageProps={{ testID: "ImageTestId", source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(getByTestId("ImageTestId")).toBeTruthy();
  });

  it("renders custom modal open false", async () => {
    const { container } = render(
      <CustomModal
        isOpen={false}
        content="test"
        icon={<></>}
        title={"test-title"}
        primaryButtonProps={[{ label: "Primary Button" }]}
        secondaryButtonProps={[{ label: "Secondary Button" }]}
        imageProps={{ testID: "ImageTestId", source: imageConstants.Login.loginLeft_image }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
