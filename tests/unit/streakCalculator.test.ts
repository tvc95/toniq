import { describe, it, expect } from 'vitest'
import { calculateStreak } from '../../src/utils/streakCalculator'

const today = '2026-03-12'
const yesterday = '2026-03-11'
const twoDaysAgo = '2026-03-10'

describe('calculateStreak', () => {
  it('maintains streak if already practiced today', () => {
    const row = { current: 3, best: 5, last_active: today }
    const result = calculateStreak(row, today)
    expect(result.current).toBe(3)
  })

  it('increments streak if practiced yesterday', () => {
    const row = { current: 3, best: 5, last_active: yesterday }
    const result = calculateStreak(row, today)
    expect(result.current).toBe(4)
    expect(result.last_active).toBe(today)
  })

  it('resets streak if missed a day', () => {
    const row = { current: 5, best: 10, last_active: twoDaysAgo }
    const result = calculateStreak(row, today)
    expect(result.current).toBe(1)
    expect(result.last_active).toBe(today)
  })

  it('updates record if surpassed', () => {
    const row = { current: 5, best: 5, last_active: yesterday }
    const result = calculateStreak(row, today)
    expect(result.best).toBe(6)
  })

  it('does not update record if not surpassed', () => {
    const row = { current: 3, best: 10, last_active: yesterday }
    const result = calculateStreak(row, today)
    expect(result.best).toBe(10)
  })

  it('initializes streak to 1 on first use', () => {
    const row = { current: 0, best: 0, last_active: '' }
    const result = calculateStreak(row, today)
    expect(result.current).toBe(1)
  })
})
