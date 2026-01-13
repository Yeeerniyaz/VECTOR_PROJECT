const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow, ytWindow = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768, fullscreen: true, frame: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
});

// ГРОМКОСТЬ СИСТЕМЫ (ALSA)
ipcMain.on('system-volume', (e, action) => {
  let cmd = action === 'UP' ? "5%+" : action === 'DOWN' ? "5%-" : "toggle";
  exec(`amixer sset 'Master' ${cmd}`);
});

// ЭМУЛЯЦИЯ КЛАВИАТУРЫ (Для YouTube и навигации)
ipcMain.on('send-key', (e, key) => {
  const target = ytWindow || mainWindow;
  if (target) {
    target.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    target.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
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