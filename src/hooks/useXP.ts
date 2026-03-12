import { useState, useCallback, useEffect } from 'react'
import { xpForNextLevel } from '../utils/xpCalculator'

interface XPState {
  totalXP: number
  level: number
  isLeveledUp: boolean
}

/**
 * Hook to manage user experience points (XP) and leveling system.
 * Provides current XP, level, and a function to add XP while checking for level ups.
 * Also calculates progress towards the next level.
 * @returns current XP state and functions to manipulate it.
 */
export function useXP() {
  const [xp, setXp] = useState<XPState>({
    totalXP: 0,
    level: 1,
    isLeveledUp: false,
  })

  useEffect(() => {
    // Fetch initial XP and level from the database when the component mounts
    window.api.getXP().then(data => {
      setXp({
        totalXP: data.total_xp,
        level: data.level,
        isLeveledUp: false,
      })
    })
  }, [])

  /**
   * Adds XP to the user's total and checks for level up.
   * Returns the updated XP data.
   * @param amount - the amount of XP to add
   * @returns updated XP and level information
   */
  const addXP = useCallback(async (amount: number) => {
    const result = await window.api.addXP(amount)
    setXp({
      totalXP: result.total_xp,
      level: result.level,
      isLeveledUp: result.leveled_up,
    })
    return result
  }, [])

  /**
   * Calculates the percentage progress towards the next level based on current XP.
   * @returns percentage of XP progress towards the next level (0-100%).
   */
  const progressPercent = () => {
    const currentLevelXP = xpForNextLevel(xp.level - 1)
    const nextLevelXP = xpForNextLevel(xp.level)
    const xpIntoCurrentLevel = xp.totalXP - currentLevelXP
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP

    return Math.min(100, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100)
  }

  return {
    ...xp,
    addXP,
    progressPercent,
  }
}
