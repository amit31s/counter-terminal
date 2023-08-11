const replaceKey = (key: string) =>
  key === "accessToken" ||
  key === "idToken" ||
  key === "refreshToken" ||
  key === "Authorization" ||
  key === "User" ||
  key === "UserAuthorization" ||
  key === "custom:preferredMode";
export const replaceJWTTokens = (obj: any) => {
  return Object.keys(obj).reduce((acc: any, key) => {
    acc[key] =
      obj[key] instanceof Object
        ? replaceJWTTokens(obj[key])
        : replaceKey(key)
        ? "*****"
        : obj[key];

    return {
      ...obj,
      ...acc,
    };
  }, {});
};
