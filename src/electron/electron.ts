import {
  apiLogger,
  applicationLogger,
  errorLogger,
  fatalLogger,
  fileLocation,
  journeyEngineLogger,
  logDataToFile,
  miscLogger,
  reduxLogger,
} from "@pol/frontend-logger-node";
import { exec } from "child_process";
import dotenv from "dotenv";
import { BrowserWindow, IpcMainInvokeEvent, app, ipcMain, powerMonitor, session } from "electron";
import {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  default as installExtension,
} from "electron-devtools-installer";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { APP_PROTOCOL, deeplinkReady, handleDeeplink } from "./deeplinkHelpers";
import {
  CLEAR_DATA,
  FRONTEND_LOGGER,
  GET_SERIAL_NUMBER,
  LAUNCH_BO,
  LAUNCH_CT,
  ON_RESUME,
  RESTART_APP,
  SAVE_LOGIN_DETAILS,
} from "./electronConstants";
import { initAutoupdater } from "./updateServer";

dotenv.config();

declare const COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY: string;
declare const COUNTER_TERMINAL_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const BACK_OFFICE_WINDOW_WEBPACK_ENTRY: string;

const isDev = process.env.NODE_ENV !== "production";
const electronDebug = process.env.REACT_APP_USING_ELECTRON === "true";
const showFrame = true;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const getSerialNumber = () => {
  return new Promise((resolve, reject) => {
    exec("wmic bios get serialnumber", (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      const lines = stdout.split("\n");

      if (lines.length < 2) {
        reject("Serial number format malformed.");
        return;
      }

      resolve(lines[1].replaceAll(" ", "").trim());
    });
  });
};

const saveLoginDetails = async (
  _event: IpcMainInvokeEvent,
  loginDetails: { serialNumber: string; fad: string; node: string },
) => {
  const outputPath = path.join(fileLocation, "login_details.json");
  await mkdir(path.dirname(outputPath), { recursive: true });
  return writeFile(outputPath, JSON.stringify(loginDetails));
};

const clearData = async ({ sender }: IpcMainInvokeEvent) => {
  return sender.session.clearStorageData();
};

const restartApp = async () => {
  app.relaunch();
  app.exit();
};

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: !isDev,
    fullscreen: !isDev,
    width: 1920,
    height: 1080,
    title: "Counter Terminal",
    webPreferences: {
      // Preload script is only prefixed with COUNTER_TERMINAL_
      // because of enforced electron-forge naming rules.
      // It's actually used across both apps
      preload: COUNTER_TERMINAL_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: isDev,
    },
    frame: showFrame,
  });

  if (isDev) {
    // This will maximize (not fullscreen) and show the window
    mainWindow.maximize();
  }
  // Flag for when app reloads from shutdown
  mainWindow.webContents.executeJavaScript('localStorage.setItem("app-launched","true");', true);

  powerMonitor.on("resume", () => {
    mainWindow?.webContents.send(ON_RESUME);
  });

  // and load the index.html of the app.
  mainWindow.loadURL(COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY);
  // mainWindow.loadURL(BACK_OFFICE_WINDOW_WEBPACK_ENTRY);

  if (!isDev) {
    if (!electronDebug) {
      mainWindow.removeMenu();
    }
    if (process.env.USE_SQUIRREL_AUTOUPDATER === "true") {
      initAutoupdater(mainWindow);
    }
  } else {
    try {
      const extension = await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
      console.log(`Added Extension: ${extension}`);
      mainWindow.webContents.on("did-finish-load", () => {
        mainWindow?.webContents.openDevTools();
      });
    } catch (err) {
      console.log("Error installing React Dev Tools", err);
    }
  }

  mainWindow.webContents.on("did-navigate-in-page", () => deeplinkReady(mainWindow));

  mainWindow.webContents.setWindowOpenHandler(() => {
    const size = mainWindow?.getSize();
    const width = size?.[0] || 1920;
    const height = size?.[1] || 1080;
    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
        width,
        height,
        fullscreen: !isDev,
        frame: !isDev,
        webPreferences: {
          devTools: isDev,
        },
      },
    };
  });

  mainWindow.webContents.on("did-create-window", (window) => {
    if (!isDev && !electronDebug) {
      window.removeMenu();
    }
  });

  // Modify the user agent for all requests to the following urls.
  const filter = {
    urls: ["http://localhost:3000", "https://nbit-user-authentication.ipt.cdp.postoffice.co.uk"],
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders.Origin = "https://nbit-user-authentication.ipt.cdp.postoffice.co.uk";
    callback({ requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    if (details.responseHeaders) {
      details.responseHeaders["Access-Control-Allow-Origin"] = ["capacitor-electron://-"];
    }
    callback({ responseHeaders: details.responseHeaders });
  });
};

ipcMain.on(LAUNCH_BO, () => {
  mainWindow?.loadURL(BACK_OFFICE_WINDOW_WEBPACK_ENTRY);
});

ipcMain.on(LAUNCH_CT, () => {
  mainWindow?.loadURL(COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY);
});

ipcMain.on(RESTART_APP, () => {
  restartApp();
});

// Configure po:// protocol for deep linking
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(APP_PROTOCOL);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv) => {
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
      const url = argv[argv.length - 1];
      if (url.startsWith(`${APP_PROTOCOL}://`) && process.platform !== "darwin") {
        handleDeeplink(
          url,
          mainWindow,
          COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY,
          BACK_OFFICE_WINDOW_WEBPACK_ENTRY,
        );
      }
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", async () => {
    ipcMain.handle(GET_SERIAL_NUMBER, getSerialNumber);
    ipcMain.handle(SAVE_LOGIN_DETAILS, saveLoginDetails);
    ipcMain.handle(CLEAR_DATA, clearData);
    ipcMain.on(FRONTEND_LOGGER, logDataToFile);
    createWindow();
  });

  // Handle the protocol
  app.on("open-url", async (_event, url) => {
    handleDeeplink(
      url,
      mainWindow,
      COUNTER_TERMINAL_WINDOW_WEBPACK_ENTRY,
      BACK_OFFICE_WINDOW_WEBPACK_ENTRY,
    );
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    Promise.all([
      apiLogger.shutdown(),
      applicationLogger.shutdown(),
      errorLogger.shutdown(),
      fatalLogger.shutdown(),
      journeyEngineLogger.shutdown(),
      miscLogger.shutdown(),
      reduxLogger.shutdown(),
    ]).finally(() => {
      app.quit();
    });
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
