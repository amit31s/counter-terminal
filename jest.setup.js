import { AXIOS_INSTANCE } from "@ct/api/generator/mutator/useCustomInstance";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "amazon-cognito-identity-js";
import axios from "axios";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(),
    getRandomValues: () => Math.random(),
    random: () => Math.random(),
  },
});

jest.mock("uuid", () => {
  let i = 0;
  return {
    v4: () => (i++).toString(),
  };
});

// Suppress `useNativeDriver` warning
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("amazon-cognito-identity-js");

jest.mock(
  "jimp",
  () => {
    return false;
  },
  { virtual: true },
);

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("@aws-amplify/auth", () => ({
  Auth: {
    configure: jest.fn(),
    signOut: jest.fn().mockResolvedValue(),
  },
}));

jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

jest.mock("postoffice-product-journey-api-clients", () => ({
  buildProductAPIClient: jest.fn(),
  buildJourneyAPIClient: jest.fn(),
  buildDespatchAPIClient: jest.fn(),
  buildFulfillmentApiClient: jest.fn(),
  buildPaymentBankingServicesClient: jest.fn(),
  enablerAPIClientFactory: {
    buildClient: jest.fn(),
  },
  EnablerAPIClientNames: {
    tokeniser: "tokeniser",
  },
}));

jest.mock("nbit-react-native-ingenicoped"),
  () => ({
    setup: jest.fn(),
  });

jest.mock("@pol/frontend-logger-web", () => ({
  logManager: () => ({
    trace: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    levelLogger: () => jest.fn(),
  }),
  crashReporter: () => (next) => (action) => next(action),
}));

beforeAll(() => {
  AXIOS_INSTANCE.defaults.adapter = require("axios/lib/adapters/http");
  axios.defaults.adapter = require("axios/lib/adapters/http");
});
