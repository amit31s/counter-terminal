import { stringConstants } from "@ct/constants";

/* 
  Check value is float
*/
export const isFloat = (n: number) => {
  return Number(n) === n && n % 1 !== 0;
};

/* 
  rounds the string to a specified number of decimals
*/
export const intToFloat = (amount: number, decPlaces = 2): string => {
  if (!amount || isNaN(amount)) {
    return "0";
  } else {
    return amount.toFixed(decPlaces);
  }
};

export const appendPoundSymbolWithAmount = (value: number): string => {
  const floatValue = intToFloat(value);
  if (Number(floatValue) < 0) {
    return floatValue.replace("-", `-${stringConstants.Symbols.Pound}`);
  } else {
    return `${stringConstants.Symbols.Pound}${floatValue}`;
  }
};

/* 
  rounds the string to a specified number of decimals
*/
export const floatConversion = (value: string | number): string => {
  if (typeof value === "string") {
    value = Number(value);
  }
  if (isFloat(value)) {
    return intToFloat(value);
  } else {
    return "" + value;
  }
};

/* 
  pound to pence converter 
*/
export const poundToPence = (amount: number): number => {
  /* istanbul ignore if */
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 0;
  }
  return Number(intToFloat(amount * 100));
};

/* 
  pence to pound converter 
*/
export const penceToPound = (amount: number): number => {
  /* istanbul ignore if */
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 0;
  }
  return Number(intToFloat(amount / 100));
};
