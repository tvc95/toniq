"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  saveSession: (data) => electron.ipcRenderer.invoke("db:saveSession", data),
  getHistory: () => electron.ipcRenderer.invoke("db:getHistory"),
  setSetting: (key, value) => electron.ipcRenderer.invoke("db.setSetting", key, value),
  getSetting: (key) => electron.ipcRenderer.invoke("db.getSetting", key),
  playAudio: (cfg) => electron.ipcRenderer.invoke("audio:play", cfg)
});
