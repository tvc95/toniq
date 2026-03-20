interface XPData {
  total_xp: number
  level: number
}

interface AddXPResult {
  total_xp: number
  level: number
  leveled_up: boolean
}

interface StreakData {
  current: number
  best: number
  last_active: string
}

interface Window {
  api: {
    saveSession: (data: SessionData) => Promise<void>
    getHistory: () => Promise<SessionData[]>
    playAudio: (config: AudioConfig) => Promise<void>
    getXP: () => Promise<XPData>
    addXP: (amount: number) => Promise<AddXPResult>
    getStreak: () => Promise<StreakData>
    updateStreak: () => Promise<StreakData>
  }
}
