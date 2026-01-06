/* vector-mirror/electron/main.js */
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Настройка путей для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  // Создаем окно браузера
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    frame: false, // Убираем рамки (крестик, панель)
    fullscreen: false, // Пока в окне, потом включим true
    backgroundColor: '#000000', // Черный фон старта
    webPreferences: {
      nodeIntegration: true, // Разрешаем Node.js
      contextIsolation: false,
      devTools: true, // Разрешаем инструменты разработчика
    },
  });

  // ЛОГИКА ЗАГРУЗКИ:
  // app.isPackaged = true, если это готовый .exe файл
  // app.isPackaged = false, если мы запускаем через npm (разработка)
  
  if (!app.isPackaged) {
    // Режим разработки: грузим с Vite сервера
    mainWindow.loadURL('http://localhost:5173');
    console.log("⚠️ DEV MODE: Loading from localhost:5173");
    
    // Открываем консоль разработчика (F12), чтобы видеть ошибки
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Продакшн: грузим собранный файл
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});