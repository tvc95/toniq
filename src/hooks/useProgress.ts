import { useState, useCallback } from 'react'
import type { Session, SaveSessionData } from '../types/db'

/**
 * Hook that manages user progress and session history for ear training exercises.
 * Provides functions to save session data and load user history from the database.
 * @returns An object containing the current sessions, loading state, and functions
 * to save and load sessions.
 */
export function useProgress() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  const saveSession = useCallback(async (data: SaveSessionData) => {
    await window.api.saveSession(data)
  }, [])

  const loadHistory = useCallback(async () => {
    setLoading(true)
    const data = await window.api.getHistory()
    setSessions(data)
    setLoading(false)
    return data
  }, [])

  return {
    sessions,
    loading,
    saveSession,
    loadHistory,
  }
}
