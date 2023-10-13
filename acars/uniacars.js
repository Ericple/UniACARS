"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const router_1 = require("./pages/router");
const child_process_1 = require("child_process");
const global_1 = require("./pages/script/global");
const net_1 = __importDefault(require("net"));
const path_1 = __importDefault(require("path"));
let windowLogin;
let windowMain;
let consoleObj = undefined;
let server = undefined;
const stopIpcServer = () => {
    return new Promise((resolve) => {
        if (consoleObj) {
            consoleObj.kill();
            consoleObj = undefined;
        }
        if (server) {
            server.close();
            server = undefined;
        }
        resolve();
    });
};
electron_1.app.whenReady().then(() => {
    if (electron_1.app.isPackaged) {
        electron_1.Menu.setApplicationMenu(null);
        electron_1.globalShortcut.register('CommandOrControl+Shift+I', () => {
            return;
        });
    }
    electron_1.app.name = "UniACARS - ACARS for the best";
    electron_1.app.setName("UNIACARS");
    windowLogin = new electron_1.BrowserWindow({
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
    windowLogin.loadFile((0, router_1.page)('login'));
    windowLogin.show();
});
electron_1.ipcMain.handle('app-login', (e, arg) => {
    windowMain = new electron_1.BrowserWindow({
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
    windowMain.loadFile((0, router_1.page)('main'));
    windowMain.show();
    windowLogin.close();
});
electron_1.ipcMain.handle('app-log-out', () => {
    windowLogin = new electron_1.BrowserWindow({
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
    windowLogin.loadFile((0, router_1.page)('login'));
    windowLogin.show();
    windowMain.close();
});
electron_1.ipcMain.handle('app-quit', () => {
    electron_1.dialog.showMessageBox(windowMain, {
        message: "确认要打卡下班吗?",
        type: "question",
        buttons: ["确认", "取消"],
        defaultId: 1,
        title: "下班确认",
        cancelId: 1
    }).then(value => {
        if (value.response === 0)
            electron_1.app.quit();
    });
});
electron_1.ipcMain.handle('app-maxres', (e, args) => {
    if (args === 'login') {
        if (windowLogin.isMaximized()) {
            windowLogin.restore();
            e.sender.send('restored');
        }
        else {
            windowLogin.maximize();
            e.sender.send('maximized');
        }
    }
    else {
        if (windowMain.isMaximized()) {
            windowMain.restore();
            e.sender.send('restored');
        }
        else {
            windowMain.maximize();
            e.sender.send('maximized');
        }
    }
});
electron_1.ipcMain.handle('app-minimize', (e, args) => {
    if (args === 'login') {
        windowLogin.minimize();
    }
    else {
        windowMain.minimize();
    }
});
electron_1.ipcMain.handle('start-background-service', (e, args) => {
    if (server !== undefined && server.listening) {
        return;
    }
    server = net_1.default.createServer(client => {
        client.on('data', (buffer) => {
            const data = buffer.toString('utf-8');
            if (data == 'logstart') {
                if (windowMain)
                    windowMain.webContents.send('log-clear', data);
            }
            else if (data.lastIndexOf('log*') !== -1) {
                const log = data.split('log*')[1];
                if (windowMain)
                    windowMain.webContents.send('log-add', log);
            }
            else if (data == 'logend') {
                if (windowMain)
                    windowMain.webContents.send('log-end');
            }
            else if (data.lastIndexOf('pirepres*') !== -1) {
                stopIpcServer();
                if (windowMain)
                    windowMain.webContents.send('flight-end', data.split('pirepres*')[1]);
            }
            else {
                try {
                    JSON.parse(data);
                    if (windowMain)
                        windowMain.webContents.send('log-info', data);
                }
                catch (_a) {
                    return;
                }
            }
        });
    });
    server.listen(global_1.ipcPath);
    if (consoleObj !== undefined) {
        return;
    }
    console.log(path_1.default.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'));
    consoleObj = (0, child_process_1.execFile)(path_1.default.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'), args, (err, stdo, stde) => {
        if (err) {
            console.log(err);
        }
        if (stdo)
            console.log(stdo);
        if (stde)
            console.log(stde);
    });
    new electron_1.Notification({
        title: "UniACARS",
        subtitle: "ACARS Started",
        body: "Your flight is being monitored, you can now load into the cockpit."
    }).show();
});
electron_1.ipcMain.handle('stop-background-service', (e, args) => {
    if (consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if (server) {
        server.close();
        server = undefined;
    }
    new electron_1.Notification({
        title: "UniACARS",
        subtitle: "ACARS Canceled",
        body: "Your flight acars has been canceled, you can reactive it through bookings page."
    }).show();
});
electron_1.ipcMain.handle('language-err', () => {
    electron_1.dialog.showErrorBox("Error", "An error occured while loading language file");
});
electron_1.app.on('quit', () => {
    if (consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if (server) {
        server.close();
        server = undefined;
    }
});
electron_1.app.on('before-quit', () => {
    if (consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if (server) {
        server.close();
        server = undefined;
    }
});
electron_1.app.on('window-all-closed', () => {
    if (consoleObj) {
        consoleObj.kill();
        consoleObj = undefined;
    }
    if (server) {
        server.close();
        server = undefined;
    }
});
