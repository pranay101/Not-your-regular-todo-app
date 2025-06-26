import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as db from "./database";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    height: 780,
    maxHeight: 780,
    width: 1440,
    maxWidth: 1440,
    frame: false,
    backgroundColor: "#18181a",
    roundedCorners: true, // enables rounded corners (macOS only)
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// IPC handlers for window controls
ipcMain.on("minimize-window", () => {
  if (win) {
    win.minimize();
  }
});

ipcMain.on("maximize-window", () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

app.whenReady().then(() => {
  db.initDatabase();
  createWindow();

  // --- IPC handlers for Todos ---
  ipcMain.handle("todos:getAll", () => {
    return db.getAllTodos();
  });

  ipcMain.handle("todos:getByDate", (event, date) => {
    return db.getTodoByDate(date);
  });

  ipcMain.handle("todos:add", (event, todo) => {
    return db.addTodo(todo);
  });

  ipcMain.handle("todos:update", (event, id, todo) => {
    return db.updateTodo(id, todo);
  });

  ipcMain.handle("todos:updateStatus", (event, id, status) => {
    db.updateTodoStatus(id, status);
    return { success: true };
  });

  ipcMain.handle("todos:delete", (event, id) => {
    db.deleteTodo(id);
    return { success: true };
  });

  ipcMain.handle("todos:getByDateRange", (event, start, end) => {
    return db.getTodosByDateRange(start, end);
  });

  // --- IPC handlers for Notes ---
  ipcMain.handle("notes:getAll", () => {
    return db.getAllNotes();
  });

  ipcMain.handle("notes:add", (event, content) => {
    return db.addNote(content);
  });

  ipcMain.handle("notes:update", (event, id, content) => {
    db.updateNote(id, content);
    return { success: true };
  });

  ipcMain.handle("notes:delete", (event, id) => {
    db.deleteNote(id);
    return { success: true };
  });

  // --- IPC handlers for Users ---
  ipcMain.handle("user:get", () => {
    return db.getUser();
  });

  ipcMain.handle("user:create", (event, userData) => {
    return db.createUser(userData);
  });

  ipcMain.handle("user:update", (event, id, userData) => {
    return db.updateUser(id, userData);
  });

  ipcMain.handle("user:exists", () => {
    return db.checkUserExists();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
