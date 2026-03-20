import { useState, useEffect, useCallback } from 'react'

interface StreakState {
  current: number
  best: number
  lastActive: string
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>({
    current: 0,
    best: 0,
    lastActive: '',
  })

  // Fetch initial streak data on mount
  useEffect(() => {
    window.api.getStreak().then(data => {
      setStreak({
        current: data.current,
        best: data.best,
        lastActive: data.last_active,
      })
    })
  }, [])

  const updateStreak = useCallback(async () => {
    const result = await window.api.updateStreak()
    setStreak({
      current: result.current,
      best: result.best,
      lastActive: result.last_active,
    })
    return result
  }, [])

  // Determine if the user has practiced today
  const practicedToday = streak.lastActive === new Date().toISOString().slice(0, 10)

  return {
    ...streak,
    practicedToday,
    updateStreak,
  }
}
