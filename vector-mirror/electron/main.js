const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let ytWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768,
    fullscreen: true, frame: false, autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// --- СУПЕР-КОНТРОЛЛЕР ---
ipcMain.on('yt-nav', (e, key) => {
  if (!ytWindow) return;
  // Маппинг для YouTube Leanback
  const keys = {
    'UP': 'Up', 'DOWN': 'Down', 'LEFT': 'Left', 'RIGHT': 'Right', 
    'ENTER': 'Enter', 'BACK': 'Escape'
  };
  const code = keys[key];
  if (code) {
    // Посылаем нажатие и отпускание клавиши
    ytWindow.webContents.sendInputEvent({ type: 'keyDown', keyCode: code });
    ytWindow.webContents.sendInputEvent({ type: 'keyUp', keyCode: code });
  }
});

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

ipcMain.on('close-youtube', () => { if (ytWindow) ytWindow.close(); });
ipcMain.on('system-reload', () => mainWindow.reload());