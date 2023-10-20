// Copyright (C) 2023  Guo Tingjin

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { app, ipcMain, Menu, globalShortcut, dialog } from "electron";
import UniACARS from "./uniacarsClass";
app.whenReady().then(() => {
    if (app.isPackaged && !process.argv.includes("debug")) {
        Menu.setApplicationMenu(null);
        globalShortcut.register('CommandOrControl+Shift+I', () => {
            return;
        });
    }
    app.name = "UniACARS - ACARS for the best";
    app.setName("UNIACARS");
    const acarsInstance = new UniACARS();
    ipcMain.handle('app-login', (e, arg) => acarsInstance.LoginHandler(e, arg));
    ipcMain.handle('app-log-out', (e, arg) => acarsInstance.LogOutHandler(e, arg));
    ipcMain.handle('app-quit', (e, arg) => acarsInstance.QuitHandler(e, arg));
    ipcMain.handle('app-maxres', (e, arg) => acarsInstance.ToggleWindowSize(e, arg));
    ipcMain.handle('app-minimize', (e, arg) => acarsInstance.MinimizeWindow(e, arg));
    ipcMain.handle('start-background-service', (e, arg) => acarsInstance.StartAcarsConsole(e, arg));
    ipcMain.handle('stop-background-service', (e, arg) => acarsInstance.terminateAcarsConsole());
    ipcMain.handle('language-err', () => {
        dialog.showErrorBox("Error", "An error occured while loading language file");
    });
    app.on('quit', () => {
        acarsInstance.terminateAcarsConsole();
    });
    app.on('before-quit', () => {
        acarsInstance.terminateAcarsConsole();
    })
    app.on('window-all-closed', () => {
        acarsInstance.terminateAcarsConsole();
    });
    acarsInstance.startup();
});