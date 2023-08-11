import { stringConstants } from "@ct/constants";
import { provideHeader } from "../HeaderHandler";

const mockGetIdToken = jest.fn();
jest.mock("@ct/utils/Services/auth", () => ({
  authService: {
    getIdToken: () => mockGetIdToken(),
  },
}));

describe("render HeaderHandler ", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("test provideHeader for transaction engine", () => {
    mockGetIdToken.mockResolvedValue("test");
    const result = provideHeader({}, {}, stringConstants.requestType.transactionEngine);
    return expect(result).resolves.toEqual(
      expect.objectContaining({ headers: { Authorization: "Bearer test" } }),
    );
  });

  it("test provideHeader for backoffice", () => {
    const result = provideHeader({}, {}, stringConstants.requestType.backOfficeRedirect);
    return expect(result).resolves.toEqual({
      headers: {
        "content-type": " application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    });
  });

  it("test provideHeader for others", () => {
    const result = provideHeader({}, {}, "");
    return expect(result).resolves.toEqual(
      expect.objectContaining({ headers: { Authorization: "Bearer " } }),
    );
  });
});
