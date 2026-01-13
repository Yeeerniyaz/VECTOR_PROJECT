const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow, ytWindow = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768, 
    fullscreen: process.platform === 'linux', // На винде лучше в окне для тестов
    frame: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.loadURL('http://localhost:5173');
});

// 🔥 УМНАЯ ГРОМКОСТЬ (Windows + Linux)
ipcMain.on('system-volume', (e, action) => {
  let command = "";
  if (process.platform === 'linux') {
    // Команда для Raspberry Pi
    let flag = action === 'UP' ? "5%+" : action === 'DOWN' ? "5%-" : "toggle";
    command = `amixer sset 'Master' ${flag}`;
  } else if (process.platform === 'win32') {
    // Команда для Windows (PowerShell имитирует нажатие медиа-клавиш)
    let char = action === 'UP' ? "175" : action === 'DOWN' ? "174" : "173";
    command = `powershell -Command "(new-object -com wscript.shell).SendKeys([char]${char})"`;
  }

  if (command) {
    exec(command, (err) => {
      if (err) console.error("Ошибка громкости:", err);
    });
  }
});

// 🔥 ЭМУЛЯЦИЯ КЛАВИШ
ipcMain.on('send-key', (e, key) => {
  const target = ytWindow || mainWindow;
  if (target) {
    // В Windows 'Enter' работает надежнее чем 'Return'
    const keyCode = (key === 'Return' || key === 'Enter') ? 'Enter' : key;
    target.webContents.sendInputEvent({ type: 'keyDown', keyCode });
    setTimeout(() => target.webContents.sendInputEvent({ type: 'keyUp', keyCode }), 50);
  }
});

// YouTube и другие команды...
ipcMain.on('open-youtube', () => {
    if (ytWindow) return;
    const { width, height } = screen.getPrimaryDisplay().bounds;
    ytWindow = new BrowserWindow({ width, height: Math.round(width * 9/16), y: 150, frame: false, alwaysOnTop: true });
    ytWindow.loadURL('https://www.youtube.com/tv', { userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' });
});
ipcMain.on('close-youtube', () => { if (ytWindow) { ytWindow.close(); ytWindow = null; } });
ipcMain.on('system-reload', () => mainWindow.reload());