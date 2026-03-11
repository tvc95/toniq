import { ipcRenderer, contextBridge } from 'electron'
import type { SaveSessionData, SettingKey } from '../src/types/db'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  saveSession: (data: SaveSessionData) => ipcRenderer.invoke('db:saveSession', data),
  getHistory: () => ipcRenderer.invoke('db:getHistory'),
  setSetting: (key: SettingKey, value: string) => ipcRenderer.invoke('db.setSetting', key, value),
  getSetting: (key: SettingKey) => ipcRenderer.invoke('db.getSetting', key),
})
