import { render } from "@ct/common";
import { ScreenLayout } from "../ScreenLayout";

describe("Screen Layout", () => {
  it("should render screen layout left panel", async () => {
    const { container } = render(
      <ScreenLayout.LeftPanel>
        <div />
      </ScreenLayout.LeftPanel>,
    );
    expect(container.children.length).toBe(1);
  });

  it("should render screen layout right panel", async () => {
    const { container } = render(
      <ScreenLayout.RightPanel>
        <div />
      </ScreenLayout.RightPanel>,
    );
    expect(container.children.length).toBe(1);
  });
});
