import * as Tone from 'tone'
import { INTERVALS, CHORDS, transposeNote } from './musicTheoryData'

// Polyphonic Synth sound
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.02,
    decay: 0.3,
    sustain: 0.4,
    release: 1.2,
  },
}).toDestination()

async function start() {
  if (Tone.getContext().state !== 'running') {
    await Tone.start()
  }
}

/**
 * Plays an interval between two notes
 * @param root
 * @param intervalName
 * @param mode 'ascending' | 'descending' | 'harmonic'
 */
export async function playInterval(
  root: string,
  intervalName: string,
  mode: 'ascending' | 'descending' | 'harmonic' = 'ascending'
) {
  await start()

  const semitones = INTERVALS[intervalName]
  const second = transposeNote(root, semitones)

  Tone.getTransport().stop()
  Tone.getTransport().cancel()

  if (mode === 'harmonic') {
    synth.triggerAttackRelease([root, second], '2n')
  } else {
    const ordered = mode === 'ascending' ? [root, second] : [second, root]

    new Tone.Part(
      (time, note) => {
        synth.triggerAttackRelease(note, '4n', time)
      },
      [
        ['0:0:0', ordered[0]],
        ['0:2:0', ordered[1]], // 2 tempos depois
      ]
    ).start(0)

    Tone.getTransport().start()
  }
}

/**
 * Plays a chord
 * @param root
 * @param chordType
 * @param mode 'block' (simultaneous) | 'arpeggio'
 */
export async function playChord(
  root: string,
  chordType: string,
  mode: 'block' | 'arpeggio' = 'block'
) {
  await start()

  const notes = CHORDS[chordType].map(n => transposeNote(root, n))

  Tone.getTransport().stop()
  Tone.getTransport().cancel()

  if (mode === 'block') {
    synth.triggerAttackRelease(notes, '2n')
  } else {
    new Tone.Part(
      (time, note) => {
        synth.triggerAttackRelease(note, '4n', time)
      },
      notes.map((note, i) => [`0:0:${i * 2}`, note])
    ).start(0)

    Tone.getTransport().start()
  }
}

/**
 * Plays a progression
 * @param chords
 * @param tempo
 */
export async function playProgression(
  chords: { rootNote: string; chordType: string }[],
  tempo: number = 80
) {
  await start()

  Tone.getTransport().stop()
  Tone.getTransport().cancel()
  Tone.getTransport().bpm.value = tempo

  chords.forEach(({ rootNote, chordType }, i) => {
    const notes = CHORDS[chordType].map(n => transposeNote(rootNote, n))

    new Tone.Part(
      (time, note) => {
        synth.triggerAttackRelease(note, '2n', time)
      },
      notes.map(note => [`${i}:0:0`, note])
    ).start(0)
  })

  Tone.getTransport().start()
}

/**
 * Stops all audio immediately
 */
export function stopAll() {
  Tone.getTransport().stop()
  Tone.getTransport().cancel()
  synth.releaseAll()
}
