import { render, setupUser, waitFor } from "@ct/common";
import React from "react";
import * as useFilePicker from "use-file-picker";
import * as helpers from "../StorageConfig";
import { StorageConfig } from "../StorageConfig";

describe("StorageConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders all buttons", () => {
    const storageKey = "key";
    const activeConfig = {};
    const getOriginalConfig = jest.fn();
    const description = "description";
    const shouldStringifyValues = true;
    const { getByRole, getByText } = render(
      <StorageConfig
        storageKey={storageKey}
        activeConfig={activeConfig}
        getOriginalConfig={getOriginalConfig}
        description={description}
        shouldStringifyValues={shouldStringifyValues}
      />,
    );
    const importConfigButton = getByRole("button", { name: "Import Config" });
    const exportConfigButton = getByRole("button", { name: "Export Config" });
    const updateConfigButton = getByRole("button", { name: "Import Config" });
    const undoButton = getByRole("button", { name: "Undo Unsaved Changes" });
    const resetButton = getByRole("button", { name: "Reset to Defaults" });
    const textDescription = getByText("description");
    expect(importConfigButton).toBeInTheDocument();
    expect(exportConfigButton).toBeInTheDocument();
    expect(updateConfigButton).toBeInTheDocument();
    expect(undoButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(textDescription).toBeInTheDocument();
  });
  describe("button click events", () => {
    describe("import config button", () => {
      it("calls open file selector", async () => {
        const user = setupUser();
        const storageKey = "key";
        const activeConfig = {};
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const openFileSelector = jest.fn();
        jest
          .spyOn(useFilePicker, "useFilePicker")
          .mockReturnValue([
            openFileSelector,
            { filesContent: [] },
          ] as unknown as useFilePicker.FilePickerReturnTypes);
        const { getByRole } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        const importConfigButton = getByRole("button", { name: "Import Config" });
        await user.click(importConfigButton);
        expect(openFileSelector).toBeCalledTimes(1);
      });
    });
    describe("export config button", () => {
      it("calls handle export function  ", async () => {
        const user = setupUser();
        const storageKey = "key";
        const activeConfig = { any: "hey" };
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const exportFunc = jest.spyOn(helpers, "exportHandler");
        const { getByRole } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        const importConfigButton = getByRole("button", { name: "Export Config" });
        await user.click(importConfigButton);
        expect(exportFunc).toBeCalledTimes(1);
      });
    });
    describe("update config button", () => {
      it("calls handle sumbit function  ", async () => {
        const user = setupUser();
        const storageKey = "key";
        const activeConfig = { any: "hey" };
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const exportFunc = jest.spyOn(helpers, "submitHandler");
        const { getByRole } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        const importConfigButton = getByRole("button", { name: "Update Config" });
        await user.click(importConfigButton);
        expect(exportFunc).toBeCalledTimes(1);
      });
    });
    describe("undo unsaved changes button", () => {
      it("calls setState with stringified config", async () => {
        const setStateMock = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const useStateMock: any = (useState: any) => [useState, setStateMock];
        jest.spyOn(React, "useState").mockImplementation(useStateMock);
        const user = setupUser();
        const storageKey = "key";
        const activeConfig = { any: "hey" };
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const { getByRole } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        const importConfigButton = getByRole("button", { name: "Undo Unsaved Changes" });
        await user.click(importConfigButton);
        await waitFor(() => {
          expect(setStateMock).toBeCalledWith(JSON.stringify(activeConfig, null, 2));
        });
      });
    });
    describe("reset to default button", () => {
      it("calls get original config function  ", async () => {
        const setStateMock = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const useStateMock: any = (useState: any) => [useState, setStateMock];
        jest.spyOn(React, "useState").mockImplementation(useStateMock);
        const user = setupUser();
        const storageKey = "key";
        const activeConfig = { any: "hey" };
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const { getByRole } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        const importConfigButton = getByRole("button", { name: "Reset to Defaults" });
        await user.click(importConfigButton);
        expect(getOriginalConfig).toBeCalledTimes(1);
      });
    });

    describe("use Effect error catch", () => {
      it("throws correct error message if filesContent has no content property  ", async () => {
        const storageKey = "key";
        const activeConfig = { any: "hey" };
        const getOriginalConfig = jest.fn();
        const description = "description";
        const shouldStringifyValues = true;
        const openFileSelector = jest.fn();
        jest
          .spyOn(useFilePicker, "useFilePicker")
          .mockReturnValue([
            openFileSelector,
            { filesContent: [null] },
          ] as unknown as useFilePicker.FilePickerReturnTypes);
        const { getByText } = render(
          <StorageConfig
            storageKey={storageKey}
            activeConfig={activeConfig}
            getOriginalConfig={getOriginalConfig}
            description={description}
            shouldStringifyValues={shouldStringifyValues}
          />,
        );
        expect(getByText(`Reset to Defaults`)).toBeDefined();
      });
    });
  });
});
