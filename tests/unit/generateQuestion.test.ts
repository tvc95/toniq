import { describe, it, expect } from 'vitest'
import { generateQuestion } from '../../src/audio/generateQuestion'
import type { ExerciseConfig } from '../../src/types/db'

const baseConfig: ExerciseConfig = {
  mode: 'intervals',
  difficulty: 'beginner',
  totalQuestions: 10,
}

/**
 * Unit tests for intervals questions
 */
describe('generateQuestion_intervals', () => {
  it('returns a question with 4 options', () => {
    const question = generateQuestion(baseConfig)
    expect(question.options).toHaveLength(4)
  })

  it('correct answer is among the options', () => {
    const question = generateQuestion(baseConfig)
    expect(question.options).toContain(question.correct)
  })

  it('no duplicate options', () => {
    const question = generateQuestion(baseConfig)
    expect(new Set(question.options).size).toBe(4)
  })

  it('returns a valid play mode', () => {
    const question = generateQuestion(baseConfig)
    expect(['ascending', 'descending', 'harmonic']).toContain(question.playMode)
  })
})

/**
 * Unit tests for chords questions
 */
describe('generateQuestion_chords', () => {
  const config: ExerciseConfig = { ...baseConfig, mode: 'chords' }

  it('returns a question with 2 options for beginner mode', () => {
    const question = generateQuestion(config)
    expect(question.options).toHaveLength(2)
  })

  it('returns a question with 4 options for intermediate/advanced mode', () => {
    const question = generateQuestion({
      ...config,
      difficulty: 'intermediate',
    })
    expect(question.options).toHaveLength(4)
  })

  it('no duplicate options', () => {
    const question = generateQuestion({ ...config, difficulty: 'advanced' })
    expect(new Set(question.options).size).toBe(4)
  })

  it('correct answer is among the options', () => {
    const question = generateQuestion(config)
    expect(question.options).toContain(question.correct)
  })

  it('returns a valid play mode', () => {
    const question = generateQuestion(config)
    expect(['block', 'arpeggio']).toContain(question.playMode)
  })
})

/**
 * Unit tests for progressions questions
 */
describe('generateQuestions_progressions', () => {
  const config: ExerciseConfig = { ...baseConfig, mode: 'progressions' }

  it('returns a progression with chords', () => {
    const q = generateQuestion(config)
    expect(q.progression).toBeDefined()
    expect(q.progression!.length).toBeGreaterThan(0)
  })

  it('each chord from the prograssion has a root note and chord type', () => {
    const q = generateQuestion(config)
    q.progression!.forEach(chord => {
      expect(chord.rootNote).toBeDefined()
      expect(chord.chordType).toBeDefined()
    })
  })
})
