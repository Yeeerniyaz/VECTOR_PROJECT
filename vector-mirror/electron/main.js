const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow, ytWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768,
    fullscreen: process.platform === 'linux', // На Win лучше в окне для дебага
    frame: false,
    backgroundColor: '#000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// 🔥 УМНАЯ ГРОМКОСТЬ
ipcMain.on('system-volume', (e, action) => {
  let command = "";
  if (process.platform === 'linux') {
    let flag = action === 'UP' ? "5%+" : action === 'DOWN' ? "5%-" : "toggle";
    command = `amixer sset 'Master' ${flag}`;
  } else if (process.platform === 'win32') {
    let char = action === 'UP' ? "175" : action === 'DOWN' ? "174" : "173";
    command = `powershell -Command "(new-object -com wscript.shell).SendKeys([char]${char})"`;
  }
  if (command) exec(command);
});

// 🔥 ЭМУЛЯЦИЯ КЛАВИАТУРЫ
ipcMain.on('send-key', (e, key) => {
  const target = ytWindow || mainWindow;
  if (target) {
    target.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    setTimeout(() => target.webContents.sendInputEvent({ type: 'keyUp', keyCode: key }), 50);
  }
});

ipcMain.on('open-youtube', () => {
  if (ytWindow) return;
  const { width, height } = screen.getPrimaryDisplay().bounds;
  ytWindow = new BrowserWindow({ width, height: Math.round(width * 9/16), y: 150, frame: false, alwaysOnTop: true });
  ytWindow.loadURL('https://www.youtube.com/tv', { 
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' 
  });
});

ipcMain.on('close-youtube', () => { if (ytWindow) { ytWindow.close(); ytWindow = null; } });
ipcMain.on('system-reload', () => mainWindow.reload());