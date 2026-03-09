import type { Difficulty, ExerciseResult } from "../types/db";

// CONSTANTS
const WINDOW = 5;
const UP_THRESH = 0.8;
const DOWN_THRESH = 0.4;

/**
 * Monitors rate of correct answers from the last 5 questions. If rate >= 80%,
 * increase difficulty. If rate < 40%, decrease difficulty.
 * @param results
 * @param current
 * @returns new difficulty (beginner, intermediate or advanced)
 */
export function evaluateDifficulty(
  results: ExerciseResult[],
  current: Difficulty,
): Difficulty {
  if (results.length < WINDOW) return current;

  const last = results.slice(-WINDOW);
  const hitRate = last.filter((r) => r.isCorrect).length / WINDOW;

  if (hitRate >= UP_THRESH) {
    if (current === "beginner") return "intermediate";
    if (current === "intermediate") return "advanced";
  }

  if (hitRate <= DOWN_THRESH) {
    if (current === "advanced") return "intermediate";
    if (current === "intermediate") return "beginner";
  }

  return current;
}
