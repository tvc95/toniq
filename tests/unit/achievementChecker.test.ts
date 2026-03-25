import { describe, it, expect } from 'vitest'
import { checkAchievements, type SessionStats } from '../../src/utils/achievementChecker'

const baseStats: SessionStats = {
  totalSessions: 1,
  correctTotal: 1,
  score: 5,
  total: 10,
  streakCurrent: 1,
  level: 1,
  maxCombo: 1,
  fastAnswers: 0,
  modesCompleted: [],
  modesWith80: [],
  recentAccuracy: [],
}

describe('checkAchievements', () => {
  describe('Progression', () => {
    it('unlocks first_session at first session', () => {
      const result = checkAchievements({ ...baseStats, totalSessions: 1 }, [])
      expect(result).toContain('first_session')
    })

    it('unlocks sessions_10 at 10 completed sessions', () => {
      const result = checkAchievements({ ...baseStats, totalSessions: 10 }, [])
      expect(result).toContain('sessions_10')
    })

    it('unlocks sessions_50 at 50 completed sessions', () => {
      const result = checkAchievements({ ...baseStats, totalSessions: 50 }, [])
      expect(result).toContain('sessions_50')
    })

    it('unlocks sessions_100 at 100 completed sessions', () => {
      const result = checkAchievements({ ...baseStats, totalSessions: 100 }, [])
      expect(result).toContain('sessions_100')
    })

    it('unlocks level_5 at level 5', () => {
      const result = checkAchievements({ ...baseStats, level: 5 }, [])
      expect(result).toContain('level_5')
    })

    it('unlocks level_10 at level 10', () => {
      const result = checkAchievements({ ...baseStats, level: 10 }, [])
      expect(result).toContain('level_10')
    })

    it('unlocks level_20 at level 20', () => {
      const result = checkAchievements({ ...baseStats, level: 20 }, [])
      expect(result).toContain('level_20')
    })

    it('unlocks level_50 at level 50', () => {
      const result = checkAchievements({ ...baseStats, level: 50 }, [])
      expect(result).toContain('level_50')
    })
  })

  describe('Consistência', () => {
    it('unlocks streak_3 with 3 consecutive days', () => {
      const result = checkAchievements({ ...baseStats, streakCurrent: 3 }, [])
      expect(result).toContain('streak_3')
    })

    it('unlocks streak_7 with 7 consecutive days', () => {
      const result = checkAchievements({ ...baseStats, streakCurrent: 7 }, [])
      expect(result).toContain('streak_7')
    })

    it('unlocks streak_30 with 30 consecutive days', () => {
      const result = checkAchievements({ ...baseStats, streakCurrent: 30 }, [])
      expect(result).toContain('streak_30')
    })

    it('unlocks streak_100 with 100 consecutive days', () => {
      const result = checkAchievements({ ...baseStats, streakCurrent: 100 }, [])
      expect(result).toContain('streak_100')
    })
  })

  describe('Desempenho', () => {
    it('unlocks perfect_session with 100% accuracy', () => {
      const result = checkAchievements({ ...baseStats, score: 10, total: 10 }, [])
      expect(result).toContain('perfect_session')
    })

    it('does not unlock perfect_session with less than 5 correct answers', () => {
      const result = checkAchievements({ ...baseStats, score: 4, total: 4 }, [])
      expect(result).not.toContain('perfect_session')
    })

    it('unlocks session_10_hits with 10 correct answers', () => {
      const result = checkAchievements({ ...baseStats, score: 10 }, [])
      expect(result).toContain('session_10_hits')
    })

    it('unlocks total_500 with 500 correct answers', () => {
      const result = checkAchievements({ ...baseStats, correctTotal: 500 }, [])
      expect(result).toContain('total_500')
    })

    it('unlocks total_1000 with 1000 correct answers', () => {
      const result = checkAchievements({ ...baseStats, correctTotal: 1000 }, [])
      expect(result).toContain('total_1000')
    })

    it('unlocks consistent_80 with 80%+ in the last 5 sessions', () => {
      const result = checkAchievements(
        {
          ...baseStats,
          recentAccuracy: [0.8, 0.9, 1.0, 0.85, 0.95],
        },
        []
      )
      expect(result).toContain('consistent_80')
    })

    it('does not unlock consistent_80 with less than 5 sessions', () => {
      const result = checkAchievements(
        {
          ...baseStats,
          recentAccuracy: [0.9, 1.0],
        },
        []
      )
      expect(result).not.toContain('consistent_80')
    })
  })

  describe('Challenges', () => {
    it('unlocks combo_3 with 3 consecutive correct answers', () => {
      const result = checkAchievements({ ...baseStats, maxCombo: 3 }, [])
      expect(result).toContain('combo_3')
    })

    it('unlocks combo_5 with 5 consecutive correct answers', () => {
      const result = checkAchievements({ ...baseStats, maxCombo: 5 }, [])
      expect(result).toContain('combo_5')
    })

    it('unlocks combo_10 with 10 consecutive correct answers', () => {
      const result = checkAchievements({ ...baseStats, maxCombo: 10 }, [])
      expect(result).toContain('combo_10')
    })

    it('unlocks fast_answer with 1 fast answer', () => {
      const result = checkAchievements({ ...baseStats, fastAnswers: 1 }, [])
      expect(result).toContain('fast_answer')
    })

    it('unlocks fast_5 with 5 fast answers', () => {
      const result = checkAchievements({ ...baseStats, fastAnswers: 5 }, [])
      expect(result).toContain('fast_5')
    })

    it('unlocks all_modes with all 3 modes completed', () => {
      const result = checkAchievements(
        {
          ...baseStats,
          modesCompleted: ['intervals', 'chords', 'progressions'],
        },
        []
      )
      expect(result).toContain('all_modes')
    })

    it('unlocks all_modes_80 with all 3 modes with 80%+', () => {
      const result = checkAchievements(
        {
          ...baseStats,
          modesWith80: ['intervals', 'chords', 'progressions'],
        },
        []
      )
      expect(result).toContain('all_modes_80')
    })
  })

  describe('General behavior', () => {
    it('does not unlock achievements already unlocked', () => {
      const result = checkAchievements({ ...baseStats, totalSessions: 1 }, ['first_session'])
      expect(result).not.toContain('first_session')
    })

    it('can unlock multiple achievements at the same time', () => {
      const result = checkAchievements(
        {
          ...baseStats,
          totalSessions: 10,
          level: 5,
          streakCurrent: 3,
        },
        []
      )
      expect(result).toContain('first_session')
      expect(result).toContain('sessions_10')
      expect(result).toContain('level_5')
      expect(result).toContain('streak_3')
    })

    it('returns empty array if no condition is met', () => {
      const result = checkAchievements(baseStats, ['first_session'])
      expect(result).toHaveLength(0)
    })
  })
})
