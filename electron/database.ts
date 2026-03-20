import path from 'path'
import { createRequire } from 'module'
import { app } from 'electron'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

const dbPath = path.join(app.getPath('userData'), 'toniq.db')
const db = new Database(dbPath)

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
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS experience (
    id          INTEGER PRIMARY KEY,
    total_xp    INTEGER NOT NULL DEFAULT 0,
    level       INTEGER NOT NULL DEFAULT 1,
    updated_at  TEXT    NOT NULL DEFAULT ''
  );
`)

db.prepare(
  `INSERT OR IGNORE INTO experience (id, total_xp, level, updated_at)
  VALUES (1, 0, 1, datetime('now'))`
).run()

db.exec(`
  CREATE TABLE IF NOT EXISTS streak (
    id           INTEGER PRIMARY KEY,
    current      INTEGER NOT NULL DEFAULT 0,
    best         INTEGER NOT NULL DEFAULT 0,
    last_active  TEXT NOT NULL DEFAULT ''
  );
`)

db.prepare(
  `INSERT OR IGNORE INTO streak (id, current, best, last_active)
  VALUES (1, 0, 0, '')`
).run()

export default db
