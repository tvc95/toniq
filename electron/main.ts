import { app, BrowserWindow, ipcMain } from 'electron'
import db from './database'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 760,
    height: 680,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

/**
 * Saves full session
 */
ipcMain.handle('db:saveSession', (_event, data) => {
  const { session, answers } = data

  const insertSession = db.prepare(`
    INSERT INTO sessions (date, mode, score, total, duration_ms)
    VALUES (@date, @mode, @score, @total, @duration_ms)
  `)

  const insertAnswer = db.prepare(`
    INSERT INTO answers (session_id, question, correct_answer, user_answer, response_time_ms)
    VALUES (@session_id, @question, @correct_answer, @user_answer, @response_time_ms)
  `)

  // Saves session and answers all at once
  const saveAll = db.transaction(
    (session: Record<string, unknown>, answers: Record<string, unknown>[]) => {
      const { lastInsertRowid } = insertSession.run(session)

      for (const answer of answers) {
        insertAnswer.run({ ...answer, session_id: lastInsertRowid })
      }
      return lastInsertRowid
    }
  )

  return saveAll(session, answers)
})

/**
 * Returns full history
 */
ipcMain.handle('db:getHistory', () => {
  return db.prepare('SELECT * FROM sessions ORDER BY date DESC').all()
})

/**
 * Save Settings
 */
ipcMain.handle('db:setSetting', (_event, key, value) => {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
})

/**
 * Search settings
 */
ipcMain.handle('db:getSetting', (_event, key) => {
  return db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
})

/**
 * Experience and Leveling System
 */
ipcMain.handle('db:getExperience', () => {
  return db.prepare('SELECT * FROM experience WHERE id = 1').get()
})

/**
 * Adds experience points and updates level if necessary. Returns updated XP and level info.
 */
ipcMain.handle('db:addExperience', (_event, xpToAdd: number) => {
  const current = db.prepare('SELECT * FROM experience WHERE id = 1').get() as {
    total_xp: number
    level: number
  }
  const newTotalXp = current.total_xp + xpToAdd
  const newLevel = calculateLevel(newTotalXp)
  const now = new Date().toISOString()

  db.prepare('UPDATE experience SET total_xp = ?, level = ?, updated_at = ? WHERE id = 1').run(
    newTotalXp,
    newLevel,
    now
  )

  return { total_xp: newTotalXp, level: newLevel, leveled_up: newLevel > current.level }
})

/**
 * Helper function to calculate level based on total experience points.
 * Uses an exponential formula to make leveling up progressively harder.
 * @param totalXP - Total experience points accumulated by the user.
 * @returns calculated level based on total XP.
 */
function calculateLevel(totalXP: number): number {
  let level = 1
  while (totalXP >= Math.floor(100 * Math.pow(level, 1.8))) {
    level++
  }
  return level
}

app.whenReady().then(createWindow)
