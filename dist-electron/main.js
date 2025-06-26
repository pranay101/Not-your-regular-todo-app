import { app as d, ipcMain as r, BrowserWindow as T } from "electron";
import { createRequire as _ } from "node:module";
import { fileURLToPath as p } from "node:url";
import i from "node:path";
import h from "better-sqlite3";
const l = p(import.meta.url), c = i.dirname(l);
global.__filename = l;
global.__dirname = c;
let s = null;
function N() {
  if (s) return s;
  const t = d ? i.join(d.getPath("userData"), "app.db") : i.join(c, "app.db");
  return s = new h(t), s.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      onboarding_completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  ).run(), s.prepare(
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
  ).run(), s.prepare(
    `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  ).run(), s.prepare("SELECT COUNT(*) as count FROM todos").get().count === 0 && console.log("Database empty"), s;
}
function a() {
  if (!s)
    throw new Error("Database not initialized. Call initDatabase() first.");
  return s;
}
function R() {
  return a().prepare("SELECT * FROM users LIMIT 1").get();
}
function S(t) {
  const n = a().prepare(
    "INSERT INTO users (name, email) VALUES (?, ?)"
  ).run(
    t.name,
    t.email || null
  );
  return { ...t, id: n.lastInsertRowid };
}
function M(t, e) {
  const n = [], E = [];
  e.name !== void 0 && (n.push("name = ?"), E.push(e.name)), e.email !== void 0 && (n.push("email = ?"), E.push(e.email)), e.onboarding_completed !== void 0 && (n.push("onboarding_completed = ?"), E.push(e.onboarding_completed)), n.push("updated_at = CURRENT_TIMESTAMP"), E.push(t);
  const I = `UPDATE users SET ${n.join(", ")} WHERE id = ?`;
  return a().prepare(I).run(...E), { ...e, id: t };
}
function U() {
  return !!R();
}
function D() {
  return a().prepare("SELECT * FROM todos").all();
}
function L(t) {
  return a().prepare("SELECT * FROM todos WHERE date = ?").all(t);
}
function g(t) {
  const n = a().prepare(
    "INSERT INTO todos (title, description, status, priority, date) VALUES (?, ?, ?, ?, ?)"
  ).run(
    t.title,
    t.description,
    t.status,
    t.priority,
    t.date
  );
  return { ...t, id: n.lastInsertRowid };
}
function O(t, e) {
  return a().prepare(
    "UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, date = ? WHERE id = ?"
  ).run(
    e.title,
    e.description,
    e.status,
    e.priority,
    e.date,
    t
  ), { ...e, id: t };
}
function C(t, e) {
  a().prepare("UPDATE todos SET status = ? WHERE id = ?").run(e, t);
}
function P(t) {
  a().prepare("DELETE FROM todos WHERE id = ?").run(t);
}
function v(t, e) {
  return a().prepare("SELECT * FROM todos WHERE date >= ? AND date <= ?").all(t, e);
}
function w() {
  return a().prepare("SELECT * FROM notes").all();
}
function b(t) {
  return { id: a().prepare("INSERT INTO notes (content) VALUES (?)").run(t).lastInsertRowid, content: t };
}
function F(t, e) {
  a().prepare(
    "UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(e, t);
}
function y(t) {
  a().prepare("DELETE FROM notes WHERE id = ?").run(t);
}
_(import.meta.url);
const m = i.dirname(p(import.meta.url));
process.env.APP_ROOT = i.join(m, "..");
const u = process.env.VITE_DEV_SERVER_URL, x = i.join(process.env.APP_ROOT, "dist-electron"), f = i.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = u ? i.join(process.env.APP_ROOT, "public") : f;
let o;
function A() {
  o = new T({
    icon: i.join(process.env.VITE_PUBLIC, "Icon.ico"),
    height: 780,
    maxHeight: 780,
    width: 1440,
    maxWidth: 1440,
    frame: !1,
    backgroundColor: "#18181a",
    roundedCorners: !0,
    // enables rounded corners (macOS only)
    transparent: !1,
    webPreferences: {
      preload: i.join(m, "preload.mjs")
    }
  }), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), u ? o.loadURL(u) : o.loadFile(i.join(f, "index.html"));
}
r.on("minimize-window", () => {
  o && o.minimize();
});
r.on("maximize-window", () => {
  o && (o.isMaximized() ? o.unmaximize() : o.maximize());
});
d.whenReady().then(() => {
  N(), A(), r.handle("todos:getAll", () => D()), r.handle("todos:getByDate", (t, e) => L(e)), r.handle("todos:add", (t, e) => g(e)), r.handle("todos:update", (t, e, n) => O(e, n)), r.handle("todos:updateStatus", (t, e, n) => (C(e, n), { success: !0 })), r.handle("todos:delete", (t, e) => (P(e), { success: !0 })), r.handle("todos:getByDateRange", (t, e, n) => v(e, n)), r.handle("notes:getAll", () => w()), r.handle("notes:add", (t, e) => b(e)), r.handle("notes:update", (t, e, n) => (F(e, n), { success: !0 })), r.handle("notes:delete", (t, e) => (y(e), { success: !0 })), r.handle("user:get", () => R()), r.handle("user:create", (t, e) => S(e)), r.handle("user:update", (t, e, n) => M(e, n)), r.handle("user:exists", () => U());
});
d.on("window-all-closed", () => {
  process.platform !== "darwin" && (d.quit(), o = null);
});
d.on("activate", () => {
  T.getAllWindows().length === 0 && A();
});
export {
  x as MAIN_DIST,
  f as RENDERER_DIST,
  u as VITE_DEV_SERVER_URL
};
