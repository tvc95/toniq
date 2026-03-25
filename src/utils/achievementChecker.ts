export interface SessionStats {
  totalSessions: number
  correctTotal: number
  score: number
  total: number
  streakCurrent: number
  level: number
  maxCombo: number
  fastAnswers: number // respostas < 2s na sessão
  modesCompleted: string[] // modos com sessão completa
  modesWith80: string[] // modos com 80%+ de acertos
  recentAccuracy: number[] // taxa de acerto das últimas 5 sessões
}

/**
 * Verifies which achievements have been unlocked based on the current session stats
 * and already unlocked achievements.
 * @param stats
 * @param alreadyUnlocked
 * @returns
 */
export function checkAchievements(stats: SessionStats, alreadyUnlocked: string[]): string[] {
  const unlocked: string[] = []

  function check(id: string, condition: boolean) {
    if (condition && !alreadyUnlocked.includes(id)) {
      unlocked.push(id)
    }
  }

  const accuracy = stats.total > 0 ? stats.score / stats.total : 0

  // Progressão
  check('first_session', stats.totalSessions >= 1)
  check('sessions_10', stats.totalSessions >= 10)
  check('sessions_50', stats.totalSessions >= 50)
  check('sessions_100', stats.totalSessions >= 100)
  check('level_5', stats.level >= 5)
  check('level_10', stats.level >= 10)
  check('level_20', stats.level >= 20)
  check('level_50', stats.level >= 50)

  // Consistência
  check('streak_3', stats.streakCurrent >= 3)
  check('streak_7', stats.streakCurrent >= 7)
  check('streak_30', stats.streakCurrent >= 30)
  check('streak_100', stats.streakCurrent >= 100)

  // Desempenho
  check('perfect_session', accuracy === 1 && stats.total >= 5)
  check('session_10_hits', stats.score >= 10)
  check('total_500', stats.correctTotal >= 500)
  check('total_1000', stats.correctTotal >= 1000)
  check(
    'consistent_80',
    stats.recentAccuracy.length >= 5 && stats.recentAccuracy.every(a => a >= 0.8)
  )

  // Desafios
  check('combo_3', stats.maxCombo >= 3)
  check('combo_5', stats.maxCombo >= 5)
  check('combo_10', stats.maxCombo >= 10)
  check('fast_answer', stats.fastAnswers >= 1)
  check('fast_5', stats.fastAnswers >= 5)
  check('all_modes', stats.modesCompleted.length >= 3)
  check('all_modes_80', stats.modesWith80.length >= 3)

  return unlocked
}
