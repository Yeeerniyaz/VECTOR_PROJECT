const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let ytWindow = null; // <--- ВАЖНО: Вынесли переменную сюда!

function createWindow() {
  const isDev = !app.isPackaged; 
  mainWindow = new BrowserWindow({
    width: 600, height: 1000,
    fullscreen: !isDev, frame: !isDev, autoHideMenuBar: true,
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false, contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// --- YOUTUBE ---
ipcMain.on('open-youtube', () => {
  if (ytWindow) return; // Если уже открыто, не открываем второе

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;
  const videoHeight = Math.round(width * 9 / 16);
  const yPosition = Math.round((height - videoHeight) / 2);

  ytWindow = new BrowserWindow({
    parent: mainWindow,
    width: width, height: videoHeight,
    x: 0, y: yPosition,
    frame: false, fullscreen: false, alwaysOnTop: true,
    backgroundColor: '#000000',
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });

  ytWindow.loadURL('https://www.youtube.com/tv', {
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' 
  });

  ytWindow.on('closed', () => { ytWindow = null; }); // Забываем окно при закрытии
});

// 🔥 НОВАЯ КОМАНДА: ЗАКРЫТЬ YOUTUBE
ipcMain.on('close-youtube', () => {
  if (ytWindow) {
    ytWindow.close();
    ytWindow = null;
    console.log('YouTube закрыт по команде.');
  }
});

// --- СИСТЕМА ---
ipcMain.on('system-reload', (e) => BrowserWindow.fromWebContents(e.sender).reload());
ipcMain.on('system-devtools', (e) => BrowserWindow.fromWebContents(e.sender).webContents.toggleDevTools());
ipcMain.on('system-quit', () => app.quit());