import { getProductByProdNo } from "@ct/common";
import { LoadingId, LoadingStatusEntry } from "@ct/common/state/loadingStatus.slice";
import { TEXT } from "@ct/constants";
import { IInternalJourneyData } from "@ct/interfaces/basket.interface";
import { uuid } from "@ct/utils/utils";
import { cloneDeep } from "lodash";
import { Box, Text } from "native-base";
import {
  BasketItemPayload,
  CommitAndFulfillPointEnum,
  EntryCore,
  UserResponseEnum,
} from "postoffice-commit-and-fulfill";

export function generateLabelSuccessModal(
  handleNext: () => void,
  handleRetry: () => void,
  handleCancel: () => void,
  segregationMessage?: string,
): LoadingStatusEntry {
  return {
    id: LoadingId.LABEL_CONFIRMATION,
    modalProps: {
      contentSize: "large",
      icon: false,
      title: "",
      content: (
        <>
          <Box flexDir="row" alignItems="start">
            <Text width="2ch">1.</Text>
            <Text flex={1}>{TEXT.CTTXT0045(segregationMessage)}</Text>
          </Box>
          <Box flexDir="row" alignItems="start">
            <Text width="2ch">2.</Text>
            <Text flex={1}>{TEXT.CTTXT0046}</Text>
          </Box>
          <Box flexDir="row" alignItems="start">
            <Text width="2ch">3.</Text>
            <Text flex={1}>{TEXT.CTTXT0047}</Text>
          </Box>
        </>
      ),
      primaryButtonProps: {
        label: "Next",
        onPress: handleNext,
      },
      secondaryButtonProps: [
        {
          label: "Re-print label",
          onPress: handleRetry,
        },
        {
          label: "Cancel",
          onPress: handleCancel,
        },
      ],
    },
  };
}

export function generateLabelErrorModal(
  handleRetry: () => void,
  handleCancel: () => void,
): LoadingStatusEntry {
  return {
    id: LoadingId.LABEL_CONFIRMATION,
    modalProps: {
      contentSize: "large",
      icon: false,
      title: "Error in printing label",
      content: TEXT.CTTXT0048,
      primaryButtonProps: {
        label: "Retry",
        onPress: handleRetry,
      },
      secondaryButtonProps: {
        label: "Cancel",
        onPress: handleCancel,
      },
    },
  };
}

export async function generateRejectLabelItem(
  originalItemValueInPence: number,
  originalItemEntryId: string,
  originalTokens: Required<EntryCore>["tokens"],
  fulfilment: Required<BasketItemPayload>["fulfilment"],
  userResponse: UserResponseEnum.Cancel | UserResponseEnum.Retry,
): Promise<IInternalJourneyData> {
  const { mediumName } = await getProductByProdNo(originalTokens.RejectProdNo);

  const tokens = cloneDeep(originalTokens);
  delete tokens?.requestUDID;

  return {
    basket: {
      id: mediumName,
    },
    transaction: {
      commitAndFulfillPoint: CommitAndFulfillPointEnum.Immediate,
      entryType: "mails",
      itemID: originalTokens.RejectProdNo,
      quantity: "1",
      quantityFixed: "true",
      receiptLine: "1",
      transactionStartTime: Math.floor(Date.now() / 1000),
      uniqueID: uuid(),
      valueInPence: originalItemValueInPence,
      originalItemEntryId,
      userResponse,
      tokens: {
        fadCode: originalTokens.fadCode,
        terminalID: originalTokens.terminalID,
        labelTemplate: originalTokens.labelTemplate,
        requiredAtDelivery: originalTokens.requiredAtDelivery,
        returnToSenderPostCode: originalTokens.returnToSenderPostCode,
        destinationCountry: originalTokens.destinationCountry,
        destinationISOCode: originalTokens.destinationISOCode,
        upuTrackingNumber: originalTokens.upuTrackingNumber,
        RMServiceID: originalTokens.RMServiceID,
        serviceId: originalTokens.serviceId,
        weightType: originalTokens.weightType,
        service: originalTokens.service,
        postcode: originalTokens.postcode,
        price: originalTokens.price,
        vatCode: originalTokens.vatCode,
        segCode: originalTokens.segCode,
        barCodeReq: originalTokens.barCodeReq,
        town: originalTokens?.town,
        weight: originalTokens?.weight,
        satDel: originalTokens?.satDel,
        twoDBarcode: originalTokens?.twoDBarcode,
        altServiceId: originalTokens?.altServiceId,
        firstAddressLine: originalTokens?.firstAddressLine,
        entryID: originalItemEntryId,
      },
      additionalItems: [
        {
          itemID: originalTokens?.BalancingProdNo,
          valueInPence: -originalItemValueInPence,
          quantity: 1,
        },
      ],
    },
    fulfilment: {
      fadCode: fulfilment.fadCode,
      terminalID: fulfilment.terminalID,
      labelTemplate: fulfilment.labelTemplate,
      requiredAtDelivery: fulfilment.requiredAtDelivery,
      returnToSenderPostCode: fulfilment.returnToSenderPostCode,
      destinationCountry: fulfilment.destinationCountry,
      destinationISOCode: fulfilment.destinationISOCode,
      upuTrackingNumber: fulfilment.upuTrackingNumber,
      RMServiceID: fulfilment.RMServiceID,
      weightType: fulfilment.weightType,
      service: fulfilment.service,
      postcode: fulfilment.postcode,
      price: fulfilment.price,
      vatCode: fulfilment.vatCode,
      segCode: fulfilment.segCode,
      barCodeReq: fulfilment.barCodeReq,
      town: fulfilment?.town,
      weight: fulfilment?.weight,
      satDel: fulfilment?.satDel,
      altServiceId: fulfilment?.altServiceId,
      firstAddressLine: fulfilment?.firstAddressLine,
    },
  };
}
