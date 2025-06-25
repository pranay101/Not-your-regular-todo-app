import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// @ts-ignore
global.__filename = __filename;
// @ts-ignore
global.__dirname = __dirname;

let db: Database.Database | null = null;

export function initDatabase() {
  if (db) return db;
  // Use Electron's userData path for the database file
  const dbPath = app
    ? path.join(app.getPath("userData"), "app.db")
    : path.join(__dirname, "app.db");
  db = new Database(dbPath);

  // Initialize tables if they don't exist
  // Todos table
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

  // Notes table
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

  // Seed with initial data if todos table is empty
  const todoCount = db.prepare("SELECT COUNT(*) as count FROM todos").get() as {
    count: number;
  };
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

// --- TODOS CRUD ---
export function getAllTodos() {
  return getDb().prepare("SELECT * FROM todos").all();
}

export function getTodoByDate(date: string) {
  return getDb().prepare("SELECT * FROM todos WHERE date = ?").all(date);
}

export function addTodo(
  todo: Omit<
    {
      title: string;
      description: string;
      status: string;
      priority: string;
      date: string;
    },
    "id"
  >
) {
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

export function updateTodo(
  id: number,
  todo: {
    title: string;
    description: string;
    status: string;
    priority: string;
    date: string;
  }
) {
  getDb()
    .prepare(
      "UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, date = ? WHERE id = ?"
    )
    .run(
      todo.title,
      todo.description,
      todo.status,
      todo.priority,
      todo.date,
      id
    );
  return { ...todo, id };
}

export function updateTodoStatus(id: number, status: string) {
  getDb().prepare("UPDATE todos SET status = ? WHERE id = ?").run(status, id);
}

export function deleteTodo(id: number) {
  getDb().prepare("DELETE FROM todos WHERE id = ?").run(id);
}

export function getTodosByDateRange(start: string, end: string) {
  return getDb()
    .prepare("SELECT * FROM todos WHERE date >= ? AND date <= ?")
    .all(start, end);
}

// --- NOTES CRUD ---
export function getAllNotes() {
  return getDb().prepare("SELECT * FROM notes").all();
}

export function addNote(content: string) {
  const stmt = getDb().prepare("INSERT INTO notes (content) VALUES (?)");
  const info = stmt.run(content);
  return { id: info.lastInsertRowid, content };
}

export function updateNote(id: number, content: string) {
  getDb()
    .prepare(
      "UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .run(content, id);
}

export function deleteNote(id: number) {
  getDb().prepare("DELETE FROM notes WHERE id = ?").run(id);
}
