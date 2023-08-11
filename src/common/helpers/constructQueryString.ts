export const constructQueryString = (url: string, params: Record<string, unknown>) => {
  const encodedParams: Record<string, string> = Object.keys(params).reduce(
    (acc, key) => ({ ...acc, [key]: encodeURIComponent(`${params[key]}`) }),
    {},
  );

  const queryParamsString = Object.keys(encodedParams)
    .map((key) => `${key}=${encodedParams[key]}`)
    .join("&");
  return `${url}?${queryParamsString}`;
};
