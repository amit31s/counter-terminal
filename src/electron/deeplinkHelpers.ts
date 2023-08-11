import { BrowserWindow } from "electron";
import queryString from "query-string";
import { DEEPLINK } from "./electronConstants";

export interface DeeplinkData {
  screen: string;
  params: Record<string, unknown>;
}

export const APP_PROTOCOL = "po";
export const CT_PROTOCOL = "ct";
export const BBO_PROTOCOL = "bbo";

let deeplinkData: DeeplinkData | null = null;

export const deeplinkReady = (mainWindow: BrowserWindow | null) => {
  if (deeplinkData) {
    mainWindow?.webContents.send(DEEPLINK, deeplinkData.screen, deeplinkData.params);
    deeplinkData = null;
  }
};

interface DeeplinkIntoRendererParams {
  mainWindow: BrowserWindow | null;
  appUrl: string;
  urlContents: string;
}

const deeplinkIntoRenderer = async ({
  mainWindow,
  appUrl,
  urlContents,
}: DeeplinkIntoRendererParams) => {
  await mainWindow?.loadURL(appUrl);

  const urlSplit = urlContents.split(`?`);
  const params = urlSplit.length < 2 ? {} : queryString.parse(`?${urlSplit[1]}`);

  deeplinkData = {
    screen: urlSplit[0],
    params,
  };
};

export const handleDeeplink = async (
  url: string,
  mainWindow: BrowserWindow | null,
  COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY: string,
  BACK_OFFICE_WINDOW_WEBPACK_ENTRY: string,
) => {
  const urlSplit = url.split(`${APP_PROTOCOL}://`);
  if (urlSplit.length < 2) {
    return;
  }

  const isCT = urlSplit[1].startsWith(`${CT_PROTOCOL}`);
  const isBBO = urlSplit[1].startsWith(`${BBO_PROTOCOL}`);

  if (!isCT && !isBBO) {
    return;
  }

  const currentAppProtocol = isCT ? CT_PROTOCOL : BBO_PROTOCOL;
  const urlContents = urlSplit[1].substring(currentAppProtocol.length);
  deeplinkIntoRenderer({
    mainWindow,
    appUrl: isCT ? COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY : BACK_OFFICE_WINDOW_WEBPACK_ENTRY,
    urlContents,
  });
};
