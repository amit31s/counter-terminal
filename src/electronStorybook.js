/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
const app = require("electron").app;
const BrowserWindow = require("electron").BrowserWindow;
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");
dotenv.config();

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
  });

  mainWindow.loadURL("http://localhost:9001");

  try {
    const extension = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Added Extension: ${extension}`);
  } catch (err) {
    console.log("Error installing React Dev Tools", err);
  }
};

app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("remote-debugging-port", "5858");

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
