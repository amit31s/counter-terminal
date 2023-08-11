import { contextBridge, ipcRenderer } from "electron";
import { REQUEST_PRESIGNED_URLS, SEND_PRESIGNED_URLS } from "postoffice-electron-autoupdater-js";
import { ContextBridgeApi } from "postoffice-electron-context-bridge-js";
import {
  CLEAR_DATA,
  DEEPLINK,
  FRONTEND_LOGGER,
  GET_SERIAL_NUMBER,
  LAUNCH_BO,
  LAUNCH_CT,
  ON_RESUME,
  RESTART_APP,
  SAVE_LOGIN_DETAILS,
} from "./electronConstants";

const exposedApi: ContextBridgeApi = {
  requestPresignedUrls: (callback) => ipcRenderer.on(REQUEST_PRESIGNED_URLS, callback),
  sendPresignedUrls: (presignedResources, eventName) =>
    ipcRenderer.send(SEND_PRESIGNED_URLS, presignedResources, eventName),
  launchBo: () => ipcRenderer.send(LAUNCH_BO),
  launchCt: () => ipcRenderer.send(LAUNCH_CT),
  deeplink: (callback) => ipcRenderer.on(DEEPLINK, callback),
  getSerialNumber: () => ipcRenderer.invoke(GET_SERIAL_NUMBER),
  saveLoginDetails: (loginDetails) => ipcRenderer.invoke(SAVE_LOGIN_DETAILS, loginDetails),
  logger: (logData) => ipcRenderer.send(FRONTEND_LOGGER, logData),
  onResume: (callback) => {
    ipcRenderer.on(ON_RESUME, callback);
    return () => {
      ipcRenderer.removeListener(ON_RESUME, callback);
    };
  },
  clearData: () => ipcRenderer.invoke(CLEAR_DATA),
  restartApp: () => ipcRenderer.send(RESTART_APP),
};

contextBridge.exposeInMainWorld("electronAPI", exposedApi);
