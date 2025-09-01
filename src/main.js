const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 990,
    height: 870,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Set application menu to match on-screen buttons
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Print',
          accelerator: 'Ctrl+P',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.print({ silent: false, printBackground: true }, () => {});
            }
          }
        },
        {
          label: 'Export PDF',
          accelerator: 'Ctrl+E',
          click: async () => {
            const win = BrowserWindow.getFocusedWindow();
            if (!win) return;
            const { canceled, filePath } = await dialog.showSaveDialog(win, {
              title: 'Export Report as PDF',
              defaultPath: 'cash-count-report.pdf',
              filters: [{ name: 'PDF', extensions: ['pdf'] }]
            });
            if (canceled || !filePath) return;
            const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
            fs.writeFileSync(filePath, pdf);
          }
        },
        { type: 'separator' },
        {
          label: 'Reset',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) win.webContents.send('reset');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          role: process.platform === 'darwin' ? 'close' : undefined,
          click: () => { app.quit(); }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: Print to system default printer
ipcMain.handle('print', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return new Promise((resolve, reject) => {
    win.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => {
      if (!success) return reject(new Error(failureReason || 'Print failed'));
      resolve(true);
    });
  });
});

// IPC: Export current page to PDF via Save Dialog
ipcMain.handle('export-pdf', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Export Report as PDF',
    defaultPath: 'cash-count-report.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (canceled || !filePath) return { canceled: true };

  const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
  fs.writeFileSync(filePath, pdf);
  return { canceled: false, filePath };
});

// IPC: Exit application
ipcMain.handle('exit-app', async () => {
  app.quit();
});
