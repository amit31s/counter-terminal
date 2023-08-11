import * as hook from "@ct/common/hooks/useAppDispatch";
import { useCommitFulfilPrompts } from "../CommitFulfilPrompts";

describe("render useCommitFulfilPrompts ", () => {
  it("test useCommitFulfilPrompts on show modal", async () => {
    jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());
    const { onShowModel } = useCommitFulfilPrompts();
    onShowModel("test-id", {
      title: "test",
      content: "test-content",
    });
  });

  it("test useCommitFulfilPrompts on hide modal", async () => {
    jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());
    const { onHideModel } = useCommitFulfilPrompts();
    onHideModel("test-id");
  });
});
