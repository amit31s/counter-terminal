import { renderHook } from "@testing-library/react";
import { DependencyList } from "react";
import { useEffectAfterMount } from "../useEffectAfterMount";

it("should run the callback function when the dependency list changes and clean up after itself", () => {
  const cleanupFunction = jest.fn();
  const callback = jest.fn().mockReturnValue(cleanupFunction);

  const { rerender, unmount } = renderHook<void, DependencyList>((deps: DependencyList) =>
    useEffectAfterMount(callback, deps),
  );

  expect(callback).not.toHaveBeenCalled();
  rerender([1]);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(cleanupFunction).not.toHaveBeenCalled();
  unmount();
  expect(cleanupFunction).toHaveBeenCalledTimes(1);
});
