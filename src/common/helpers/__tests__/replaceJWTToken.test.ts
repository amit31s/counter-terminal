import { replaceJWTTokens } from "../replaceJWTTokens";

test("Nested JWT tokens should be obfuscated with stars", () => {
  const sampleData = {
    type: "type",
    payload: {
      accessToken: "accessToken",
      idToken: "idToken",
      refreshToken: "refreshToken",
      notToken: "notToken",
      Authorization: "Authorization",
      UserAuthorization: "UserAuthorization",
    },
    auth: {
      notAToken: "notAToken",
      session: {
        accessToken: "accessToken",
      },
    },
    other: {
      nest: {
        nested: {
          User: "user",
          accessToken: "accessToken",
          alsoNotAToken: "alsoNotAToken",
        },
        "custom:preferredMode": "custom:preferredMode",
      },
    },
    "custom:preferredMode": "custom:preferredMode",
  };

  const expectedResult = {
    type: "type",
    payload: {
      accessToken: "*****",
      idToken: "*****",
      refreshToken: "*****",
      notToken: "notToken",
      Authorization: "*****",
      UserAuthorization: "*****",
    },
    auth: {
      notAToken: "notAToken",
      session: {
        accessToken: "*****",
      },
    },
    other: {
      nest: {
        nested: {
          User: "*****",
          accessToken: "*****",
          alsoNotAToken: "alsoNotAToken",
        },
        "custom:preferredMode": "*****",
      },
    },
    "custom:preferredMode": "*****",
  };

  expect(replaceJWTTokens(sampleData)).toEqual(expectedResult);
});
