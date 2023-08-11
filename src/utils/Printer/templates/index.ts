import { Constants } from "@ct/interfaces/cop.interface";
import { generateCop } from "../templates/generateCop";

// Temporary location until data is being fetched from ref data
export const constants: Constants = {
  language: "en",
  en: {
    branchHeader: {
      companyName: "Post Office Ltd.",
      certOfPosting: "Certificate of Posting. Please retain.",
      branchNamePostFix: "Post Office",
      branch: "Branch:",
    },
    serviceItem: {
      reference: "Reference:",
      address: "Address:",
      addressValidated: "Address validated?",
      maximumComp: "Maximum Comp:",
      consqLoss: "Consq. Loss:",
      weightTitle: "Weight:",
      itemValue: "Item Value:",
      pricePaid: "Price paid:",
      prePaid: "Pre-paid:",
    },
    sess: {
      sessionTitle: "Session:",
      after: "After",
      before: "Before",
      acceptanceTime: "latest acceptance time",
    },
    footer: {
      tc: "Please refer to seperate terms & conditions",
      notFinancialReceipt: "THIS IS NOT A FINANCIAL RECEIPT",
    },
  },
  cy: {
    language: "cy",
    branchHeader: {
      companyName: "Swyddfa'r Post Cyf.",
      certOfPosting: "TYSTYSGRIF POSTIO. CADWCH HWN.",
      branchNamePostFix: "Post Office",
      branch: "Swyddfa:",
    },
    serviceItem: {
      reference: "Cyfeirnod:",
      address: "Cyfeiriad:",
      addressValidated: "Dilyswyd y Cyfeiriad?",
      maximumComp: "Iawndal Uwch:",
      consqLoss: "Colled Ganlyniadol:",
      weightTitle: "Pwysau:",
      itemValue: "Gwerth yr Eitem:",
      pricePaid: "Talwyd:",
      prePaid: "Swm Rhagdaledig:",
    },
    sess: {
      sessionTitle: "ID Sesiwn:",
      after: "Ar ôl",
      before: "Cyn",
      acceptanceTime: "yr amser derbyn olaf",
    },
    footer: {
      tc: "Cyfeiriwch at delerau ac amodau ar wahân",
      notFinancialReceipt: "NID DERBYNNEB ARIANNOL MO HWN",
    },
  },
};

export const getHTMLTemplate = (params: Record<string, unknown> | null): Promise<string> => {
  if (!params) {
    return Promise.reject("params not recognised");
  }
  params.language = params.language || "en";

  switch (params.format) {
    case "COP":
      const constantVals = params.language === "en" ? constants.en : constants.cy;
      // TODO replace with Ref Data Service when available
      const html = generateCop({
        format: "COP",
        branchName: "" /** Where do these come from? Not in params or constants.en / cy */,
        branchPostcode: "",
        branchID: "",
        session: "",
        date: "",
        language: "",
        services: [],
        ...params,
        ...constantVals,
      });

      return Promise.resolve(html);
    default:
      return Promise.reject("template not recognised");
  }
};
