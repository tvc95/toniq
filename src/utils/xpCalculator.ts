import { Difficulty } from '../types/db'

const BASE_XP = 10

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
}

function timeBonus(seconds: number): number {
  if (seconds < 3) return 1.5
  if (seconds < 5) return 1.2
  if (seconds < 10) return 1.0
  return 0.75
}

function comboMultiplier(combo: number): number {
  if (combo >= 8) return 2.0
  if (combo >= 5) return 1.5
  if (combo >= 3) return 1.2
  return 1.0
}

/**
 * Calculates XP based on correctness, difficulty, response time and streak combo.
 * @param correct - whether the answer was correct or not.
 * @param difficulty - current question difficulty level.
 * @param responseTimeSeconds - time taken to answer the question (in seconds).
 * @param currentCombo - number of consecutive correct answers before this question.
 * @returns - total XP earned for the question.
 */
export function calculateXp(
  correct: boolean,
  difficulty: Difficulty,
  responseTimeSeconds: number,
  currentCombo: number
): number {
  if (!correct) return 0

  const xp =
    BASE_XP *
    DIFFICULTY_MULTIPLIER[difficulty] *
    timeBonus(responseTimeSeconds) *
    comboMultiplier(currentCombo)

  return Math.round(xp)
}

/**
 * Calculates the total XP required to reach a certain level.
 * @param level - target level to calculate XP for.
 * @returns total XP required to reach the specified level.
 */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.8))
}

/**
 * Calculates the XP required to reach the next level from the current level.
 * @param currentLevel - current player level.
 * @returns XP needed to reach the next level.
 */
export function xpForNextLevel(currentLevel: number): number {
  return xpForLevel(currentLevel + 1) - xpForLevel(currentLevel)
}
