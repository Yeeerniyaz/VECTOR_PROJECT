const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openYouTube: () => ipcRenderer.send('open-youtube'),
  closeYouTube: () => ipcRenderer.send('close-youtube'),
  ytNav: (key) => ipcRenderer.send('yt-nav', key),
  reloadApp: () => ipcRenderer.send('system-reload'),
});