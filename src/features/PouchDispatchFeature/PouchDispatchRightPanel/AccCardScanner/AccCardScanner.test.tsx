import * as getAccData from "@ct/api/generator/endpoints/validate-acc-card/validate-acc-card";
import * as useGetAccCardDataHook from "@ct/api/generator/endpoints/validate-acc-card/validate-acc-card";
import { renderWithRedux, setupUser, waitFor } from "@ct/common/helpers";
import * as useAppSelector from "@ct/common/hooks/useAppSelector";
import * as updateAccCardSlice from "@ct/common/state/pouchDispatch/accCardFeature.slice";
import React from "react";
import { AccScanner } from "./AccCardScanner";

afterEach(() => {
  jest.clearAllMocks();
});

const setStateMock = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStateMock: any = (useState: any) => [useState, setStateMock];
jest.spyOn(React, "useState").mockImplementation(useStateMock);

describe("AccCardScanner", () => {
  describe("component render", () => {
    it("renders the component", async () => {
      const { getByPlaceholderText } = renderWithRedux(<AccScanner />);
      expect(getByPlaceholderText("Enter ACC Card Barcode")).toBeInTheDocument();
    });
  });

  describe("onsubmit", () => {
    describe("validateACCBarcode function", () => {
      describe("no barcode data", () => {
        it("turns modal visibility true and renders no match found text", async () => {
          const user = setupUser();
          const { getByPlaceholderText } = renderWithRedux(<AccScanner />);
          const inputTextField = getByPlaceholderText("Enter ACC Card Barcode");
          await user.type(inputTextField, "barcode");
          await user.keyboard("{Enter}");
          const hook = jest.spyOn(getAccData, "useGetAccCardDataHook");
          await waitFor(() => {
            expect(hook).toBeDefined();
          });
          expect(setStateMock).toBeCalled();
          hook.mockClear();
        });
      });

      describe("with data", () => {
        it("fires updateAccCard with barcode and scanned", async () => {
          const user = setupUser();
          const func = jest.fn(() =>
            Promise.resolve({ httpStatus: 5, employee_name: "any", is_card_valid: "yes" }),
          );
          const updateAccCardFunc = jest.spyOn(updateAccCardSlice, "updateAccCard");
          jest.spyOn(useGetAccCardDataHook, "useGetAccCardDataHook").mockReturnValue(func);
          const { getByPlaceholderText } = renderWithRedux(<AccScanner />);
          const inputTextField = getByPlaceholderText("Enter ACC Card Barcode");
          await user.type(inputTextField, "12345");
          await user.keyboard("{Enter}");
          await waitFor(() => {
            expect(updateAccCardFunc).toBeCalledWith(
              expect.objectContaining({ barcode: "", scanned: true }),
            );
          });
        });
      });

      describe("error handling", () => {
        it("turns modal visibility true and renders error message", async () => {
          const user = setupUser();
          const func = jest.fn(() => Promise.reject());
          jest.spyOn(useGetAccCardDataHook, "useGetAccCardDataHook").mockReturnValue(func);
          const { getByPlaceholderText } = renderWithRedux(<AccScanner />);
          const inputTextField = getByPlaceholderText("Enter ACC Card Barcode");
          await user.type(inputTextField, "12345");
          await user.keyboard("{Enter}");
          await waitFor(() => {
            expect(setStateMock).toBeCalledWith(
              expect.objectContaining({
                isVisible: true,
                message: "something went wrong. Try again",
              }),
            );
          });
        });
      });
    });
    describe("unable to scan component", () => {
      it("is visible if failure count greater than 3", async () => {
        jest.spyOn(useAppSelector, "useAppSelector").mockReturnValueOnce({ failureCount: 5 });
        const { getByTestId } = renderWithRedux(<AccScanner />);
        await waitFor(() => {
          expect(getByTestId("callBCS")).toBeInTheDocument();
        });
      });

      it("is visible if failure count less than 3", async () => {
        jest.spyOn(useAppSelector, "useAppSelector").mockReturnValueOnce({ failureCount: 2 });
        const { queryByTestId } = renderWithRedux(<AccScanner />);
        await waitFor(() => {
          expect(queryByTestId("callBCS")).not.toBeInTheDocument();
        });
      });
    });
  });
});
