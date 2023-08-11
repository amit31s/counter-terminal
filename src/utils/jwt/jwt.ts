import jwtDecode from "jwt-decode";

export const decodeJWTToken = (token: string | null) => {
  if (!token) {
    return {};
  }
  return jwtDecode(token);
};
