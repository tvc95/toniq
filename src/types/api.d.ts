interface Window {
  api: {
    saveSession: (data: SessionData) => Promise<void>;
    getHistory: () => Promise<SessionData[]>;
    playAudio: (config: AudioConfig) => Promise<void>;
  };
}
