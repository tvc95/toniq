import { describe, it, expect } from 'vitest'
import { evaluateDifficulty } from '../../src/audio/adaptiveDifficulty'
import type { ExerciseResult } from '../../src/types/db'

function makeResults(correct: boolean[]): ExerciseResult[] {
  return correct.map(isCorrect => ({
    question: {
      rootNote: 'C4',
      correct: 'Maior',
      options: [],
      playMode: 'block',
    },
    userAnswer: isCorrect ? 'Maior' : 'Menor',
    isCorrect,
    responseTime_ms: 1000,
  }))
}

describe('evaluateDifficulty', () => {
  it('maintains difficulty if less than 5 answers', () => {
    const results = makeResults([true, true, true])
    expect(evaluateDifficulty(results, 'beginner')).toBe('beginner')
  })

  it('levels up to intermediate with 80%+ of right answers', () => {
    const results = makeResults([true, true, true, true, true])
    expect(evaluateDifficulty(results, 'beginner')).toBe('intermediate')
  })

  it('levels up to advanced with 80%+ of right answers', () => {
    const results = makeResults([true, true, true, true, true])
    expect(evaluateDifficulty(results, 'intermediate')).toBe('advanced')
  })

  it('maintains advanced as max level', () => {
    const results = makeResults([true, true, true, true, true])
    expect(evaluateDifficulty(results, 'advanced')).toBe('advanced')
  })

  it('levels down to beginner with less than 40% of right answers', () => {
    const results = makeResults([false, false, false, false, false])
    expect(evaluateDifficulty(results, 'intermediate')).toBe('beginner')
  })

  it('maintains difficulty if percentage of right answers is between 40 and 80%', () => {
    const results = makeResults([true, true, false, true, false])
    expect(evaluateDifficulty(results, 'beginner')).toBe('beginner')
  })
})
