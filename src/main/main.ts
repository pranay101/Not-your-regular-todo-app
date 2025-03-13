// Forge-specific variables
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string | undefined;

import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let db: any = null;

const createWindow = async (): Promise<void> => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Frameless window for custom title bar
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: "#1A1A2E", // Match the app's background color
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // When in production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

// Initialize the database
const initDatabase = async (): Promise<void> => {
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "todo-app.db");

  // Ensure the directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  // Open the database
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'medium',
      category TEXT,
      createdAt TEXT NOT NULL,
      completedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS pomodoros (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      duration INTEGER NOT NULL,
      startTime TEXT,
      endTime TEXT,
      todoId TEXT,
      FOREIGN KEY (todoId) REFERENCES todos(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      pomodoroLength INTEGER DEFAULT 25,
      shortBreakLength INTEGER DEFAULT 5,
      longBreakLength INTEGER DEFAULT 15,
      longBreakInterval INTEGER DEFAULT 4,
      autoStartBreaks INTEGER DEFAULT 0,
      autoStartPomodoros INTEGER DEFAULT 0,
      darkMode INTEGER DEFAULT 1,
      notificationsEnabled INTEGER DEFAULT 1
    );
  `);

  // Insert default settings if not exists
  const settings = await db.get("SELECT * FROM settings WHERE id = 1");
  if (!settings) {
    await db.run(`
      INSERT INTO settings (
        id, pomodoroLength, shortBreakLength, longBreakLength, 
        longBreakInterval, autoStartBreaks, autoStartPomodoros, 
        darkMode, notificationsEnabled
      ) VALUES (1, 25, 5, 15, 4, 0, 0, 1, 1)
    `);
  }
};

// IPC handlers for window controls
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  await initDatabase();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC handlers for database operations
ipcMain.handle("get-todos", async () => {
  try {
    return await db.all("SELECT * FROM todos ORDER BY createdAt DESC");
  } catch (error) {
    console.error("Error getting todos:", error);
    throw error;
  }
});

ipcMain.handle("add-todo", async (_, todo) => {
  try {
    await db.run(
      "INSERT INTO todos (id, title, priority, category, createdAt) VALUES (?, ?, ?, ?, ?)",
      [todo.id, todo.title, todo.priority, todo.category, todo.createdAt]
    );
    return { success: true };
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
});

ipcMain.handle("update-todo", async (_, todo) => {
  try {
    await db.run(
      "UPDATE todos SET title = ?, completed = ?, priority = ?, category = ?, completedAt = ? WHERE id = ?",
      [
        todo.title,
        todo.completed ? 1 : 0,
        todo.priority,
        todo.category,
        todo.completedAt,
        todo.id,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
});

ipcMain.handle("delete-todo", async (_, id) => {
  try {
    await db.run("DELETE FROM todos WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
});

ipcMain.handle("get-pomodoros", async () => {
  try {
    return await db.all("SELECT * FROM pomodoros ORDER BY startTime DESC");
  } catch (error) {
    console.error("Error getting pomodoros:", error);
    throw error;
  }
});

ipcMain.handle("add-pomodoro", async (_, pomodoro) => {
  try {
    await db.run(
      "INSERT INTO pomodoros (id, type, duration, startTime, endTime, todoId) VALUES (?, ?, ?, ?, ?, ?)",
      [
        pomodoro.id,
        pomodoro.type,
        pomodoro.duration,
        pomodoro.startTime,
        pomodoro.endTime,
        pomodoro.todoId,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error("Error adding pomodoro:", error);
    throw error;
  }
});

ipcMain.handle("get-settings", async () => {
  try {
    const settings = await db.get("SELECT * FROM settings WHERE id = 1");
    return {
      pomodoroLength: settings.pomodoroLength,
      shortBreakLength: settings.shortBreakLength,
      longBreakLength: settings.longBreakLength,
      longBreakInterval: settings.longBreakInterval,
      autoStartBreaks: Boolean(settings.autoStartBreaks),
      autoStartPomodoros: Boolean(settings.autoStartPomodoros),
      darkMode: Boolean(settings.darkMode),
      notificationsEnabled: Boolean(settings.notificationsEnabled),
    };
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
});

ipcMain.handle("update-settings", async (_, settings) => {
  try {
    await db.run(
      `UPDATE settings SET 
        pomodoroLength = ?, 
        shortBreakLength = ?, 
        longBreakLength = ?, 
        longBreakInterval = ?, 
        autoStartBreaks = ?, 
        autoStartPomodoros = ?, 
        darkMode = ?, 
        notificationsEnabled = ? 
      WHERE id = 1`,
      [
        settings.pomodoroLength,
        settings.shortBreakLength,
        settings.longBreakLength,
        settings.longBreakInterval,
        settings.autoStartBreaks ? 1 : 0,
        settings.autoStartPomodoros ? 1 : 0,
        settings.darkMode ? 1 : 0,
        settings.notificationsEnabled ? 1 : 0,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
});
