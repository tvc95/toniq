import { ipcRenderer, contextBridge } from 'electron'
import type { SaveSessionData, SettingKey } from '../src/types/db'
import type { SessionStats } from '../src/utils/achievementChecker'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  saveSession: (data: SaveSessionData) => ipcRenderer.invoke('db:saveSession', data),
  getHistory: () => ipcRenderer.invoke('db:getHistory'),
  setSetting: (key: SettingKey, value: string) => ipcRenderer.invoke('db.setSetting', key, value),
  getSetting: (key: SettingKey) => ipcRenderer.invoke('db.getSetting', key),
  getXP: () => ipcRenderer.invoke('db:getExperience'),
  addXP: (amount: number) => ipcRenderer.invoke('db:addExperience', amount),
  getStreak: () => ipcRenderer.invoke('db:getStreak'),
  updateStreak: () => ipcRenderer.invoke('db:updateStreak'),
  getAchievements: () => ipcRenderer.invoke('db:getAchievements'),
  unlockAchievements: (ids: string[]) => ipcRenderer.invoke('db:unlockAchievements', ids),
  checkAchievements: (stats: SessionStats) => ipcRenderer.invoke('db:checkAchievements', stats),
})
