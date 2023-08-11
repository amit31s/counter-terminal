import { SERVER_ROOT } from "@ct/common";
import {
  EnablerClientProps,
  enablerAPIClientFactory,
} from "postoffice-product-journey-api-clients";
import { EnablerConfig } from "postoffice-spm-journey-engine";

export const apiConfig: EnablerClientProps = {
  despatch: { rootUrl: SERVER_ROOT },
  tokeniser: {
    rootUrl: SERVER_ROOT,
  },
  bankAccountValidation: { rootUrl: SERVER_ROOT, version: "v1" },
  paymentsAndBanking: { rootUrl: SERVER_ROOT },
  estimatedDeliveryDate: { rootUrl: SERVER_ROOT },
  country: { rootUrl: SERVER_ROOT },
  product: { rootUrl: SERVER_ROOT },
  insurance: { rootUrl: SERVER_ROOT },
  governmentId: { rootUrl: SERVER_ROOT },
  postal: { rootUrl: SERVER_ROOT },
  postcodeLookup: { rootUrl: SERVER_ROOT },
  mails: { rootUrl: SERVER_ROOT },
  travelMoney: { rootUrl: SERVER_ROOT },
  billpay: { rootUrl: SERVER_ROOT },
  boeNotesExchange: { rootUrl: SERVER_ROOT },
  bces: { rootUrl: SERVER_ROOT },
  pbne: { rootUrl: SERVER_ROOT },
  imovo: { rootUrl: SERVER_ROOT },
  epay: { rootUrl: SERVER_ROOT },
  dropandgo: { rootUrl: SERVER_ROOT },
  payout: { rootUrl: SERVER_ROOT },
  giftcard: { rootUrl: SERVER_ROOT },
  moneygram: { rootUrl: SERVER_ROOT },
  fmcc: { rootUrl: SERVER_ROOT },
  ekycVerification: { rootUrl: SERVER_ROOT },
  utils: { rootUrl: SERVER_ROOT },
  fmcv: { rootUrl: SERVER_ROOT },
  charitableDonations: { rootUrl: SERVER_ROOT },
};

export const enablerConfig: EnablerConfig = {
  config: {
    ...apiConfig,
    journey: {
      rootUrl: SERVER_ROOT,
    },
  },
  enablerAPIClientFactory: enablerAPIClientFactory as any,
};
