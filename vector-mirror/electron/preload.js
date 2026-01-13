const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openYouTube: () => ipcRenderer.send('open-youtube'),
  closeYouTube: () => ipcRenderer.send('close-youtube'), // <--- ДОБАВИЛИ ЭТО
  reloadApp: () => ipcRenderer.send('system-reload'),
  quitApp: () => ipcRenderer.send('system-quit'),
});