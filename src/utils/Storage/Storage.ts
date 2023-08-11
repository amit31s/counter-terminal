import { configSelector } from "@ct/common/platformHelper";

/* 
    Save data on local
*/
export const setItem = async (key: string, value: unknown) => {
  let newValue: string;

  if (typeof value !== "string") {
    newValue = JSON.stringify(value);
  } else {
    newValue = value;
  }
  return localStorage.setItem(key, newValue);
};

/* 
    Retrieve data from local
*/
export const getItem = (key: string): string => {
  let data = localStorage.getItem(key);
  if (!data) {
    data = "";
  }
  return data;
};

/* 
    Delete data from local
*/
export const removeItem = (key: string) => {
  return localStorage.removeItem(key);
};

export const removeFederatedTokens = () => {
  Object.fromEntries(
    Object.entries(localStorage).filter(([key]) =>
      key.includes(
        `CognitoIdentityServiceProvider.${configSelector("FORGEROCK_COGNITO_WEB_CLIENT_ID")}`,
      ),
    ),
  );
};
