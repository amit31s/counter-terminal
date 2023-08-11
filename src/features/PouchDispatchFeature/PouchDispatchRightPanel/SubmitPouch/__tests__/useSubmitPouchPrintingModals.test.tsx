import { PouchDataForDespatch } from "@ct/api/generator";
import { renderHookWithRedux, waitFor } from "@ct/common";
import * as isLoadingActive from "@ct/common/state/loadingStatus.slice";
import React from "react";
import useSubmitPouchPrintingModals from "../useSubmitPouchPrintingModals";

beforeEach(() => {
  jest.clearAllMocks();
});
const setStateMock = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStateMock: any = (useState: any) => [useState, setStateMock];
jest.spyOn(React, "useState").mockImplementation(useStateMock);

describe("useSubmitPouchPrintingModals", () => {
  it("makes the correct state and function calls if success list exits", async () => {
    const validatedData = [{ pouchID: "A" }, { pouchID: "C" }] as unknown as PouchDataForDespatch[];
    const setSuccessPouchList = jest.fn();
    const setDisabled = jest.fn();
    renderHookWithRedux(() =>
      useSubmitPouchPrintingModals(validatedData, setSuccessPouchList, setDisabled, false),
    );
    expect(setStateMock).toHaveBeenCalledWith(true);
    const func = jest.spyOn(isLoadingActive, "setLoadingActive");
    await waitFor(() => {
      expect(func).toBeCalledTimes(2);
    });
  });

  it("doesn't make the state or function calls if success list not exits", async () => {
    const validatedData = [] as unknown as PouchDataForDespatch[];
    const setSuccessPouchList = jest.fn();
    const setDisabled = jest.fn();
    renderHookWithRedux(() =>
      useSubmitPouchPrintingModals(validatedData, setSuccessPouchList, setDisabled, false),
    );
    expect(setStateMock).not.toHaveBeenCalledWith(true);
    const func = jest.spyOn(isLoadingActive, "setLoadingActive");

    await waitFor(() => {
      expect(func).toBeCalledTimes(0);
    });
  });
});
