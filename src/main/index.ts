import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import * as path from "path";
import * as url from "url";
import Store from "electron-store";

// Initialize the store
const store = new Store({
  name: "todo-tracker",
  defaults: {
    todos: [],
    completedTodos: [],
    pomodoros: [],
    settings: {
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      darkMode: false,
    },
  },
});

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: true,
    titleBarStyle: "hidden",
    backgroundColor: "#1E1E2E",
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  // Load the index.html of the app
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Create tray icon
  createTray();
}

function createTray() {
  tray = new Tray(path.join(__dirname, "../assets/tray-icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Open", click: () => mainWindow?.show() },
    {
      label: "Start Pomodoro",
      click: () => mainWindow?.webContents.send("start-pomodoro"),
    },
    {
      label: "Pause Pomodoro",
      click: () => mainWindow?.webContents.send("pause-pomodoro"),
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("Todo Tracker");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for data operations
ipcMain.handle("get-todos", () => {
  return store.get("todos");
});

ipcMain.handle("save-todos", (_, todos) => {
  store.set("todos", todos);
  return true;
});

ipcMain.handle("get-completed-todos", () => {
  return store.get("completedTodos");
});

ipcMain.handle("save-completed-todos", (_, completedTodos) => {
  store.set("completedTodos", completedTodos);
  return true;
});

ipcMain.handle("get-pomodoros", () => {
  return store.get("pomodoros");
});

ipcMain.handle("save-pomodoro", (_, pomodoro) => {
  const pomodoros = store.get("pomodoros") as any[];
  pomodoros.push(pomodoro);
  store.set("pomodoros", pomodoros);
  return true;
});

ipcMain.handle("get-settings", () => {
  return store.get("settings");
});

ipcMain.handle("save-settings", (_, settings) => {
  store.set("settings", settings);
  return true;
});
