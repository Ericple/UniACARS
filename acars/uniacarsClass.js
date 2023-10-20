"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const router_1 = require("./pages/router");
const child_process_1 = require("child_process");
const net_1 = __importDefault(require("net"));
const global_1 = require("./pages/script/global");
const path_1 = __importDefault(require("path"));
class UniACARS {
    checkEnvDebug(win) {
        if (process.argv.includes("debug"))
            win.webContents.openDevTools();
    }
    constructor() {
        this.windowConfig = {
            login: {
                frame: false,
                width: 1250,
                height: 800,
                minWidth: 1250,
                minHeight: 600,
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true
                }
            },
            main: {
                frame: false,
                width: 1250,
                height: 800,
                minWidth: 1250,
                minHeight: 600,
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: true
                }
            }
        };
        this.uniConsole = undefined;
        this.comServer = undefined;
        this.loginWindow = new electron_1.BrowserWindow(this.windowConfig.login);
        this.mainWindow = new electron_1.BrowserWindow(this.windowConfig.main);
    }
    startup() {
        this.checkEnvDebug(this.loginWindow);
        this.loginWindow.loadFile((0, router_1.page)('login'));
        this.loginWindow.show();
    }
    LoginHandler(e, arg) {
        if (this.mainWindow) {
            this.checkEnvDebug(this.mainWindow);
            this.mainWindow.loadFile((0, router_1.page)('main'));
            this.mainWindow.show();
        }
    }
    LogOutHandler(e, arg) {
        var _a;
        if (this.loginWindow) {
            this.checkEnvDebug(this.loginWindow);
            this.loginWindow.loadFile((0, router_1.page)('login'));
            this.loginWindow.show();
            (_a = this.mainWindow) === null || _a === void 0 ? void 0 : _a.close();
        }
    }
    QuitHandler(e, arg) {
        if (!this.mainWindow)
            return;
        electron_1.dialog.showMessageBox(this.mainWindow, {
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
    }
    ToggleWindowSize(e, arg) {
        if (arg === 'login') {
            if (this.loginWindow.isMaximized()) {
                this.loginWindow.restore();
                e.sender.send('restored');
            }
            else {
                this.loginWindow.maximize();
                e.sender.send('maximized');
            }
        }
        else {
            if (this.mainWindow.isMaximized()) {
                this.mainWindow.restore();
                e.sender.send('restored');
            }
            else {
                this.mainWindow.maximize();
                e.sender.send('maximized');
            }
        }
    }
    MinimizeWindow(e, arg) {
        if (arg === 'login') {
            this.loginWindow.minimize();
        }
        else {
            this.mainWindow.minimize();
        }
    }
    StartAcarsConsole(e, arg) {
        if (this.comServer && this.comServer.listening)
            return;
        this.comServer = net_1.default.createServer(client => {
            client.on('data', buffer => {
                const inMessage = buffer.toString('utf-8');
                if (inMessage == 'logstart') {
                    this.mainWindow.webContents.send('log-clear', inMessage);
                }
                else if (inMessage.lastIndexOf('log*') !== -1) {
                    const log = inMessage.split('log*')[1];
                    this.mainWindow.webContents.send('log-add', log);
                }
                else if (inMessage == 'logend') {
                    this.mainWindow.webContents.send('log-end');
                }
                else if (inMessage.lastIndexOf('pirepres*') !== -1) {
                    this.terminateAcarsConsole();
                    this.mainWindow.webContents.send('flight-end', inMessage.split('pirepres*')[1]);
                }
                else {
                    try {
                        JSON.parse(inMessage);
                        this.mainWindow.webContents.send('log-info', inMessage);
                    }
                    catch (e) {
                        console.log(inMessage, e);
                    }
                }
            });
        });
        this.comServer.listen(global_1.ipcPath);
        if (this.uniConsole)
            return;
        this.uniConsole = (0, child_process_1.execFile)(path_1.default.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'), arg, (err, stdo, stde) => {
            if (err) {
                console.log(err);
            }
            if (stdo)
                console.log(stdo);
            if (stde)
                console.log(stde);
        });
    }
    terminateAcarsConsole() {
        if (this.uniConsole && !this.uniConsole.killed) {
            this.uniConsole.kill();
            this.uniConsole = undefined;
        }
        if (this.comServer && this.comServer.listening) {
            this.comServer.close();
            this.comServer = undefined;
        }
    }
}
exports.default = UniACARS;
