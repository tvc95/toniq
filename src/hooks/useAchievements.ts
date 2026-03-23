import { useState, useCallback, useEffect } from 'react'
import { ACHIEVEMENTS_LIST, type Achievement } from '../utils/achievements'
import type { SessionStats } from '../utils/achievementChecker'

export interface UnlockedAchievement extends Achievement {
  unlocked_at: string
}

/**
 * Custom hook to manage achievements state and logic.
 * @returns A list of unlocked achievements and a function to check and
 * unlock new achievements based on session stats.
 */
export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([])

  /**
   * On component mount, fetch the list of unlocked achievements from the backend
   * and enrich it with static achievement data.
   */
  useEffect(() => {
    window.api.getAchievements().then(data => {
      const enrichedData = data.map(row => ({
        ...ACHIEVEMENTS_LIST.find(achievement => achievement.id === row.id)!,
        unlocked_at: row.unlocked_at,
      }))

      setUnlocked(enrichedData)
    })
  }, [])

  /**
   * Checks the provided session stats against the achievement criteria and unlocks any new achievements.
   * @param stats - The session statistics to evaluate for achievement unlocking.
   * @returns A list of newly unlocked achievements based on the provided stats.
   */
  const checkAndUnlock = useCallback(async (stats: SessionStats) => {
    const newIds = await window.api.checkAchievements(stats)
    if (newIds.length > 0) {
      const newAchievements = newIds.map(id => ({
        ...ACHIEVEMENTS_LIST.find(achievement => achievement.id === id)!,
        unlocked_at: new Date().toISOString(),
      }))

      setUnlocked(prev => [...prev, ...newAchievements])
    }

    return newIds.map(id => ACHIEVEMENTS_LIST.find(a => a.id === id)!)
  }, [])

  return { unlocked, checkAndUnlock }
}
