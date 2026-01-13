const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openYouTube: () => ipcRenderer.send('open-youtube'),
  reloadApp: () => ipcRenderer.send('system-reload'),
  toggleDevTools: () => ipcRenderer.send('system-devtools'),
  quitApp: () => ipcRenderer.send('system-quit'),
});