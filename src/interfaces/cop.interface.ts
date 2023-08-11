export interface ICOP {
  format: string;
  branchName: string;
  branchPostcode: string;
  branchID: string;
  session: string;
  date: string;
  language: string;
  services: Service[];
  branchHeader: BranchHeader;
  serviceItem: ServiceItem;
  sess: Sess;
  footer: Footer;
}

interface Service {
  name: string;
  footer: string;
  lineItems: LineItem[];
  constants?: Constants;
}

interface LineItem {
  constants: Constants;
  trackingRef?: string;
  address?: string;
  itemValue?: string;
  maxComp?: string;
  maxCompPrice?: string;
  consqLoss?: string;
  consqLossPrice?: string;
  weight?: string;
  price?: string;
  prePaid?: string;
  customFields?: CustomField[];
  addressValidated?: boolean;
}

interface CustomField {
  key: string;
  value: string;
}

export interface Constants {
  language: keyof Omit<Constants, "language">;
  en: En;
  cy: Cy;
}

interface Cy {
  language: string;
  branchHeader: BranchHeader;
  serviceItem: ServiceItem;
  sess: Sess;
  footer: Footer;
}

interface En {
  branchHeader: BranchHeader;
  serviceItem: ServiceItem;
  sess: Sess;
  footer: Footer;
}

interface Footer {
  tc: string;
  notFinancialReceipt: string;
}

interface Sess {
  sessionTitle: string;
  after: string;
  before: string;
  acceptanceTime: string;
}

interface ServiceItem {
  reference: string;
  address: string;
  addressValidated: string;
  maximumComp: string;
  consqLoss: string;
  weightTitle: string;
  itemValue: string;
  pricePaid: string;
  prePaid: string;
}

interface BranchHeader {
  companyName: string;
  certOfPosting: string;
  branchNamePostFix: string;
  branch: string;
}
