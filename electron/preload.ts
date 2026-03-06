import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
  saveSession: (data: any) => ipcRenderer.invoke("db:saveSession", data),
  getHistory: () => ipcRenderer.invoke("db:getHistory"),
  playAudio: (cfg: any) => ipcRenderer.invoke("audio:play", cfg),
});
