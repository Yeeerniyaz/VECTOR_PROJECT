const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // Для управления Linux

let mainWindow;
let ytWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768, fullscreen: true, frame: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// 🔥 СИСТЕМНАЯ ГРОМКОСТЬ (ALSA)
ipcMain.on('system-volume', (e, action) => {
  let cmd = action === 'UP' ? "5%+" : action === 'DOWN' ? "5%-" : "toggle";
  exec(`amixer sset 'Master' ${cmd}`);
});

// 🔥 ЭМУЛЯЦИЯ КЛАВИШ (Hardware Level)
ipcMain.on('send-key', (e, key) => {
  const win = ytWindow || mainWindow;
  if (win) {
    win.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    setTimeout(() => win.webContents.sendInputEvent({ type: 'keyUp', keyCode: key }), 50);
  }
});

ipcMain.on('open-youtube', () => {
  if (ytWindow) return;
  const { width, height } = screen.getPrimaryDisplay().bounds;
  ytWindow = new BrowserWindow({ width, height: Math.round(width * 9/16), y: 150, frame: false, alwaysOnTop: true });
  ytWindow.loadURL('https://www.youtube.com/tv', { userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' });
});

ipcMain.on('close-youtube', () => { if (ytWindow) { ytWindow.close(); ytWindow = null; } });
ipcMain.on('system-reload', () => mainWindow.reload());