import { app, dialog, BrowserWindow, IpcMainInvokeEvent } from "electron";
import { page } from './pages/router';
import { execFile, ChildProcess, ExecFileException } from 'child_process';
import net, { Server } from 'net';
import { ipcPath } from "./pages/script/global";
import path from 'path';
export default class UniACARS {
  private windowConfig = {
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
  }
  private loginWindow: BrowserWindow;
  private mainWindow: BrowserWindow;
  private uniConsole: ChildProcess | undefined = undefined;
  private comServer: Server | undefined = undefined;

  private checkEnvDebug(win: BrowserWindow) {
    if (process.argv.includes("debug")) win.webContents.openDevTools();
  }
  public constructor() {
    this.loginWindow = new BrowserWindow(this.windowConfig.login);
    this.mainWindow = new BrowserWindow(this.windowConfig.main);
  }
  public startup() {
    this.checkEnvDebug(this.loginWindow);
    this.loginWindow.loadFile(page('login'));
    this.loginWindow.show();
  }
  public LoginHandler(e: IpcMainInvokeEvent, arg: any) {
    if (this.mainWindow) {
      this.checkEnvDebug(this.mainWindow);
      this.mainWindow.loadFile(page('main'));
      this.mainWindow.show();
    }
  }
  public LogOutHandler(e: IpcMainInvokeEvent, arg: any) {
    if (this.loginWindow) {
      this.checkEnvDebug(this.loginWindow);
      this.loginWindow.loadFile(page('login'));
      this.loginWindow.show();
      this.mainWindow?.close();
    }
  }
  public QuitHandler(e: IpcMainInvokeEvent, arg: any) {
    if (!this.mainWindow) return;
    dialog.showMessageBox(this.mainWindow, {
      message: "确认要打卡下班吗?",
      type: "question",
      buttons: ["确认", "取消"],
      defaultId: 1,
      title: "下班确认",
      cancelId: 1
    }).then(value => {
      if (value.response === 0) app.quit();
    });
  }
  public ToggleWindowSize(e: IpcMainInvokeEvent, arg: any) {
    if (arg === 'login') {
      if (this.loginWindow.isMaximized()) {
        this.loginWindow.restore();
        e.sender.send('restored');
      } else {
        this.loginWindow.maximize();
        e.sender.send('maximized');
      }
    } else {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.restore();
        e.sender.send('restored');
      } else {
        this.mainWindow.maximize();
        e.sender.send('maximized');
      }
    }
  }
  public MinimizeWindow(e: IpcMainInvokeEvent, arg: any) {
    if (arg === 'login') {
      this.loginWindow.minimize();
    } else {
      this.mainWindow.minimize();
    }
  }
  public StartAcarsConsole(e: IpcMainInvokeEvent, arg: any) {
    if (this.comServer && this.comServer.listening) return;
    this.comServer = net.createServer(client => {
      client.on('data', buffer => {
        const inMessage = buffer.toString('utf-8');
        if (inMessage == 'logstart') {
          this.mainWindow.webContents.send('log-clear', inMessage);
        } else if (inMessage.lastIndexOf('log*') !== -1) {
          const log = inMessage.split('log*')[1];
          this.mainWindow.webContents.send('log-add', log);
        } else if (inMessage == 'logend') {
          this.mainWindow.webContents.send('log-end');
        } else if (inMessage.lastIndexOf('pirepres*') !== -1) {
          this.terminateAcarsConsole();
          this.mainWindow.webContents.send('flight-end', inMessage.split('pirepres*')[1]);
        } else {
          try {
            JSON.parse(inMessage);
            this.mainWindow.webContents.send('log-info', inMessage);
          } catch(e) {
            console.log(inMessage, e);
          }
        }
      })
    })
    this.comServer.listen(ipcPath);
    if (this.uniConsole) return;
    this.uniConsole = execFile(path.join(__dirname, '..', '..', 'bridge', 'UNIConsole.exe'), arg, (err: ExecFileException | null, stdo: string, stde: string) => {
      if (err) {
        console.log(err);
      }
      if (stdo) console.log(stdo);
      if (stde) console.log(stde);
    });
  }
  public terminateAcarsConsole() {
    if(this.uniConsole && !this.uniConsole.killed) {
      this.uniConsole.kill();
      this.uniConsole = undefined;
    }
    if(this.comServer && this.comServer.listening) {
      this.comServer.close();
      this.comServer = undefined;
    }
  }
}