"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  saveSession: (data) => electron.ipcRenderer.invoke("db:saveSession", data),
  getHistory: () => electron.ipcRenderer.invoke("db:getHistory"),
  playAudio: (cfg) => electron.ipcRenderer.invoke("audio:play", cfg)
});
