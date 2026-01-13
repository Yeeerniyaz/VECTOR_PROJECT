const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let ytWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768,
    fullscreen: !app.isPackaged, frame: false,
    backgroundColor: '#000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// --- MEDIA CONTROL ---
ipcMain.on('open-youtube', () => {
  if (ytWindow) return;
  const { width, height } = screen.getPrimaryDisplay().bounds;
  ytWindow = new BrowserWindow({
    width, height: Math.round(width * 9/16),
    y: Math.round((height - (width * 9/16)) / 2),
    frame: false, alwaysOnTop: true, backgroundColor: '#000000'
  });
  ytWindow.loadURL('https://www.youtube.com/tv', {
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1'
  });
  ytWindow.on('closed', () => { ytWindow = null; });
});

ipcMain.on('close-youtube', () => { if (ytWindow) { ytWindow.close(); ytWindow = null; } });

ipcMain.on('media-volume', (e, action) => {
  if (!ytWindow) return;
  const key = action === 'UP' ? 'Up' : action === 'DOWN' ? 'Down' : null;
  if (key) ytWindow.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
});

ipcMain.on('system-reload', () => mainWindow.reload());