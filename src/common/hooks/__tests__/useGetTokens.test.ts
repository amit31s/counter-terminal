import { renderHookWithRedux, waitFor } from "@ct/common/helpers";
import { Tokens } from "@ct/utils/Services/auth";
import { useGetTokens } from "../useGetTokens";

jest.mock("@ct/utils/Services/auth", () => {
  return {
    authService: {
      currentUserAuthAttributes: (): Tokens => ({
        idToken: "mock-token",
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      }),
    },
  };
});

describe("useGetTokens", () => {
  it("should retun token info", async () => {
    const { result } = renderHookWithRedux(() => {
      return useGetTokens();
    });
    await waitFor(() => {
      expect(result.current.tokens.idToken).toEqual("mock-token");
    });
    await waitFor(() => {
      expect(result.current.tokens.accessToken).toEqual("mock-access-token");
    });
    await waitFor(() => {
      expect(result.current.tokens.refreshToken).toEqual("mock-refresh-token");
    });
  });
});
