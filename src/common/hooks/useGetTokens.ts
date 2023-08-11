import { authService, defaultTokenValue, Tokens } from "@ct/utils/Services/auth";
import { useEffect, useState } from "react";

export const useGetTokens = () => {
  const [tokens, setTokens] = useState<Tokens>(defaultTokenValue);

  useEffect(() => {
    const fetchAuthTokens = async () => {
      const data = await authService.currentUserAuthAttributes();
      setTokens({
        idToken: data.idToken,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    };
    fetchAuthTokens();
  }, []);

  return { tokens };
};
