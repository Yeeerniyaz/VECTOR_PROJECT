const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendKey: (key) => ipcRenderer.send('send-key', key),
  systemVolume: (action) => ipcRenderer.send('system-volume', action),
  openYouTube: () => ipcRenderer.send('open-youtube'),
  closeYouTube: () => ipcRenderer.send('close-youtube'),
  reload: () => ipcRenderer.send('system-reload'),
});