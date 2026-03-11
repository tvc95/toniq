import { app as o, BrowserWindow as d, ipcMain as r } from "electron";
import O from "path";
import { createRequire as u } from "module";
import { fileURLToPath as w } from "node:url";
import s from "node:path";
const S = u(import.meta.url), A = S("better-sqlite3"), U = O.join(o.getPath("userData"), "toniq.db"), n = new A(U);
n.exec(`
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
const R = s.dirname(w(import.meta.url));
process.env.APP_ROOT = s.join(R, "..");
const E = process.env.VITE_DEV_SERVER_URL, C = s.join(process.env.APP_ROOT, "dist-electron"), c = s.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = E ? s.join(process.env.APP_ROOT, "public") : c;
let e;
function N() {
  e = new d({
    icon: s.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 760,
    height: 680,
    resizable: !1,
    webPreferences: {
      preload: s.join(R, "preload.mjs")
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), E ? e.loadURL(E) : e.loadFile(s.join(c, "index.html"));
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), e = null);
});
o.on("activate", () => {
  d.getAllWindows().length === 0 && N();
});
r.handle("db:saveSession", (a, t) => {
  const { session: i, answers: l } = t, p = n.prepare(`
    INSERT INTO sessions (date, mode, score, total, duration_ms)
    VALUES (@date, @mode, @score, @total, @duration_ms)
  `), _ = n.prepare(`
    INSERT INTO answers (session_id, question, correct_answer, user_answer, response_time_ms)
    VALUES (@session_id, @question, @correct_answer, @user_answer, @response_time_ms)
  `);
  return n.transaction(
    (L, I) => {
      const { lastInsertRowid: T } = p.run(L);
      for (const m of I)
        _.run({ ...m, session_id: T });
      return T;
    }
  )(i, l);
});
r.handle("db:getHistory", () => n.prepare("SELECT * FROM sessions ORDER BY date DESC").all());
r.handle("db:setSetting", (a, t, i) => {
  n.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(t, i);
});
r.handle("db:getSetting", (a, t) => n.prepare("SELECT value FROM settings WHERE key = ?").get(t));
o.whenReady().then(N);
export {
  C as MAIN_DIST,
  c as RENDERER_DIST,
  E as VITE_DEV_SERVER_URL
};
