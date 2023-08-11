import axios from "axios";
import { app, autoUpdater, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import http from "http";
import {
  HandleRequestPresignedUrls,
  PresignedResource,
  RELEASES_FILENAME,
  REQUEST_PRESIGNED_URLS,
  SendPresignedUrlsEvents,
  SEND_PRESIGNED_URLS,
  TEMP_UPDATES_FOLDER,
  UpdateStep,
  UPDATE_SERVER_PORT,
} from "postoffice-electron-autoupdater-js";
import handler from "serve-handler";
import { Stream } from "stream";

// Autoupdater functionality will only work with Squirrel installed
// versions of the app (using the .exe based maker). If distributed via
// .msi installers then the Windows updater would be used as the update mechanism instead
//
// Steps:
// 1. Request presigned url for RELEASES file
// 2. Stream RELEASES file and extract latest available version
// 3. If latest available version is > greater than installed version then save RELEASES file to
//    temporary folder and request presigned urls for setup.exe and .nupkg file
// 4. Download latest .exe and .nupkg files to temporary folder
// 5. Temporarily spin up local static web server for autoupdater to read from
// 6. When autoupdater has completed spin down the static web server and delete temporary folder

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: TEMP_UPDATES_FOLDER,
  }),
);

export const deleteTemporaryFolder = () => {
  fs.rmSync(TEMP_UPDATES_FOLDER, {
    recursive: true,
    force: true,
  });
};

const startUpdateServer = () => server.listen(UPDATE_SERVER_PORT);

export const stopUpdateServer = () => {
  server.close();
  deleteTemporaryFolder();
};

let updateStep: UpdateStep = UpdateStep.IDLE;

autoUpdater.setFeedURL({
  url: `http://localhost:${UPDATE_SERVER_PORT}`,
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  updateStep = UpdateStep.IDLE;
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
  stopUpdateServer();
});

autoUpdater.on("update-not-available", () => {
  updateStep = UpdateStep.IDLE;
  stopUpdateServer();
});

const readFile = async (presignedUrl: string) =>
  axios.get<Stream>(presignedUrl, { responseType: "stream" });

const saveFile = async (file: Stream, filename: string) => {
  const writeStream = fs.createWriteStream(`${TEMP_UPDATES_FOLDER}/${filename}`);
  file.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(true));
    writeStream.on("error", (error) => reject(error));
  });
};

const streamToString = (stream: Stream): Promise<string> => {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (error) => reject(error));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

const downloadFile = async (filename: string, url: string) => {
  const file = await readFile(url);
  return saveFile(file.data, filename);
};

const nupkgFilenameFromReleasesFileContents = (releaseFileContents: string) => {
  return releaseFileContents.split(" ")[1];
};

// releaseFileContents will be in the form of:
// "C883E128366DCDD5BC3C928F82A1613FCFFC9F7B counterterminal-0.0.2-full.nupkg 91842987"
const versionNumberFromReleaseFileContents = (releaseFileContents: string) => {
  const nupkgFilename = nupkgFilenameFromReleasesFileContents(releaseFileContents);
  if (!nupkgFilename) {
    return null;
  }
  return nupkgFilename.split("-")[1];
};

const versionNumberFromFs = () => {
  const dirContents = fs.readdirSync("../");
  return dirContents
    .filter((entry) => entry.match(/app-\d+\.\d+\.\d+/))
    .map((entry) => entry.split("-")[1])
    .reduce((acc, curr) => (curr > acc ? curr : acc));
};

const requestPresignedUrls = (
  resourceNames: string[],
  eventName: SendPresignedUrlsEvents,
  mainWindow: BrowserWindow,
) => {
  mainWindow.webContents.send(REQUEST_PRESIGNED_URLS, resourceNames, eventName);
};

const checkS3ForUpdates = async (
  presignedReleasesUrl: string,
  handleRequestPresignedUrls: HandleRequestPresignedUrls,
) => {
  const releasesFile = await readFile(presignedReleasesUrl);
  const releasesFileContents = await streamToString(releasesFile.data);

  const latestAvailableVersionNumber = versionNumberFromReleaseFileContents(releasesFileContents);

  if (!latestAvailableVersionNumber) {
    throw new Error("Invalid RELEASES file");
  }
  const latestInstalledVersionNumber = versionNumberFromFs();
  if (latestInstalledVersionNumber >= latestAvailableVersionNumber) {
    throw new Error("Already up to date");
  }
  if (!fs.existsSync(TEMP_UPDATES_FOLDER)) {
    fs.mkdirSync(TEMP_UPDATES_FOLDER);
  }

  await downloadFile(RELEASES_FILENAME, presignedReleasesUrl);

  const nupkgFilename = nupkgFilenameFromReleasesFileContents(releasesFileContents);

  handleRequestPresignedUrls(["setup.exe", nupkgFilename], SendPresignedUrlsEvents.UPDATE_FILES);
};

const downloadUpdateFiles = async (presignedResources: PresignedResource[]) => {
  await Promise.all(
    presignedResources.map(({ presignedUrl, resourceName }) =>
      downloadFile(resourceName, presignedUrl),
    ),
  );
  startUpdateServer();
};

export const initAutoupdater = (mainWindow: BrowserWindow) => {
  if (app.isPackaged) {
    // Initial check is driven from the renderer thread when the user first signs in.
    // Subsequent checks happen every hour
    setInterval(
      () =>
        requestPresignedUrls(
          [RELEASES_FILENAME],
          SendPresignedUrlsEvents.RELEASES_FILE,
          mainWindow,
        ),
      60000 * 60,
    ); // one hour in milliseconds
  }

  const handleRequestPresignedUrls: HandleRequestPresignedUrls = (
    resourceNames: string[],
    eventName: SendPresignedUrlsEvents,
  ) => requestPresignedUrls(resourceNames, eventName, mainWindow);

  ipcMain.on(
    SEND_PRESIGNED_URLS,
    async (_event, presignedResources: PresignedResource[], eventName: SendPresignedUrlsEvents) => {
      switch (eventName) {
        case SendPresignedUrlsEvents.RELEASES_FILE: {
          if (!presignedResources?.[0] || updateStep !== UpdateStep.IDLE) {
            break;
          }

          updateStep = UpdateStep.DOWNLOADING_RELEASES;
          try {
            await checkS3ForUpdates(presignedResources[0].presignedUrl, handleRequestPresignedUrls);
          } catch (e) {
            updateStep = UpdateStep.IDLE;
          }
          break;
        }
        case SendPresignedUrlsEvents.UPDATE_FILES: {
          if (updateStep !== UpdateStep.DOWNLOADING_RELEASES) {
            break;
          }

          updateStep = UpdateStep.DOWNLOADING_UPDATES;
          try {
            await downloadUpdateFiles(presignedResources);
            autoUpdater.checkForUpdates();
          } catch (e) {
            updateStep = UpdateStep.IDLE;
            stopUpdateServer();
          }
          break;
        }
        default:
          return;
      }
    },
  );
};
