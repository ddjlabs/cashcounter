const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer
contextBridge.exposeInMainWorld('cashAPI', {
  print: () => ipcRenderer.invoke('print'),
  exportPdf: () => ipcRenderer.invoke('export-pdf'),
  exit: () => ipcRenderer.invoke('exit-app'),
  onReset: (handler) => ipcRenderer.on('reset', handler),
});
