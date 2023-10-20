"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const uniacarsClass_1 = __importDefault(require("./uniacarsClass"));
electron_1.app.whenReady().then(() => {
    if (electron_1.app.isPackaged && !process.argv.includes("debug")) {
        electron_1.Menu.setApplicationMenu(null);
        electron_1.globalShortcut.register('CommandOrControl+Shift+I', () => {
            return;
        });
    }
    electron_1.app.name = "UniACARS - ACARS for the best";
    electron_1.app.setName("UNIACARS");
    const acarsInstance = new uniacarsClass_1.default();
    electron_1.ipcMain.handle('app-login', (e, arg) => acarsInstance.LoginHandler(e, arg));
    electron_1.ipcMain.handle('app-log-out', (e, arg) => acarsInstance.LogOutHandler(e, arg));
    electron_1.ipcMain.handle('app-quit', (e, arg) => acarsInstance.QuitHandler(e, arg));
    electron_1.ipcMain.handle('app-maxres', (e, arg) => acarsInstance.ToggleWindowSize(e, arg));
    electron_1.ipcMain.handle('app-minimize', (e, arg) => acarsInstance.MinimizeWindow(e, arg));
    electron_1.ipcMain.handle('start-background-service', (e, arg) => acarsInstance.StartAcarsConsole(e, arg));
    electron_1.ipcMain.handle('stop-background-service', (e, arg) => acarsInstance.terminateAcarsConsole());
    electron_1.ipcMain.handle('language-err', () => {
        electron_1.dialog.showErrorBox("Error", "An error occured while loading language file");
    });
    electron_1.app.on('quit', () => {
        acarsInstance.terminateAcarsConsole();
    });
    electron_1.app.on('before-quit', () => {
        acarsInstance.terminateAcarsConsole();
    });
    electron_1.app.on('window-all-closed', () => {
        acarsInstance.terminateAcarsConsole();
    });
    acarsInstance.startup();
});
