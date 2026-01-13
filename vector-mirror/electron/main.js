const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow, ytWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366, height: 768,
    fullscreen: false, // На Windows для тестов лучше в окне
    frame: false,
    backgroundColor: '#000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), nodeIntegration: false, contextIsolation: true }
  });
  
  // Убедись, что Vite запущен!
  mainWindow.loadURL('http://localhost:5173').catch(() => {
    console.log("⚠️ Vite не запущен на 5173!");
  });
}

app.whenReady().then(createWindow);

// 🔥 ЛОГИРОВАНИЕ ГРОМКОСТИ
ipcMain.on('system-volume', (e, action) => {
  console.log(`🔊 [VOLUME] Действие: ${action}`);
  if (process.platform === 'win32') {
    let char = action === 'UP' ? "175" : action === 'DOWN' ? "174" : "173";
    let cmd = `powershell -Command "(new-object -com wscript.shell).SendKeys([char]${char})"`;
    exec(cmd);
  } else {
    let flag = action === 'UP' ? "5%+" : action === 'DOWN' ? "5%-" : "toggle";
    exec(`amixer sset 'Master' ${flag}`);
  }
});

// 🔥 ЛОГИРОВАНИЕ КЛАВИШ
ipcMain.on('send-key', (e, key) => {
  console.log(`⌨️ [KEY] Нажата клавиша: ${key}`);
  const target = ytWindow || mainWindow;
  if (target) {
    target.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    setTimeout(() => target.webContents.sendInputEvent({ type: 'keyUp', keyCode: key }), 50);
  }
});

ipcMain.on('open-youtube', () => {
  console.log("📺 [YT] Открытие YouTube TV");
  if (ytWindow) return;
  const { width, height } = screen.getPrimaryDisplay().bounds;
  ytWindow = new BrowserWindow({ width, height: Math.round(width * 9/16), y: 100, frame: false, alwaysOnTop: true });
  ytWindow.loadURL('https://www.youtube.com/tv', { 
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' 
  });
});

ipcMain.on('close-youtube', () => { 
  console.log("❌ [YT] Закрытие");
  if (ytWindow) { ytWindow.close(); ytWindow = null; } 
});