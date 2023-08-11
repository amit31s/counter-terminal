import {
  StyledDefaultPrintOutlinedIcon,
  StyledDefaultWarningAmberIcon,
  StyledErrorWarningAmberIcon,
} from "@ct/assets/icons";
import {
  POL_DEVICE_SERVER_HOST,
  POL_DEVICE_SERVER_SIMULATED,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { PED_LOGS_FN, PED_LOGS_MSG, PED_LOGS_VARS } from "@ct/common/constants/PEDLogs";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { stringConstants } from "@ct/constants";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import moment from "moment";
import { Box } from "native-base";
import {
  ReceiptPrinterClient,
  ReceiptPrinterModes,
  ReceiptPrinterResult,
  SupportedServices,
  setup,
} from "postoffice-peripheral-management-service";
import { DataRecords } from "postoffice-product-journey-api-clients/dist/configuration-api";
import { compile } from "postoffice-receipt-generator";
import storage from "postoffice-spm-async-storage";
import commonReceipts from "./commonReceipts";
export interface ReceiptService {
  printReceipt: (
    templateId: string,
    context: Record<string, unknown>,
  ) => Promise<ReceiptPrinterResult>;
}

export interface Receipt {
  template: string;
  context: Record<string, unknown>;
  printingMessage?: string;
  optional?: boolean;
  clerkConfirmation?: {
    title: string;
    description: string;
    actionTitle: string;
  };
}

interface ReceiptError {
  action: string;
  event: string;
  message: string;
  requestId: string;
  service: string;
}

export type ReceiptContext = Record<string, unknown>;
const pmsLogger = logManager(LOGGER_TYPE.pmsLogger);

export const doPrinting = async (
  text: string,
  printingMode: ReceiptPrinterModes,
): Promise<ReceiptPrinterResult> => {
  const printingService = setup({
    deviceServerHost: POL_DEVICE_SERVER_HOST,
    disconnectAfterResponse: true,
  });

  if (POL_DEVICE_SERVER_SIMULATED) {
    // introduce an artificial delay to simulate the receipt printer
    // this only gets executed when the device server is in simulated mode
    await new Promise((r) => setTimeout(r, 2000));
  }

  const receiptPrinterClient = printingService.buildClient(SupportedServices.ReceiptPrinter, {
    useMock: POL_DEVICE_SERVER_SIMULATED,
  }) as ReceiptPrinterClient;

  return await receiptPrinterClient.print(text, printingMode);
};

export const compileReceipt = async (
  templateId: string,
  context: ReceiptContext,
): Promise<string> => {
  const template = (await storage.getRecord(templateId, {
    prefix: `_config/receipt-template`,
  })) as unknown as DataRecords;

  if (!template || !template.value) {
    throw new Error(`Receipt template '${templateId}' not found`);
  }

  return await compile(template.value as string, context);
};

export const printPhysicalReceipt = async (
  templateId: string,
  context: Record<string, unknown>,
): Promise<ReceiptPrinterResult> => {
  if (!templateId || !context) {
    throw new Error("Missing context and/or template name");
  }

  const compiledTemplate = await compileReceipt(templateId, context as ReceiptContext);

  if (!compiledTemplate) {
    throw new Error(`Unable to locate receipt template '${templateId || "not provided"}'`);
  }

  // receipts are currently generated in html mode, however, text mode is crisper, this
  // provides the ability for teams to specify mode for printing, when all teams transition
  // across, receipt templates can be text only & this can be defaulted.
  const printMode = context.textMode ? ReceiptPrinterModes.Text : ReceiptPrinterModes.Html;

  return await doPrinting(compiledTemplate, printMode);
};

export const useReceiptService = () => {
  const { device, user } = useAppSelector((rootState) => rootState.auth);
  const dispatch = useAppDispatch();

  const printReceipt = async (receipt: Receipt): Promise<ReceiptPrinterResult> => {
    if (!receipt.template || !receipt.context) {
      throw new Error("Missing context and/or template");
    }

    // if we have a clerk confirmation, present it and wait for the action to be completed
    const waitForClerkConfirmation = new Promise<void>((resolve) => {
      if (receipt.clerkConfirmation) {
        const { title, description, actionTitle } = receipt.clerkConfirmation;
        dispatch(
          setLoadingActive({
            id: LoadingId.PRINTING,
            modalProps: {
              icon: (
                <Box testID="CustomIconTestID">
                  <StyledDefaultWarningAmberIcon />
                </Box>
              ),
              title: title,
              content: description,
              primaryButtonProps: {
                label: actionTitle,
                onPress: () => {
                  dispatch(setLoadingInactive(LoadingId.PRINTING));
                  resolve();
                },
              },
            },
          }),
        );
      } else {
        resolve();
      }
    });

    await waitForClerkConfirmation;

    dispatch(
      setLoadingActive({
        id: LoadingId.PRINTING,
        modalProps: {
          title: stringConstants.ReceiptPrintingModal.title,
          content: receipt.printingMessage || stringConstants.ReceiptPrintingModal.defaultMessage,
          icon: (
            <Box testID="CustomIconTestID">
              <StyledDefaultPrintOutlinedIcon />
            </Box>
          ),
        },
      }),
    );

    // if optional is true perhaps we offer the clerk the option to print the receipt or not?

    try {
      pmsLogger.info({
        methodName: PED_LOGS_FN.printReceipt,
        message: PED_LOGS_VARS.receiptPriniting(receipt.template, receipt.optional),
      });

      const printReceiptResult = await printPhysicalReceipt(receipt.template, {
        ...receipt.context,
        ...{
          device,
          user,
        },
        date: moment().format("DD/MM/YYYY"),
        time: moment().format("H:mm"),
      });

      // an exception would be thrown if printing wasn't successful
      pmsLogger.info({
        methodName: PED_LOGS_FN.printReceipt,
        message: PED_LOGS_MSG.receiptPrintSuccess,
      });
      dispatch(setLoadingInactive(LoadingId.PRINTING));

      return printReceiptResult;
    } catch (error) {
      const receiptError = error as ReceiptError;
      return new Promise((resolve) => {
        dispatch(
          setLoadingActive({
            id: LoadingId.PRINTING,
            modalProps: {
              icon: <StyledErrorWarningAmberIcon />,
              title: stringConstants.ReceiptPrintingModal.printFailureMessage,
              content: receiptError?.message,
              primaryButtonProps: {
                label: stringConstants.Button.Retry,
                onPress: () => {
                  dispatch(setLoadingInactive(LoadingId.PRINTING));
                  resolve(printReceipt(receipt));
                },
              },
              secondaryButtonProps: {
                label: stringConstants.Button.Continue,
                onPress: () => {
                  dispatch(setLoadingInactive(LoadingId.PRINTING));
                  resolve({ result: { printed: false } } as ReceiptPrinterResult);
                },
              },
            },
          }),
        );
      });
    }
  };

  return {
    printReceipt,
    templates: commonReceipts,
  };
};
