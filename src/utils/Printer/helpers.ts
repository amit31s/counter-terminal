import { WsServices } from "@ct/constants/WsConstants";
import axios from "axios";
import { SERVER_ROOT } from "../../common/backendUrl";
import { printReceiptBroadCast } from "../BroadcastChannels/helper";
import { authHeadersWithDeviceToken } from "../Services/authHeader";
import { wsp } from "../Websockets/ws-helper";

export interface PrinterLifecycle {
  onPrinterDiscovered?: () => void;
  onInitialize?: () => void;
  onTrigger?: () => void;
  printingStarted?: () => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const printers: [] = [];

export const rootURL = SERVER_ROOT;

export interface ConvertAPIReturn {
  result: string;
}

const convertHtml = async (html: string): Promise<ConvertAPIReturn> => {
  const params = {
    html,
  };
  const response = await axios.post(`${rootURL}/html-to-image/`, params, {
    headers: await authHeadersWithDeviceToken(),
  });
  return response.data as ConvertAPIReturn;
};

export const printRasterizedHtml = async (
  html: string,
  _events: PrinterLifecycle = {},
  _width = 580,
) => {
  try {
    await wsp.open();
    const res = await wsp.sendRequest({
      service: WsServices.receiptPrinter.service,
      action: WsServices.receiptPrinter.actions.PRINT,
      params: {
        html,
      },
    });
    console.log(res);
    await wsp.close();
  } catch (e) {
    console.error(e);
  }
};

export const printForSimulator = async (
  html: string,
  _events: PrinterLifecycle = {},
  _width = 580,
) => {
  try {
    const convertHtmlResponse = await convertHtml(html);
    printReceiptBroadCast(convertHtmlResponse.result);
  } catch (e) {
    console.log(`Failed to convert html to base64 ${html}`);
  }
};
