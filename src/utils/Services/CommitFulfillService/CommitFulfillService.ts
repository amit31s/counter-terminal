import {
  getBasket,
  getBasketIdStatus,
  getFulfillmentData,
  getSalesReceipt,
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
  SERVER_ROOT,
  useAppDispatch,
  useAppSelector,
  useGetUser,
} from "@ct/common";
import { getTerminalId } from "@ct/common/helpers/getTerminalId";
import { useBasket } from "@ct/common/hooks/homeScreenHooks/useBasket";
import { useAddBasketItem } from "@ct/common/hooks/useAddBasketItem";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { updatePaymentStatus } from "@ct/common/state/HomeScreen";
import {
  CommitStatus,
  FulfillmentStatus,
  updateCommitStatus,
  updateFulFillmentStatus,
  UpdateFulFillmentStatusValuePayload,
} from "@ct/common/state/HomeScreen/updateBasket.slice";
import {
  FulFillmentItem,
  FulfillmentStatusEnum,
  UpdateFulfillment,
  updateFulfillment,
} from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { updateFulfillmentError } from "@ct/common/state/HomeScreen/updateFulfillmentError.slice";
import { setLabelFulfilmentStage } from "@ct/common/state/labelFulfillment.slice";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { setCommitErrorModal } from "@ct/common/state/updateCommitApiStatusFlag.slice";
import { SalesReceiptData, updateSalesReceipt } from "@ct/common/state/updateSalesReceipt.slice";
import { apiConfig } from "@ct/components/JourneyRenderer/enablerConfig";
import { STATE_CONSTANTS, stringConstants, TEXT } from "@ct/constants";
import { IbasketItem, IInternalJourneyData } from "@ct/interfaces/basket.interface";
import { isNetworkError, transactionApiClient } from "@ct/utils";
import { getDeviceToken, getUserIdToken, getUserName } from "@ct/utils/Services/auth";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { cloneDeep, get } from "lodash";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import CommitAndFulfillProcessor, {
  BasketItemPayload,
  buildFulfillmentApiClient,
  EntryResponse,
  FulfillerResponse,
  FulfillmentProcessor,
  FulfillmentResponse,
  FulfilmentTypeEnum,
  MailsLabelsBroadcastChannel,
  PrintStatusEnum,
  UserResponseEnum,
} from "postoffice-commit-and-fulfill";
import {
  getEventTagMapping,
  IngenicoPedClient,
  LabelPrinterClient,
  ServiceEvent,
  setup as setupDeviceService,
  SupportedServices,
} from "postoffice-peripheral-management-service";
import { useEffect, useMemo, useRef } from "react";
import { authHeadersWithDeviceToken } from "../authHeader";
import commonReceipts from "../ReceiptService/commonReceipts";
import { useCommitFulfilPrompts } from "./CommitFulfilPrompts";
import {
  generateLabelErrorModal,
  generateLabelSuccessModal,
  generateRejectLabelItem,
} from "./labelsHelper";
import { CNF_LOGS_FN, CNF_LOGS_MSG, CNF_LOGS_VARS } from "@ct/common/constants/CNFLogs";

interface ICnfResponse {
  data: BasketItemPayload;
  commitStatus: CommitStatus;
  successEntryResponse?: EntryResponse;
}
type FulFillmentResponse = {
  data: BasketItemPayload;
  fulFillmentStatus: FulfillmentStatus;
};

interface FulfillmentResponseArray {
  item: BasketItemPayload;
  response: FulfillerResponse | FulfillmentResponse | Error;
  error: boolean;
}

type UpdateFulfillmentInternal = Omit<UpdateFulfillment, "deviceId"> & { deviceId?: string };

const isFulFillmentDuplicateItem = (
  previousItems: FulFillmentResponse[],
  recentCommited: BasketItemPayload,
) => {
  const matchedItem = previousItems.filter(
    (item) => item.data.uniqueID === recentCommited.uniqueID,
  );

  return matchedItem.length !== 0;
};

const checkCnfResponse = (cnfResponse: ICnfResponse[]) => {
  let needtoUpdateFulfillmentRequiredFlag = false;
  for (const item of cnfResponse) {
    if (item?.successEntryResponse?.fulfilmentRequired) {
      needtoUpdateFulfillmentRequiredFlag = true;
    }
  }

  return { needtoUpdateFulfillmentRequiredFlag };
};
const updateFulFillmentStatusBasketItems = (
  basketItems: IbasketItem[],
  fulFillmentResponse: FulFillmentResponse[],
) => {
  for (let index = 0; index < fulFillmentResponse.length; index++) {
    for (let index1 = 0; index1 < basketItems.length; index1++) {
      if (
        fulFillmentResponse[index].data.uniqueID ===
        basketItems[index1].journeyData?.transaction.uniqueID
      ) {
        basketItems[index1].fulFillmentStatus = fulFillmentResponse[index].fulFillmentStatus;
      }
    }
  }

  return { updatedBasketItems: basketItems };
};

export const useGetCommitFulfillClient = async (): Promise<FulfillmentProcessor | null> => {
  const {
    device: { deviceID },
  } = useGetUser();
  const commitAndFulfilLogger = logManager(LOGGER_TYPE.commitAndFulfilLogger);
  const { basketItems } = useAppSelector(getBasket);
  const basketItemsClone = cloneDeep(basketItems);
  const { basketItemByUuid } = useBasket();
  const { fulfillmentRequired } = useAppSelector(getFulfillmentData);
  const { device: deviceData } = useAppSelector((rootState) => rootState.auth);
  const dispatch = useAppDispatch();
  const cnfResponse: ICnfResponse[] = [];
  const fulFillmentResponse: FulFillmentResponse[] = [];
  const fulfillmentResponseArray: FulfillmentResponseArray[] = [];
  const { basketId } = useAppSelector(getBasketIdStatus);
  const transactionAPI = transactionApiClient();

  const receiptService = useReceiptService();
  const receiptData: SalesReceiptData = useAppSelector(getSalesReceipt);
  const worldlineTransactionId = useRef<string>("");

  const addBasketItem = useAddBasketItem();

  const currentAddBasketItem = useRef(addBasketItem);
  useEffect(() => {
    currentAddBasketItem.current = addBasketItem;
  }, [addBasketItem]);

  const { onShowModel, onHideModel } = useCommitFulfilPrompts();

  const labelResponse = useRef<ICnfResponse>();

  const isPaymentTransaction = (entryType: string, fulfilmentAction: string) => {
    return ["paymentMode"].includes(entryType) || ["debit", "refund"].includes(fulfilmentAction);
  };

  const { pinPad, labelPrinter } = useMemo(() => {
    const devices = setupDeviceService({
      deviceServerHost: POL_DEVICE_SERVER_HOST,
      disconnectAfterResponse: true,
      callbacks: {
        onReceiptContent: async (event: ServiceEvent) => {
          if (event.service === SupportedServices.IngenicoPed) {
            const receipt = commonReceipts.cardSignatureRequired(
              event.message,
              worldlineTransactionId.current,
            );

            // taken from other areas of this file - doesn't feel right... surley basketId should
            // be available in tate already and we shouldn't have to call an API to obtain this?
            const _basketId =
              typeof basketId === "string" && basketId.length > 0
                ? basketId
                : (await transactionAPI.getLastBasket()).data.basket.basketCore.basketID;

            receipt.context.basketId = _basketId;

            await receiptService.printReceipt(receipt);
          }
        },
        onDisplayUpdate: (event: ServiceEvent) => {
          if (event.service === SupportedServices.IngenicoPed) {
            const eventTag = getEventTagMapping(event.message);
            const primaryEvent = event.availableEvents?.[0];
            const secondaryEvent = event.availableEvents?.[1];
            dispatch(
              setLoadingActive({
                id: LoadingId.PIN_PAD,
                modalProps: {
                  title: stringConstants.pinPadModalTitle,
                  content:
                    eventTag !== undefined
                      ? `${eventTag.id} - ${eventTag.description}`
                      : event.message,
                  primaryButtonProps: primaryEvent
                    ? {
                        label: primaryEvent.label,
                        onPress: async () => {
                          await pinPad.sendEvent(primaryEvent.event);
                          dispatch(setLoadingInactive(LoadingId.PIN_PAD));
                        },
                      }
                    : undefined,
                  secondaryButtonProps: secondaryEvent
                    ? {
                        label: secondaryEvent.label,
                        onPress: async () => {
                          await pinPad.sendEvent(secondaryEvent.event);
                          dispatch(setLoadingInactive(LoadingId.PIN_PAD));
                        },
                      }
                    : undefined,
                },
              }),
            );
          }
        },
      },
    });

    const terminalId = getTerminalId(deviceData.branchID, deviceData.nodeID);

    const pinPadClient = devices.buildClient(SupportedServices.IngenicoPed, {
      terminalId,
      clerkId: getUserName(),
      useMock: POL_DEVICE_SERVER_SIMULATED,
    }) as IngenicoPedClient;

    const labelPrinterClient = devices.buildClient(SupportedServices.LabelPrinter, {
      useMock: POL_DEVICE_SERVER_SIMULATED,
    }) as LabelPrinterClient;

    return {
      pinPad: pinPadClient,
      labelPrinter: labelPrinterClient,
    };
  }, [deviceData.branchID, deviceData.nodeID, basketId, transactionAPI, receiptService, dispatch]);

  const dispatchFulFillmentStatus = (items: IbasketItem[]) => {
    const fulFillmentStatusPayload: UpdateFulFillmentStatusValuePayload = {};
    items.forEach((item) => {
      fulFillmentStatusPayload[item.id] = item.fulFillmentStatus;
    });
    dispatch(updateFulFillmentStatus(fulFillmentStatusPayload));
  };

  const fulfillClient = buildFulfillmentApiClient(SERVER_ROOT + "/transactions/", "v3", () =>
    authHeadersWithDeviceToken(),
  );

  const handleCommitResponse = async () => {
    const { needtoUpdateFulfillmentRequiredFlag } = checkCnfResponse(cnfResponse);

    if (needtoUpdateFulfillmentRequiredFlag && !fulfillmentRequired) {
      setFulfillmentRequiredFlag();
      return;
    }
  };

  const updateFulfillmentState = (data: UpdateFulfillmentInternal) => {
    data.deviceId = deviceID;
    dispatch(updateFulfillment(data as UpdateFulfillment));
  };

  const handleFulfillmentResponse = async () => {
    const itemsToFulfilled = cnfResponse.filter(
      (cnfResponseObj) => cnfResponseObj?.successEntryResponse?.fulfilmentRequired,
    );
    const { updatedBasketItems } = updateFulFillmentStatusBasketItems(
      [...basketItemsClone],
      fulFillmentResponse,
    );
    dispatchFulFillmentStatus(updatedBasketItems);
    if (itemsToFulfilled.length === fulfillmentResponseArray.length) {
      let fulfillmentError = false;
      const item: FulFillmentItem[] = [];
      for (let index = 0; index < fulfillmentResponseArray.length; index++) {
        const element = fulfillmentResponseArray[index];
        if (element.error) {
          fulfillmentError = true;
        }
        let id = element?.item?.uniqueID;
        if (!id) {
          commitAndFulfilLogger.info({
            methodName: CNF_LOGS_FN.handleFulfillmentResponse,
            message: CNF_LOGS_MSG.warningNoUid,
          });
          id = element.item.transactionStartTime + "";
        }
        let error: string | undefined;
        if ("notice" in element.response && element.response.notice) {
          error = `${element.response.notice.id} - ${element.response.notice.description}`;
        }
        item.push({
          id,
          fulfillmentStatus: element.error
            ? FulfillmentStatusEnum.FAILED
            : FulfillmentStatusEnum.SUCCESS,
          error,
        });
      }
      const updateFulfillmentPayload: UpdateFulfillmentInternal = {};
      updateFulfillmentPayload.fulfillmentStatus = fulfillmentError
        ? FulfillmentStatusEnum.FAILED
        : FulfillmentStatusEnum.SUCCESS;
      updateFulfillmentPayload.item = item;
      updateFulfillmentState(updateFulfillmentPayload);
    }
  };

  const onCommitError = (data: BasketItemPayload, error: Error): void => {
    dispatch(updateCommitStatus({ id: data.uniqueID, commitStatus: CommitStatus.fail }));
    const errorRes: ICnfResponse = {
      commitStatus: CommitStatus.fail,
      data,
    };
    cnfResponse.push(errorRes);
    dispatch(
      updatePaymentStatus({
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmountTxCommited: false,
      }),
    );
    handleCommitResponse();
    const msg = get(error, "response.data.errorCode", "Entry creation failed");
    commitAndFulfilLogger.error({
      methodName: CNF_LOGS_FN.onCommitError,
      message: msg,
      error,
      data,
    });
    if (isNetworkError(error)) {
      dispatch(showNoNetworkModal());
      return;
    }
    dispatch(setCommitErrorModal());
  };

  const setFulfillmentRequiredFlag = () => {
    dispatch(
      updateFulfillment({
        fulfillmentRequired: true,
        deviceId: deviceID,
      }),
    );
  };

  /*
    Function to print branch receipt.
  */

  const printBranchReceipt = async (journeyData: IInternalJourneyData, defaultContext: object) => {
    await receiptService.printReceipt({
      template: journeyData.branchReceipt.template,
      context: {
        ...journeyData.branchReceipt.context,
        ...defaultContext,
      },
      printingMessage: journeyData.branchReceipt.printingMessage,
      optional: journeyData.branchReceipt.optional,
      ...(journeyData.branchReceipt.clerkConfirmation && {
        clerkConfirmation: journeyData.branchReceipt.clerkConfirmation,
      }),
    });
  };

  const onCommitSuccess = async (
    commitedItem: BasketItemPayload,
    response: EntryResponse,
  ): Promise<void> => {
    dispatch(updateCommitStatus({ id: commitedItem.uniqueID, commitStatus: CommitStatus.success }));

    if (response.fulfilmentRequired) {
      if (response.fulfilmentType === FulfilmentTypeEnum.Ped) {
        worldlineTransactionId.current = commitedItem?.tokens?.horizonTransactionID as string;
        dispatch(
          setLoadingActive({
            id: LoadingId.PIN_PAD,
            modalProps: { title: stringConstants.pinPadModalTitle, content: TEXT.CTTXT0007 },
          }),
        );
      }

      if (response.fulfilmentType === FulfilmentTypeEnum.Label) {
        const labelChannel = new BroadcastChannel(MailsLabelsBroadcastChannel);

        labelChannel.onmessage = async (event) => {
          if (typeof event.data !== "object" || typeof event.data.status !== "string") {
            commitAndFulfilLogger.error({
              methodName: CNF_LOGS_FN.onCommitSuccess,
              error: new Error(
                `Malformed label message, expected: {status: string, ...}, received: ${JSON.stringify(
                  event.data,
                )}`,
              ),
            });
          }

          const handleNext = () => {
            labelChannel.postMessage({ userResponse: UserResponseEnum.Next });
            labelChannel.close();
            dispatch(setLoadingInactive(LoadingId.LABEL_CONFIRMATION));
            dispatch(setLabelFulfilmentStage("SUCCESSFUL"));
          };

          const handleErrorResponse = async (
            userResponse: UserResponseEnum.Retry | UserResponseEnum.Cancel,
          ) => {
            if (
              typeof event.data.receiptData === "object" &&
              typeof event.data.receiptData.template === "string" &&
              typeof event.data.receiptData.context === "object"
            ) {
              await receiptService.printReceipt({
                template: event.data.receiptData.template,
                context: event.data.receiptData.context,
              });
            } else {
              console.error("receipt not printed");
            }
            // Add reject label (id = item.tokens.RejectProdNo) to basket with userResponse and original item id.
            if (
              typeof commitedItem.tokens !== "object" ||
              typeof commitedItem.tokens?.RejectProdNo !== "string" ||
              typeof commitedItem.tokens?.BalancingProdNo !== "string"
            ) {
              commitAndFulfilLogger.error({
                methodName: CNF_LOGS_FN.onCommitSuccess,
                error: new Error(CNF_LOGS_MSG.failedToAddRejectLabel),
              });
            } else {
              const item = await generateRejectLabelItem(
                commitedItem.valueInPence,
                String(commitedItem.entryID),
                commitedItem.tokens,
                commitedItem.fulfilment as Record<string, string>,
                userResponse,
              );
              await currentAddBasketItem.current(item);
            }
            labelChannel.postMessage({ userResponse });
          };

          const handleRetry = async () => {
            dispatch(setLoadingInactive(LoadingId.LABEL_CONFIRMATION));
            await handleErrorResponse(UserResponseEnum.Retry);
          };

          const handleCancel = async () => {
            dispatch(setLoadingInactive(LoadingId.LABEL_CONFIRMATION));
            await handleErrorResponse(UserResponseEnum.Cancel);
            labelChannel.close();
            dispatch(setLabelFulfilmentStage("FAILED"));
          };

          switch (event.data.status) {
            case PrintStatusEnum.LabelPrintComplete:
              // CnF label printed successfully, check if it printed correctly
              commitAndFulfilLogger.info({
                methodName: CNF_LOGS_FN.onCommitSuccess,
                message: CNF_LOGS_MSG.labelPrintingSuccess,
              });
              dispatch(
                setLoadingActive(
                  generateLabelSuccessModal(
                    handleNext,
                    handleRetry,
                    handleCancel,
                    commitedItem.tokens?.segregationMessage,
                  ),
                ),
              );
              break;

            case PrintStatusEnum.LabelPrintError:
              // CnF label errored while printing
              commitAndFulfilLogger.error({
                methodName: CNF_LOGS_FN.onCommitSuccess,
                error: new Error(CNF_LOGS_VARS.labelPrintingFailed(event.data.errorMessage)),
              });

              // Prompt whether to retry or cancel
              dispatch(setLoadingActive(generateLabelErrorModal(handleRetry, handleCancel)));
              break;

            default:
              commitAndFulfilLogger.error({
                methodName: CNF_LOGS_FN.onCommitSuccess,
                error: new Error(CNF_LOGS_VARS.unRecognisedLabelError(event.data.status)),
              });
          }
        };
      }
    } else {
      fulFillmentResponse.push({
        data: commitedItem,
        fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_REQUIRED,
      });

      handleFulfillmentResponse();
    }

    // dont move handleCommitResponse and logger after customer receipt
    // because if customer receipt breaks due to ay reason then it will break CT basket processing
    // and basket balancing
    const successRes: ICnfResponse = {
      commitStatus: CommitStatus.success,
      data: commitedItem,
      successEntryResponse: response,
    };
    cnfResponse.push(successRes);
    if (response.fulfilmentType === FulfilmentTypeEnum.Label) {
      labelResponse.current = successRes;
    }
    if (
      labelResponse.current !== undefined &&
      commitedItem.originalItemEntryId === String(labelResponse.current?.data.entryID)
    ) {
      cnfResponse.push(labelResponse.current);
    }
    handleCommitResponse();
    commitAndFulfilLogger.info({
      methodName: CNF_LOGS_FN.onCommitSuccess,
      message: CNF_LOGS_MSG.entryCreated,
      data: { commitedItem, response },
    });

    const basketItem = basketItemByUuid(commitedItem.uniqueID as string) as IbasketItem;

    if (basketItem) {
      const journeyData = basketItem?.journeyData;

      const defaultContext = {
        basketId:
          typeof basketId === "string" && basketId.length > 0
            ? basketId
            : (await transactionAPI.getLastBasket()).data.basket.basketCore.basketID,
        entryId: commitedItem.entryID,
        basketItem,
      };

      // print customer receipt if present
      if (journeyData?.customerReceipt) {
        await receiptService.printReceipt({
          template: journeyData.customerReceipt.template,
          context: {
            ...journeyData.customerReceipt.context,
            ...defaultContext,
          },
          printingMessage: journeyData.customerReceipt.printingMessage,
          optional: journeyData.customerReceipt.optional,
          ...(journeyData.customerReceipt.clerkConfirmation && {
            clerkConfirmation: journeyData.customerReceipt.clerkConfirmation,
          }),
        });
      }

      // print branch receipt if required
      if (journeyData?.branchReceipt) {
        printBranchReceipt(journeyData, defaultContext);
      }
    }
  };
  const onFulfillmentError = async (
    item: BasketItemPayload,
    errorResponse: FulfillerResponse | Error,
  ): Promise<void> => {
    if (isNetworkError(errorResponse)) {
      dispatch(showNoNetworkModal());
    }
    const entryType = item.entryType ?? "";
    const fulfilmentAction = item.tokens?.fulfilmentAction ?? "";

    if (["banking"].includes(entryType) || isPaymentTransaction(entryType, fulfilmentAction)) {
      worldlineTransactionId.current = "";
      dispatch(setLoadingInactive(LoadingId.PIN_PAD));
    }

    if (
      labelResponse.current !== undefined &&
      item.originalItemEntryId === String(labelResponse.current?.data.entryID)
    ) {
      fulfillmentResponseArray.push({
        item: labelResponse.current.data,
        response: errorResponse,
        error: true,
      });
    } else {
      fulfillmentResponseArray.push({
        item,
        response: errorResponse,
        error: true,
      });
    }
    const isDuplicate = isFulFillmentDuplicateItem(fulFillmentResponse, item);
    if (!isDuplicate) {
      fulFillmentResponse.push({
        data: item,
        fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_FAILED,
      });
    }
    handleFulfillmentResponse();
    commitAndFulfilLogger.error({
      methodName: CNF_LOGS_FN.onFulfillmentError,
      data: errorResponse,
    });

    if (errorResponse instanceof Error) {
      // handle generic error
      return;
    }

    // using cloneDeep because errorResponse is not extendable
    // NOTE clone or {...} would not work
    const fulfillerResponse = cloneDeep(errorResponse) as FulfillerResponse;

    if (fulfillerResponse?.notice !== undefined) {
      dispatch(
        updateFulfillmentError({
          errorResponse,
          uuid: item?.uniqueID,
        }),
      );
    }

    if (fulfillerResponse?.receipts !== undefined) {
      const basketID =
        typeof basketId === "string" && basketId.length > 0
          ? basketId
          : (await transactionAPI.getLastBasket()).data.basket.basketCore.basketID;
      for (const receipt of fulfillerResponse.receipts) {
        receipt.context.basketId = basketID;
        await receiptService.printReceipt({
          template: receipt.template,
          context: { ...receipt.context, basketItem: item },
          printingMessage: receipt.printingMessage,
          optional: false,
          clerkConfirmation: receipt.clerkConfirmation,
        });
      }
    }
  };

  const onFulfillmentSuccess = async (
    item: BasketItemPayload,
    response: FulfillerResponse | FulfillmentResponse,
  ): Promise<void> => {
    const cardDetails: string[] = receiptData.cardDetails
      ? Object.assign([], receiptData.cardDetails)
      : [];

    const entryType = item.entryType ?? "";
    const fulfilmentAction = item.tokens?.fulfilmentAction ?? "";
    const isPayment = isPaymentTransaction(entryType, fulfilmentAction);

    if (["banking"].includes(entryType) || isPayment) {
      worldlineTransactionId.current = "";
      dispatch(setLoadingInactive(LoadingId.PIN_PAD));
    }

    fulfillmentResponseArray.push({
      item,
      response,
      error: false,
    });
    const isDuplicate = isFulFillmentDuplicateItem(fulFillmentResponse, item);
    if (!isDuplicate) {
      fulFillmentResponse.push({
        data: item,
        fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_SUCCESS,
      });
    }
    handleFulfillmentResponse();
    commitAndFulfilLogger.info({
      methodName: CNF_LOGS_FN.onFulfillmentSuccess,
      message: CNF_LOGS_MSG.onFulfillmentSuccessMessage,
      data: {
        response,
        item,
      },
    });
    const fulfillerResponse = response as FulfillerResponse;
    if (isPayment && fulfillerResponse?.result?.customerTicket) {
      cardDetails?.push(fulfillerResponse.result.customerTicket as string);
      dispatch(
        updateSalesReceipt({
          recieptType: "success",
          cardDetails: cardDetails,
        }),
      );
    }

    if (fulfillerResponse.receipts !== undefined) {
      const basketID =
        typeof basketId === "string" && basketId.length > 0
          ? basketId
          : (await transactionAPI.getLastBasket()).data.basket.basketCore.basketID;
      for (const receipt of fulfillerResponse.receipts) {
        receipt.context.basketId = basketID;
        await receiptService.printReceipt({
          template: receipt.template,
          context: {
            ...receipt.context,
            basketItem: item,
          },
          printingMessage: receipt.printingMessage,
          optional: false, // we should always print a fulfillment receipt
          clerkConfirmation: receipt.clerkConfirmation,
        });
      }
    }
  };

  return CommitAndFulfillProcessor(
    transactionAPI.client,
    {
      onCommitSuccess,
      onCommitError,
      onFulfillmentSuccess,
      onFulfillmentError,
      onShowModel,
      onHideModel,
    },
    apiConfig,
    getUserIdToken,
    getDeviceToken,
    fulfillClient,
    {
      ped: pinPad,
      label: labelPrinter,
    },
  );
};
