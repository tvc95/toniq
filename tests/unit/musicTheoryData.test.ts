import { describe, it, expect } from 'vitest'
import {
  transposeNote,
  randomRootNote,
  INTERVALS,
  CHORDS,
  CHROMATIC_NOTES,
} from '../../src/audio/musicTheoryData'

/**
 * Unit tests for transposeNote function validation
 */
describe('transposeNote', () => {
  it('does not transpose with 0 semitones', () => {
    expect(transposeNote('C4', 0)).toBe('C4')
  })

  it('transposes 1 semitone up', () => {
    expect(transposeNote('C4', 1)).toBe('C#4')
  })

  it('transposes 1 octave up', () => {
    expect(transposeNote('C4', 12)).toBe('C5')
  })

  it('transposes correctly when changing octaves', () => {
    expect(transposeNote('B3', 1)).toBe('C4')
  })

  it('transposes a 5th up', () => {
    expect(transposeNote('C4', INTERVALS['5ª justa'])).toBe('G4')
  })

  it('transposes a 3rd up', () => {
    expect(transposeNote('C4', INTERVALS['3ª maior'])).toBe('E4')
  })

  it('transposes 1 semitone down correctly when changing octaves', () => {
    expect(transposeNote('C4', -1)).toBe('B3')
  })

  it('transposes 1 octave down', () => {
    expect(transposeNote('C5', -12)).toBe('C4')
  })

  it('transposes a 3rd down', () => {
    expect(transposeNote('E4', -INTERVALS['3ª maior'])).toBe('C4')
  })
})

/**
 * Unit tests for randomRootNote function validation
 */
describe('randomRootNote', () => {
  it('returns a note in the correct format', () => {
    const note = randomRootNote()
    expect(note).toMatch(/^[A-G]#?[34]$/)
  })

  it('returns notes between interval C3-G4', () => {
    for (let i = 0; i < 50; i++) {
      const note = randomRootNote()
      const name = note.slice(0, -1)
      const octave = parseInt(note.slice(-1))
      expect(CHROMATIC_NOTES).toContain(name.replace('#', '#'))
      expect(octave).toBeGreaterThanOrEqual(3)
      expect(octave).toBeLessThanOrEqual(4)
    }
  })
})

/**
 * Unit tests for intervals
 */
describe('INTERVALS', () => {
  it('Unison has 0 semitones', () => {
    expect(INTERVALS['Uníssono']).toBe(0)
  })

  it('Octaves has 12 semitones', () => {
    expect(INTERVALS['Oitava']).toBe(12)
  })

  it('5th has 7 semitones', () => {
    expect(INTERVALS['5ª justa']).toBe(7)
  })
})

/**
 * Unit tests for chords
 */
describe('CHORDS', () => {
  it('Major chord has [0, 4, 7] form', () => {
    expect(CHORDS['Maior']).toEqual([0, 4, 7])
  })

  it('Minor chord has [0, 3, 7] form', () => {
    expect(CHORDS['Menor']).toEqual([0, 3, 7])
  })

  it('Diminute chord has [0, 3, 6] form', () => {
    expect(CHORDS['Diminuto']).toEqual([0, 3, 6])
  })
})
