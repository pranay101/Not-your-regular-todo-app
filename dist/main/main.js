/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || (function () {\n    var ownKeys = function(o) {\n        ownKeys = Object.getOwnPropertyNames || function (o) {\n            var ar = [];\n            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;\n            return ar;\n        };\n        return ownKeys(o);\n    };\n    return function (mod) {\n        if (mod && mod.__esModule) return mod;\n        var result = {};\n        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== \"default\") __createBinding(result, mod, k[i]);\n        __setModuleDefault(result, mod);\n        return result;\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst electron_1 = __webpack_require__(/*! electron */ \"electron\");\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nconst fs = __importStar(__webpack_require__(/*! fs */ \"fs\"));\nconst sqlite3 = __importStar(__webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'sqlite3'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));\nconst sqlite_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'sqlite'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n// Handle creating/removing shortcuts on Windows when installing/uninstalling.\nif (__webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'electron-squirrel-startup'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))) {\n    electron_1.app.quit();\n}\nlet mainWindow = null;\nlet db = null;\nconst createWindow = async () => {\n    // Create the browser window.\n    mainWindow = new electron_1.BrowserWindow({\n        width: 1200,\n        height: 800,\n        minWidth: 800,\n        minHeight: 600,\n        frame: false, // Frameless window for custom title bar\n        webPreferences: {\n            preload: path.join(__dirname, \"preload.js\"),\n            nodeIntegration: false,\n            contextIsolation: true,\n        },\n        backgroundColor: \"#1A1A2E\", // Match the app's background color\n    });\n    // and load the index.html of the app.\n    if (false) {}\n    else {\n        // When in production, load the built index.html\n        mainWindow.loadFile(path.join(__dirname, \"../renderer/index.html\"));\n    }\n    // Open the DevTools in development mode\n    if (true) {\n        mainWindow.webContents.openDevTools();\n    }\n};\n// Initialize the database\nconst initDatabase = async () => {\n    const userDataPath = electron_1.app.getPath(\"userData\");\n    const dbPath = path.join(userDataPath, \"todo-app.db\");\n    // Ensure the directory exists\n    if (!fs.existsSync(userDataPath)) {\n        fs.mkdirSync(userDataPath, { recursive: true });\n    }\n    // Open the database\n    db = await (0, sqlite_1.open)({\n        filename: dbPath,\n        driver: sqlite3.Database,\n    });\n    // Create tables if they don't exist\n    await db.exec(`\r\n    CREATE TABLE IF NOT EXISTS todos (\r\n      id TEXT PRIMARY KEY,\r\n      title TEXT NOT NULL,\r\n      completed INTEGER DEFAULT 0,\r\n      priority TEXT DEFAULT 'medium',\r\n      category TEXT,\r\n      createdAt TEXT NOT NULL,\r\n      completedAt TEXT\r\n    );\r\n\r\n    CREATE TABLE IF NOT EXISTS pomodoros (\r\n      id TEXT PRIMARY KEY,\r\n      type TEXT NOT NULL,\r\n      duration INTEGER NOT NULL,\r\n      startTime TEXT,\r\n      endTime TEXT,\r\n      todoId TEXT,\r\n      FOREIGN KEY (todoId) REFERENCES todos(id)\r\n    );\r\n\r\n    CREATE TABLE IF NOT EXISTS settings (\r\n      id INTEGER PRIMARY KEY CHECK (id = 1),\r\n      pomodoroLength INTEGER DEFAULT 25,\r\n      shortBreakLength INTEGER DEFAULT 5,\r\n      longBreakLength INTEGER DEFAULT 15,\r\n      longBreakInterval INTEGER DEFAULT 4,\r\n      autoStartBreaks INTEGER DEFAULT 0,\r\n      autoStartPomodoros INTEGER DEFAULT 0,\r\n      darkMode INTEGER DEFAULT 1,\r\n      notificationsEnabled INTEGER DEFAULT 1\r\n    );\r\n  `);\n    // Insert default settings if not exists\n    const settings = await db.get(\"SELECT * FROM settings WHERE id = 1\");\n    if (!settings) {\n        await db.run(`\r\n      INSERT INTO settings (\r\n        id, pomodoroLength, shortBreakLength, longBreakLength, \r\n        longBreakInterval, autoStartBreaks, autoStartPomodoros, \r\n        darkMode, notificationsEnabled\r\n      ) VALUES (1, 25, 5, 15, 4, 0, 0, 1, 1)\r\n    `);\n    }\n};\n// IPC handlers for window controls\nelectron_1.ipcMain.on(\"window-minimize\", () => {\n    if (mainWindow)\n        mainWindow.minimize();\n});\nelectron_1.ipcMain.on(\"window-maximize\", () => {\n    if (mainWindow) {\n        if (mainWindow.isMaximized()) {\n            mainWindow.unmaximize();\n        }\n        else {\n            mainWindow.maximize();\n        }\n    }\n});\nelectron_1.ipcMain.on(\"window-close\", () => {\n    if (mainWindow)\n        mainWindow.close();\n});\n// This method will be called when Electron has finished\n// initialization and is ready to create browser windows.\n// Some APIs can only be used after this event occurs.\nelectron_1.app.on(\"ready\", async () => {\n    await initDatabase();\n    createWindow();\n});\n// Quit when all windows are closed, except on macOS. There, it's common\n// for applications and their menu bar to stay active until the user quits\n// explicitly with Cmd + Q.\nelectron_1.app.on(\"window-all-closed\", () => {\n    if (process.platform !== \"darwin\") {\n        electron_1.app.quit();\n    }\n});\nelectron_1.app.on(\"activate\", () => {\n    // On OS X it's common to re-create a window in the app when the\n    // dock icon is clicked and there are no other windows open.\n    if (electron_1.BrowserWindow.getAllWindows().length === 0) {\n        createWindow();\n    }\n});\n// In this file you can include the rest of your app's specific main process\n// code. You can also put them in separate files and import them here.\n// IPC handlers for database operations\nelectron_1.ipcMain.handle(\"get-todos\", async () => {\n    try {\n        return await db.all(\"SELECT * FROM todos ORDER BY createdAt DESC\");\n    }\n    catch (error) {\n        console.error(\"Error getting todos:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"add-todo\", async (_, todo) => {\n    try {\n        await db.run(\"INSERT INTO todos (id, title, priority, category, createdAt) VALUES (?, ?, ?, ?, ?)\", [todo.id, todo.title, todo.priority, todo.category, todo.createdAt]);\n        return { success: true };\n    }\n    catch (error) {\n        console.error(\"Error adding todo:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"update-todo\", async (_, todo) => {\n    try {\n        await db.run(\"UPDATE todos SET title = ?, completed = ?, priority = ?, category = ?, completedAt = ? WHERE id = ?\", [\n            todo.title,\n            todo.completed ? 1 : 0,\n            todo.priority,\n            todo.category,\n            todo.completedAt,\n            todo.id,\n        ]);\n        return { success: true };\n    }\n    catch (error) {\n        console.error(\"Error updating todo:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"delete-todo\", async (_, id) => {\n    try {\n        await db.run(\"DELETE FROM todos WHERE id = ?\", [id]);\n        return { success: true };\n    }\n    catch (error) {\n        console.error(\"Error deleting todo:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"get-pomodoros\", async () => {\n    try {\n        return await db.all(\"SELECT * FROM pomodoros ORDER BY startTime DESC\");\n    }\n    catch (error) {\n        console.error(\"Error getting pomodoros:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"add-pomodoro\", async (_, pomodoro) => {\n    try {\n        await db.run(\"INSERT INTO pomodoros (id, type, duration, startTime, endTime, todoId) VALUES (?, ?, ?, ?, ?, ?)\", [\n            pomodoro.id,\n            pomodoro.type,\n            pomodoro.duration,\n            pomodoro.startTime,\n            pomodoro.endTime,\n            pomodoro.todoId,\n        ]);\n        return { success: true };\n    }\n    catch (error) {\n        console.error(\"Error adding pomodoro:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"get-settings\", async () => {\n    try {\n        const settings = await db.get(\"SELECT * FROM settings WHERE id = 1\");\n        return {\n            pomodoroLength: settings.pomodoroLength,\n            shortBreakLength: settings.shortBreakLength,\n            longBreakLength: settings.longBreakLength,\n            longBreakInterval: settings.longBreakInterval,\n            autoStartBreaks: Boolean(settings.autoStartBreaks),\n            autoStartPomodoros: Boolean(settings.autoStartPomodoros),\n            darkMode: Boolean(settings.darkMode),\n            notificationsEnabled: Boolean(settings.notificationsEnabled),\n        };\n    }\n    catch (error) {\n        console.error(\"Error getting settings:\", error);\n        throw error;\n    }\n});\nelectron_1.ipcMain.handle(\"update-settings\", async (_, settings) => {\n    try {\n        await db.run(`UPDATE settings SET \r\n        pomodoroLength = ?, \r\n        shortBreakLength = ?, \r\n        longBreakLength = ?, \r\n        longBreakInterval = ?, \r\n        autoStartBreaks = ?, \r\n        autoStartPomodoros = ?, \r\n        darkMode = ?, \r\n        notificationsEnabled = ? \r\n      WHERE id = 1`, [\n            settings.pomodoroLength,\n            settings.shortBreakLength,\n            settings.longBreakLength,\n            settings.longBreakInterval,\n            settings.autoStartBreaks ? 1 : 0,\n            settings.autoStartPomodoros ? 1 : 0,\n            settings.darkMode ? 1 : 0,\n            settings.notificationsEnabled ? 1 : 0,\n        ]);\n        return { success: true };\n    }\n    catch (error) {\n        console.error(\"Error updating settings:\", error);\n        throw error;\n    }\n});\n\n\n//# sourceURL=webpack://not-the-regular-todo-app/./src/main/main.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/main.ts");
/******/ 	
/******/ })()
;