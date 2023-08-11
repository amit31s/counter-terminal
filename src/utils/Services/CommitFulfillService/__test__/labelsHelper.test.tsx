import { UserResponseEnum } from "postoffice-commit-and-fulfill";
import {
  generateLabelErrorModal,
  generateLabelSuccessModal,
  generateRejectLabelItem,
} from "../labelsHelper";
const handleNext = jest.fn();
const handleRetry = jest.fn();
const handleCancel = jest.fn();
jest.mock("postoffice-product-journey-api-clients", () => {
  const apiClients = jest.requireActual("postoffice-product-journey-api-clients");
  apiClients.enablerAPIClientFactory.buildClient = jest.fn().mockReturnValue({
    getProduct: jest.fn().mockReturnValue({
      mediumName: "mediumName",
      itemType: "itemType",
      existingReversalAllowed: "existingReversalAllowed",
    }),
  });

  return apiClients;
});
describe("render labelsHelper ", () => {
  it("test generateLabelSuccessModal", async () => {
    const result = generateLabelSuccessModal(handleNext, handleRetry, handleCancel, "test-message");
    expect(result.id).toEqual("labelConfirmation");
  });

  it("test generateLabelErrorModal", async () => {
    const result = generateLabelErrorModal(handleNext, handleRetry);
    expect(result.modalProps.contentSize).toEqual("large");
  });

  it("test generateRejectLabelItem", async () => {
    const result = await generateRejectLabelItem(
      1234,
      "4",
      {},
      { fadCode: "test" },
      UserResponseEnum.Cancel,
    );
    expect(result.transaction.entryType).toEqual("mails");
    expect(result.fulfilment.fadCode).toEqual("test");
  });
});
