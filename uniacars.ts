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

import { app, BrowserWindow, ipcMain, Notification, Menu, globalShortcut, dialog } from "electron";
import { page } from './pages/router';
import { execFile, ChildProcess, ExecFileException } from 'child_process';
import { ipcPath } from "./pages/script/global";
import net, { Server } from 'net';
import path from 'path';
let windowLogin: BrowserWindow;
let windowMain: BrowserWindow;
let consoleObj: ChildProcess | undefined = undefined;
let server: Server | undefined = undefined;
const stopIpcServer = () => {
    return new Promise<void>((resolve) => {
        if(consoleObj) {
            consoleObj.kill();
            consoleObj = undefined;
        }
        if(server) {
            server.close();
            server = undefined;
        }
        resolve();
    })
}
app.whenReady().then(() => {
    if(app.isPackaged) {
        Menu.setApplicationMenu(null);
        globalShortcut.register('CommandOrControl+Shift+I', () => {
            return;
        });
    }
    app.name = "UniACARS - ACARS for the best";
    app.setName("UNIACARS");
    windowLogin = new BrowserWindow({
        frame: false,
        width: 1250,
        height: 800,
        minWidth: 1250,
        minHeight: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    windowLogin.webContents.closeDevTools();
    windowLogin.loadFile(page('login'));
    windowLogin.show();
});
ipcMain.handle('app-login', (e, arg) => {
    //arg is login context
    windowMain = new BrowserWindow({
        frame: false,
        width: 1250,
        height: 800,
        minWidth: 1250,
        minHeight: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    windowMain.webContents.closeDevTools();
    windowMain.loadFile(page('main'));
    windowMain.show();
    windowLogin.close();
});
ipcMain.handle('app-log-out', () => {
    windowLogin = new BrowserWindow({
        frame: false,
        width: 1250,
        height: 800,
        minWidth: 1250,
        minHeight: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    windowLogin.webContents.closeDevTools();
    windowLogin.loadFile(page('login'));
    windowLogin.show();
    windowMain.close();
});
ipcMain.handle('app-quit', () => {
    dialog.showMessageBox(windowMain, {
        message: "确认要打卡下班吗?",
        type: "question",
        buttons: ["确认", "取消"],
        defaultId: 1,
        title: "下班确认",
        cancelId: 1
    }).then(value => {
        if (value.response === 0) app.quit();
    });
});
ipcMain.handle('app-maxres', (e, args) => {
    if (args === 'login') {
        if (windowLogin.isMaximized()) {
            windowLogin.restore();
            e.sender.send('restored');
        } else {
            windowLogin.maximize();
            e.sender.send('maximized');
        }
    } else {
        if (windowMain.isMaximized()) {
            windowMain.restore();
            e.sender.send('restored');
        } else {
            windowMain.maximize();
            e.sender.send('maximized');
        }
    }
});
ipcMain.handle('app-minimize', (e, args) => {
    if (args === 'login') {
        windowLogin.minimize();
    } else {
        windowMain.minimize();
    }
});
ipcMain.handle('start-background-service', (e, args) => {
    if (server !== undefined && server.listening) {
        return;
    }
    server = net.createServer(client => {
        client.on('data', (buffer) => {
            const data = buffer.toString('utf-8');
            if (data == 'logstart') {
                if(windowMain) windowMain.webContents.send('log-clear', data);
            } else if (data.lastIndexOf('log*') !== -1) {
                const log = data.split('log*')[1];
                if(windowMain) windowMain.webContents.send('log-add', log);
            } else if(data == 'logend') {
                if(windowMain) windowMain.webContents.send('log-end');
            } else if(data.lastIndexOf('pirepres*') !== -1) {
                stopIpcServer();
                if(windowMain) windowMain.webContents.send('flight-end', data.split('pirepres*')[1]);
            } else {
                try {
                    JSON.parse(data);
                    if(windowMain) windowMain.webContents.send('log-info', data);
                }catch{
                    return;
                }
            }
        });
    });
    server.listen(ipcPath);
    if (consoleObj !== undefined) {
        return;
    }
    console.log(path.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'));
    consoleObj = execFile(path.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'), args, (err:ExecFileException | null, stdo:string, stde:string) => {
        if(err){
            console.log(err);
        }
        if(stdo) console.log(stdo);
        if(stde) console.log(stde);
    });
    new Notification({
        title: "UniACARS",
        subtitle: "ACARS Started",
        body: "Your flight is being monitored, you can now load into the cockpit."
    }).show();
});
ipcMain.handle('stop-background-service', (e, args) => {
    if(consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if(server) {
        server.close();
        server = undefined;
    }
    new Notification({
        title: "UniACARS",
        subtitle: "ACARS Canceled",
        body: "Your flight acars has been canceled, you can reactive it through bookings page."
    }).show();
});
ipcMain.handle('language-err', () => {
 dialog.showErrorBox("Error","An error occured while loading language file");
});

app.on('quit', () => {
    if(consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if(server) {
        server.close();
        server = undefined;
    }
});
app.on('before-quit', () => {
    if(consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if(server) {
        server.close();
        server = undefined;
    }
})

app.on('window-all-closed', () => {
    if(consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if(server) {
        server.close();
        server = undefined;
    }
});