import { app, ipcMain, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
const __filename = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename);
global.__filename = __filename;
global.__dirname = __dirname$1;
let db = null;
function initDatabase() {
  if (db) return db;
  const dbPath = app ? path.join(app.getPath("userData"), "app.db") : path.join(__dirname$1, "app.db");
  db = new Database(dbPath);
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      priority TEXT,
      date TEXT
    );
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  ).run();
  const todoCount = db.prepare("SELECT COUNT(*) as count FROM todos").get();
  if (todoCount.count === 0) {
    console.log("Database empty");
  }
  return db;
}
function getDb() {
  if (!db)
    throw new Error("Database not initialized. Call initDatabase() first.");
  return db;
}
function getAllTodos() {
  return getDb().prepare("SELECT * FROM todos").all();
}
function getTodoByDate(date) {
  return getDb().prepare("SELECT * FROM todos WHERE date = ?").all(date);
}
function addTodo(todo) {
  const stmt = getDb().prepare(
    "INSERT INTO todos (title, description, status, priority, date) VALUES (?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    todo.title,
    todo.description,
    todo.status,
    todo.priority,
    todo.date
  );
  return { ...todo, id: info.lastInsertRowid };
}
function updateTodo(id, todo) {
  getDb().prepare(
    "UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, date = ? WHERE id = ?"
  ).run(
    todo.title,
    todo.description,
    todo.status,
    todo.priority,
    todo.date,
    id
  );
  return { ...todo, id };
}
function updateTodoStatus(id, status) {
  getDb().prepare("UPDATE todos SET status = ? WHERE id = ?").run(status, id);
}
function deleteTodo(id) {
  getDb().prepare("DELETE FROM todos WHERE id = ?").run(id);
}
function getTodosByDateRange(start, end) {
  return getDb().prepare("SELECT * FROM todos WHERE date >= ? AND date <= ?").all(start, end);
}
function getAllNotes() {
  return getDb().prepare("SELECT * FROM notes").all();
}
function addNote(content) {
  const stmt = getDb().prepare("INSERT INTO notes (content) VALUES (?)");
  const info = stmt.run(content);
  return { id: info.lastInsertRowid, content };
}
function updateNote(id, content) {
  getDb().prepare(
    "UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(content, id);
}
function deleteNote(id) {
  getDb().prepare("DELETE FROM notes WHERE id = ?").run(id);
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    height: 780,
    maxHeight: 780,
    width: 1440,
    maxWidth: 1440,
    frame: false,
    backgroundColor: "#18181a",
    roundedCorners: true,
    // enables rounded corners (macOS only)
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
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
  initDatabase();
  createWindow();
  ipcMain.handle("todos:getAll", () => {
    return getAllTodos();
  });
  ipcMain.handle("todos:getByDate", (event, date) => {
    return getTodoByDate(date);
  });
  ipcMain.handle("todos:add", (event, todo) => {
    return addTodo(todo);
  });
  ipcMain.handle("todos:update", (event, id, todo) => {
    return updateTodo(id, todo);
  });
  ipcMain.handle("todos:updateStatus", (event, id, status) => {
    updateTodoStatus(id, status);
    return { success: true };
  });
  ipcMain.handle("todos:delete", (event, id) => {
    deleteTodo(id);
    return { success: true };
  });
  ipcMain.handle("todos:getByDateRange", (event, start, end) => {
    return getTodosByDateRange(start, end);
  });
  ipcMain.handle("notes:getAll", () => {
    return getAllNotes();
  });
  ipcMain.handle("notes:add", (event, content) => {
    return addNote(content);
  });
  ipcMain.handle("notes:update", (event, id, content) => {
    updateNote(id, content);
    return { success: true };
  });
  ipcMain.handle("notes:delete", (event, id) => {
    deleteNote(id);
    return { success: true };
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
