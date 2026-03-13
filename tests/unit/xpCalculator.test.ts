import { describe, it, expect } from 'vitest'
import { calculateXp, xpForLevel } from '../../src/utils/xpCalculator'

describe('calculateXP', () => {
  it('returns 0 for wrong answer', () => {
    expect(calculateXp(false, 'beginner', 2, 1)).toBe(0)
  })

  it('applies difficulty multiplier correctly', () => {
    const beginner = calculateXp(true, 'beginner', 5, 1)
    const intermediate = calculateXp(true, 'intermediate', 5, 1)
    const advanced = calculateXp(true, 'advanced', 5, 1)

    expect(intermediate).toBeGreaterThan(beginner)
    expect(advanced).toBeGreaterThan(intermediate)
  })

  it('applies time bonus multiplier correctly', () => {
    const fast = calculateXp(true, 'beginner', 2, 1)
    const medium = calculateXp(true, 'beginner', 4, 1)
    const slow = calculateXp(true, 'beginner', 8, 1)
    const verySlow = calculateXp(true, 'beginner', 14, 1)

    expect(fast).toBeGreaterThan(medium)
    expect(medium).toBeGreaterThan(slow)
    expect(slow).toBeGreaterThan(verySlow)
  })

  it('applies combo multiplier correctly', () => {
    const noCombo = calculateXp(true, 'beginner', 2, 1)
    const small = calculateXp(true, 'beginner', 2, 3)
    const medium = calculateXp(true, 'beginner', 2, 6)
    const big = calculateXp(true, 'beginner', 2, 10)

    expect(big).toBeGreaterThan(medium)
    expect(medium).toBeGreaterThan(small)
    expect(small).toBeGreaterThan(noCombo)
  })

  it('returns rounded value', () => {
    const xp = calculateXp(true, 'advanced', 3, 1)
    expect(Number.isInteger(xp)).toBe(true)
  })

  it('max XP with highest difficulty + fast answer + high streak', () => {
    const maxXP = calculateXp(true, 'advanced', 1, 10)
    const minXP = calculateXp(true, 'beginner', 15, 1)

    expect(maxXP).toBeGreaterThan(minXP)
  })
})

describe('xpForLevel', () => {
  it('returns rounded value', () => {
    const xpForLv = xpForLevel(5)
    expect(Number.isInteger(xpForLv)).toBe(true)
  })

  it('level 1 requires 100 XP', () => {
    const xpForLv = xpForLevel(1)
    expect(xpForLv).toBe(100)
  })

  it('xp curve grows exponentially', () => {
    const diff1 = xpForLevel(2) - xpForLevel(1)
    const diff2 = xpForLevel(3) - xpForLevel(2)
    const diff3 = xpForLevel(5) - xpForLevel(4)

    expect(diff2).toBeGreaterThan(diff1)
    expect(diff3).toBeGreaterThan(diff2)
  })
})
