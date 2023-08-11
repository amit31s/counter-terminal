import { SERVER_ROOT } from "../common/backendUrl";
export const entity = "cash_drawer";
export const GetAccessAndIdTokenURL = "https://cognito-idp.eu-west-2.amazonaws.com";

export const getBaseURL = () => {
  return SERVER_ROOT;
};

export const URLConstants = {
  cashDrwaer: {
    associateCashDrawaer: `/cash-drawer-association/association`,
    dissociateCashDrawer: `/cash-drawer-association/dissociation`,
  },
  cashTransfer: {
    getEntity: "/cash-drawer-association/association/list?",
    getCashLocations: (counter_terminal_id: string, branch_id: string) =>
      `/cash-drawer-association/association/list?counter_terminal_id=${counter_terminal_id}&branch_id=${branch_id}`,
    transferAmount: "/cash-management/cashtransfer/transfer",
  },

  pouchAcceptance: {
    availablePouchList: (branchId: string) =>
      `/pouch-management/pouch/dispatch/list?branch_id=${branchId}`,
    getPouchList: "/pouch-management/pouch/dispatch/list",
    getPouchValidate: "/pouch-management/pouch/dispatch/validate",
    submitPouch: "/pouch-management/pouch/acceptance/transaction",
  },

  pouchAcceptanceAccCard: {
    getPouchAccCard: "/pouch-management/acc-card/",
    getPreparePouchList: "/pouch-management/pouch/prepared/",
    getPreparePouchValidate: "/pouch-management/pouch/prepared/",
    deletePreparePouchDispatch: "/pouch-management/pouch/dispatch/transaction?",
  },
  pouchDispatch: {
    saveScannedPouch: "/pouch-management/pouch/dispatch/transaction",
    scanAccCard: (accCard: string) => `/pouch-management/acc-card/validate?barcode=${accCard}`,
    getPreparedPouchByBarcode: (barcode: string, branchId: string, transactionId: string) =>
      `/pouch-management/pouch/prepared/validate?barcode=${barcode}&transaction_id=${transactionId}&branch_id=${branchId}`,
  },
  // NO OPENAPI SPECIFICATION
  homeService: {
    checkComplianceService: `/ct-utility-services/training/compliance`,
  },
  basket: {},
  // NO OPENAPI SPECIFICATION
  getCounter: (branchId: string) => {
    return `/cash-drawer-association/onboarded/list?branch_id=${branchId}&entity_type=counter_terminal`;
  },
  // NO OPENAPI SPECIFICATION
  getRecieptData: (branchId: string, counterTerminalId: string) => {
    return `/ct-utility-services/receipt/list?counter_terminal_id=${counterTerminalId}&branch_id=${branchId}`;
  },

  // NO OPENAPI SPECIFICATION
  error: {
    postError: "/ct-logger/logger/save",
  },
};
