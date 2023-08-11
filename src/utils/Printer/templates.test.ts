import { ICOP } from "@ct/interfaces/cop.interface";
import { constants, getHTMLTemplate } from "@ct/utils/Printer/templates";
import {
  branchHeader,
  generateCop,
  serviceItems,
  session,
} from "@ct/utils/Printer/templates/generateCop";
import Handlebars from "handlebars/dist/cjs/handlebars";
import {
  branchHeaderCyFixture,
  branchHeaderEnFixture,
  fullTemplateCyFixture,
  fullTemplateEnFixture,
  serviceItemsCyFixture,
  serviceItemsEnFixture,
  sessionCyFixture,
  sessionEnFixture,
} from "./fixtures";

let copData: ICOP;

describe("english CoP templates", () => {
  beforeEach(() => {
    constants.language = "en";

    copData = {
      branchHeader: {
        branch: "",
        branchNamePostFix: "",
        certOfPosting: "",
        companyName: "",
      },
      footer: {
        notFinancialReceipt: "",
        tc: "",
      },
      serviceItem: {
        address: "",
        addressValidated: "",
        consqLoss: "",
        itemValue: "",
        maximumComp: "",
        prePaid: "",
        pricePaid: "",
        reference: "",
        weightTitle: "",
      },
      sess: {
        acceptanceTime: "",
        after: "",
        before: "",
        sessionTitle: "",
      },
      format: "COP",
      branchName: "Feltham",
      branchPostcode: "TW1 3DD",
      branchID: "123456X",
      session: "99-7654321098",
      date: "28/01/2022 11:34",
      language: "",
      services: [
        {
          name: "Special D by 9",
          footer:
            "Next day guaranteed delivery service.<br/>Tracking and signature at royalmail.com.<br/> With compensation for financial loss,<br/> separate from the item value.",
          lineItems: [
            {
              constants,
              trackingRef: "AA123456789GB",
              address: "23, BB8B 8BB, UK",
              itemValue: "500.10",
              maxComp: "250.01",
              maxCompPrice: "6.30",
              consqLoss: "5000.00",
              consqLossPrice: "5.82",
              weight: "99,999",
              price: "86.75",
              prePaid: "0.30",
            },
            {
              constants,
              trackingRef: "PF9876543219GB",
              address: "4332, Longstreetname, San Francisco, CA54321, USA",
              weight: "1,000",
              price: "9.09",
              customFields: [
                { key: "Test", value: "-£10.99" },
                { key: "Conditions accepted", value: "Y" },
              ],
            },
          ],
        },
        {
          name: "1st Class Small Parcel",
          footer: "Delivery aim: next working day.<br/>Delivery confirmation at royalmail.com.",
          lineItems: [
            {
              constants,
              trackingRef: "PF9876543219GB",
              address: "4332, Longstreetname, San Francisco, CA54321, USA",
              addressValidated: false,
              weight: "99,999",
              price: "9.09",
              customFields: [{ key: "Guaranteed delivery date", value: "29/02/2022" }],
            },
          ],
        },
        {
          constants,
          name: "Parcelforce Contract by 9",
          footer:
            "Your Parcel has been accepted<br/>under our existing Conditions of<br/>Carriage.<br/>Go to www.parcelforce.com/track or<br/>call 03448 004 466 for more info.",
          lineItems: [
            { constants, trackingRef: "AA123456789GB" },
            { constants, trackingRef: "AA123456790GB" },
            { constants, trackingRef: "AA123456791GB" },
          ],
        },
        {
          constants,
          name: "2nd Class Large Letter",
          footer:
            "Royal Mail aims to deliver your 2nd Class<br/>item within 3 working days.<br/>Visit www.royalmail.com to find out more<br/>about Royal Mail products and services",
          lineItems: [
            {
              constants,
              address: "23, BB8B 8BB, UK",
              weight: "99,999",
              price: "86.75",
            },
          ],
        },
      ],
    };
  });

  Handlebars.registerHelper("addPadding", function (this: Record<string, unknown>) {
    return Object.keys(this).length !== 2;
  });

  Handlebars.registerHelper("isDefined", function (value) {
    return value !== undefined;
  });

  Handlebars.registerHelper("compareStrings", function (this: unknown, args1, args2, options) {
    return args1 === args2 ? options.fn(this) : options.inverse(this);
  });

  it("generates session info", () => {
    const template = Handlebars.compile(session);
    const html = template({ ...copData, ...constants.en });
    expect(html).toEqual(sessionEnFixture);
  });

  it("generates branchHeader info", () => {
    const template = Handlebars.compile(branchHeader);
    const html = template({ ...copData, ...constants.en });
    expect(html).toEqual(branchHeaderEnFixture);
  });

  it("generates service items", () => {
    const template = Handlebars.compile(serviceItems);
    const html = template({ ...copData });
    expect(html).toEqual(serviceItemsEnFixture);
  });

  it("generates full cop", () => {
    const html = generateCop({ ...copData, ...constants.en });
    expect(html).toEqual(fullTemplateEnFixture);
  });

  it("generates correct language template", async () => {
    const html = await getHTMLTemplate({ ...copData, ...constants.en });
    expect(html).toEqual(fullTemplateEnFixture);
  });
});

describe("welsh CoP templates", () => {
  beforeEach(() => {
    constants.language = "cy";

    // NOTE: service names and footers in english will not be translated to welsh, only templated words have been translated.
    // It will need to be part of the journey/ref data to pass each service footer and name.
    copData = {
      format: "COP",
      branchName: "Feltham",
      branchPostcode: "TW1 3DD",
      branchID: "123456X",
      session: "99-7654321098",
      date: "28/01/2022 11:34",
      language: "cy",
      branchHeader: {
        branch: "",
        branchNamePostFix: "",
        certOfPosting: "",
        companyName: "",
      },
      footer: {
        notFinancialReceipt: "",
        tc: "",
      },
      serviceItem: {
        address: "",
        addressValidated: "",
        consqLoss: "",
        itemValue: "",
        maximumComp: "",
        prePaid: "",
        pricePaid: "",
        reference: "",
        weightTitle: "",
      },
      sess: {
        acceptanceTime: "",
        after: "",
        before: "",
        sessionTitle: "",
      },
      services: [
        {
          name: "Special D by 9",
          footer:
            "Next day guaranteed delivery service.<br/>Tracking and signature at royalmail.com.<br/> With compensation for financial loss,<br/> separate from the item value.",
          lineItems: [
            {
              constants,
              trackingRef: "AA123456789GB",
              address: "23, BB8B 8BB, UK",
              itemValue: "500.10",
              maxComp: "250.01",
              maxCompPrice: "6.30",
              consqLoss: "5000.00",
              consqLossPrice: "5.82",
              weight: "99,999",
              price: "86.75",
              prePaid: "0.30",
            },
            {
              constants,
              trackingRef: "PF9876543219GB",
              address: "4332, Longstreetname, San Francisco, CA54321, USA",
              weight: "1,000",
              price: "9.09",
              customFields: [
                { key: "Test", value: "-£10.99" },
                { key: "Conditions accepted", value: "Y" },
              ],
            },
          ],
        },
        {
          name: "1st Class Small Parcel",
          footer: "Delivery aim: next working day.<br/>Delivery confirmation at royalmail.com.",
          lineItems: [
            {
              constants,
              trackingRef: "PF9876543219GB",
              address: "4332, Longstreetname, San Francisco, CA54321, USA",
              addressValidated: false,
              weight: "99,999",
              price: "9.09",
              customFields: [{ key: "Guaranteed delivery date", value: "29/02/2022" }],
            },
          ],
        },
        {
          constants,
          name: "Parcelforce Contract by 9",
          footer:
            "Your Parcel has been accepted<br/>under our existing Conditions of<br/>Carriage.<br/>Go to www.parcelforce.com/track or<br/>call 03448 004 466 for more info.",
          lineItems: [
            { constants, trackingRef: "AA123456789GB" },
            { constants, trackingRef: "AA123456790GB" },
            { constants, trackingRef: "AA123456791GB" },
          ],
        },
        {
          constants,
          name: "2nd Class Large Letter",
          footer:
            "Royal Mail aims to deliver your 2nd Class<br/>item within 3 working days.<br/>Visit www.royalmail.com to find out more<br/>about Royal Mail products and services",
          lineItems: [
            {
              constants,
              address: "23, BB8B 8BB, UK",
              weight: "99,999",
              price: "86.75",
            },
          ],
        },
      ],
    };
  });

  it("generates session info", () => {
    const template = Handlebars.compile(session);
    const data = copData.language === "cy" ? constants.cy : constants.en;
    const html = template({ ...copData, ...data });
    expect(html).toEqual(sessionCyFixture);
  });

  it("generates branchHeader info", () => {
    const template = Handlebars.compile(branchHeader);
    const data = copData.language === "cy" ? constants.cy : constants.en;
    const html = template({ ...copData, ...data });
    expect(html).toEqual(branchHeaderCyFixture);
  });

  it("generates service items", () => {
    const template = Handlebars.compile(serviceItems);
    const html = template(copData);
    expect(html).toEqual(serviceItemsCyFixture);
  });

  it("generates full cop", () => {
    const data = copData.language === "cy" ? constants.cy : constants.en;
    const html = generateCop({ ...copData, ...data });
    expect(html).toEqual(fullTemplateCyFixture);
  });

  it("generates correct language template", async () => {
    const data = copData.language === "cy" ? constants.cy : constants.en;
    const html = await getHTMLTemplate({ ...copData, ...data });
    expect(html).toEqual(fullTemplateCyFixture);
  });
});

describe("unhappy paths", () => {
  const errorData = { ...copData };
  errorData.format = "BOO";
  it("errors if format is not found", async () => {
    await expect(getHTMLTemplate(errorData)).rejects.toMatch("template not recognised");
  });
});
