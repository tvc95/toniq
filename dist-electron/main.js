import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { createRequire as createRequire$1 } from "node:module";
import { fileURLToPath as fileURLToPath$1 } from "node:url";
import path$1 from "node:path";
const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(app.getPath("userData"), "toniq.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT    NOT NULL,
    mode        TEXT    NOT NULL,
    score       INTEGER NOT NULL,
    total       INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS answers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      INTEGER NOT NULL,
    question        TEXT    NOT NULL,
    correct_answer  TEXT    NOT NULL,
    user_answer     TEXT    NOT NULL,
    response_time_ms INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
createRequire$1(import.meta.url);
const __dirname$1 = path$1.dirname(fileURLToPath$1(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
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
ipcMain.handle("db:saveSession", (_event, data) => {
  const { session, answers } = data;
  const insertSession = db.prepare(`
    INSERT INTO sessions (date, mode, score, total, duration_ms)
    VALUES (@date, @mode, @score, @total, @duration_ms)
  `);
  const insertAnswer = db.prepare(`
    INSERT INTO answers (session_id, question, correct_answer, user_answer, response_time_ms)
    VALUES (@session_id, @question, @correct_answer, @user_answer, @response_time_ms)
  `);
  const saveAll = db.transaction((session2, answers2) => {
    const { lastInsertRowid } = insertSession.run(session2);
    for (const answer of answers2) {
      insertAnswer.run({ ...answer, session_id: lastInsertRowid });
    }
    return lastInsertRowid;
  });
  return saveAll(session, answers);
});
ipcMain.handle("db:getHistory", () => {
  return db.prepare("SELECT * FROM sessions ORDER BY date DESC").all();
});
ipcMain.handle("db:setSetting", (_event, key, value) => {
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(
    key,
    value
  );
});
ipcMain.handle("db:getSetting", (_event, key) => {
  return db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
});
ipcMain.handle("audio:play", (_event, config) => {
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
