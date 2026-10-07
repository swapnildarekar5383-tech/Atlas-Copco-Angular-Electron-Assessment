const { app, BrowserWindow } = require("electron");
const path = require("path");
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#08111f",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  const url =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../dist/atlas-copco-monitor/browser/index.html")}`;
  win.loadURL(url);
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
