import { PouchDataForDespatch } from "@ct/api/generator";
import { renderHook } from "@ct/common";
import { useGetMemoizedAvailablePouch } from "./useGetMemoizedAvailablePouch";

describe("useGetMemoizedAvailablePouch", () => {
  it("should return filtered available pouch data based on validated data", () => {
    const availablePouchData = [
      { pouchID: "A" },
      { pouchID: "B" },
      { pouchID: "C" },
    ] as unknown as PouchDataForDespatch[];

    const validatedData = [{ pouchID: "A" }, { pouchID: "C" }] as unknown as PouchDataForDespatch[];

    const expectedOutput = [{ pouchID: "B" }] as unknown as PouchDataForDespatch[];

    const { result } = renderHook(() =>
      useGetMemoizedAvailablePouch({ availablePouchData, validatedData }),
    );

    expect(result.current).toEqual(expectedOutput);
  });

  it("should return all available pouch data if there's no validated data", () => {
    const availablePouchData: PouchDataForDespatch[] = [
      { pouchID: "A" },
      { pouchID: "B" },
      { pouchID: "C" },
    ] as unknown as PouchDataForDespatch[];

    const validatedData: PouchDataForDespatch[] = [];

    const expectedOutput: PouchDataForDespatch[] = [...availablePouchData];

    const { result } = renderHook(() =>
      useGetMemoizedAvailablePouch({ availablePouchData, validatedData }),
    );

    expect(result.current).toEqual(expectedOutput);
  });
});
