const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Проверяем, мы в режиме разработки или уже на зеркале?
  // Если запуск с флагом --fullscreen, то будет полный экран
  const isDev = !app.isPackaged; 

  mainWindow = new BrowserWindow({
    // Размеры для теста на ПК (как вертикальный планшет)
    width: 600,
    height: 1000,
    
    // НА ЗЕРКАЛЕ: Включится полный экран
    // НА ПК: Будет просто окно
    fullscreen: isDev, // Или поставь true, если хочешь сразу Fullscreen
    
    frame: isDev, // На ПК рамки нужны, чтобы закрыть/двигать. На зеркале — нет.
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- YOUTUBE ---
ipcMain.on('open-youtube', () => {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds; // Берем полные размеры экрана

  // Считаем правильную высоту для формата 16:9 (как на телевизоре)
  // Например: Если ширина 1080, то высота будет ~607px
  const videoHeight = Math.round(width * 9 / 16);
  
  // Вычисляем отступ сверху, чтобы окно встало ровно по центру
  const yPosition = Math.round((height - videoHeight) / 2);

  const ytWindow = new BrowserWindow({
    parent: mainWindow,
    // Размеры и позиция
    width: width,
    height: videoHeight,
    x: 0,
    y: yPosition,
    
    frame: false,       // Без рамок
    fullscreen: false,  // ВАЖНО: Не фуллскрин, а точные размеры
    alwaysOnTop: true,  // Поверх всего
    backgroundColor: '#000000',
    
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Загружаем TV версию
  ytWindow.loadURL('https://www.youtube.com/tv', {
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1' 
  });

  // ХАК: Уменьшаем масштаб интерфейса, чтобы все влезло по ширине
  // Если ширина зеркала узкая (1080px), TV интерфейс может быть слишком крупным
  ytWindow.webContents.on('did-finish-load', () => {
    // Масштаб 0.7 или 0.8 обычно идеален для 1080px ширины
    ytWindow.webContents.setZoomFactor(0.7);
    
    // Добавляем CSS для кнопки закрытия (крестик)
    ytWindow.webContents.insertCSS(`
        /* Стиль кнопки закрытия */
        #close-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: rgba(255, 0, 0, 0.6);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #close-btn:hover { background: red; }
    `);

    ytWindow.webContents.executeJavaScript(`
        const btn = document.createElement('div');
        btn.id = 'close-btn';
        btn.innerHTML = '×';
        btn.onclick = () => window.close();
        document.body.appendChild(btn);
    `);
  });
});

// --- СИСТЕМА ---
ipcMain.on('system-reload', (e) => BrowserWindow.fromWebContents(e.sender).reload());
ipcMain.on('system-devtools', (e) => BrowserWindow.fromWebContents(e.sender).webContents.toggleDevTools());
ipcMain.on('system-quit', () => app.quit());