import { act, renderWithRedux, renderWithReduxAndStore } from "@ct/common";
import {
  resetLoadingStatus,
  setLoadingActive,
  setLoadingInactive,
  updateLoadingStatus,
} from "@ct/common/state/loadingStatus.slice";
import { LoadingModal } from "@ct/components";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";
import { Box } from "native-base";

describe("Loading Modal", () => {
  it("doesn't render when the flag isn't set", async () => {
    const { queryByTestId } = renderWithRedux(<LoadingModal />, {
      loadingStatus: [],
    });

    expect(queryByTestId("LoadingModalTestID")).toBeFalsy();
  });

  it("renders when the flag is set", async () => {
    const { getByTestId } = renderWithRedux(<LoadingModal />, {
      loadingStatus: [{ id: null, modalProps: {} }],
    });

    expect(getByTestId("LoadingModalTestID")).toBeTruthy();
  });

  it("renders custom props", async () => {
    const { getByTestId, getByText } = renderWithRedux(<LoadingModal />, {
      loadingStatus: [
        {
          modalProps: {
            icon: (
              <Box testID="CustomIconTestID">
                <SmsFailedOutlinedIcon />
              </Box>
            ),
            title: "Custom Loading Title",
          },
          id: null,
        },
      ],
    });

    expect(getByTestId("CustomIconTestID")).toBeTruthy();
    expect(getByText("Custom Loading Title")).toBeTruthy();
  });

  it("reacts to state updates", async () => {
    const {
      rendered: { queryByTestId, getByTestId, getByText },
      store: { dispatch },
    } = renderWithReduxAndStore(<LoadingModal />, {
      loadingStatus: [],
    });

    expect(queryByTestId("LoadingModalTestID")).toBeFalsy();

    act(() => {
      dispatch(setLoadingActive());
    });

    expect(getByTestId("LoadingModalTestID")).toBeTruthy();

    act(() => {
      dispatch(setLoadingInactive());
    });

    expect(queryByTestId("LoadingModalTestID")).toBeFalsy();

    act(() => {
      dispatch(
        updateLoadingStatus([
          {
            modalProps: {
              icon: (
                <Box testID="CustomIconTestID">
                  <SmsFailedOutlinedIcon />
                </Box>
              ),
              title: "Custom Loading Title",
            },
            id: null,
          },
        ]),
      );
    });

    expect(getByTestId("CustomIconTestID")).toBeTruthy();
    expect(getByText("Custom Loading Title")).toBeTruthy();

    act(() => {
      dispatch(resetLoadingStatus());
    });

    expect(queryByTestId("LoadingModalTestID")).toBeFalsy();

    act(() => {
      dispatch(
        setLoadingActive({
          modalProps: {
            icon: (
              <Box testID="CustomIconTestID">
                <SmsFailedOutlinedIcon />
              </Box>
            ),
            title: "Custom Loading Title",
          },
        }),
      );
    });

    expect(getByTestId("CustomIconTestID")).toBeTruthy();
    expect(getByText("Custom Loading Title")).toBeTruthy();
  });
});
