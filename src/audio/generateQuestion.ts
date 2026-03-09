import {
  INTERVALS,
  CHORDS,
  randomRootNote,
  transposeNote,
} from "./musicTheoryData";
import type { Question, ExerciseConfig } from "../types/db";

const INTERVAL_POOLS = {
  beginner: ["2ª maior", "3ª maior", "4ª justa", "5ª justa", "Oitava"],
  intermediate: [
    "2ª menor",
    "2ª maior",
    "3ª menor",
    "3ª maior",
    "4ª justa",
    "5ª justa",
    "6ª maior",
    "Oitava",
  ],
  advanced: Object.keys(INTERVALS).filter((i) => i !== "Uníssono"),
};

const CHORD_POOLS = {
  beginner: ["Maior", "Menor"],
  intermediate: ["Maior", "Menor", "Diminuto", "Aumentado"],
  advanced: Object.keys(CHORDS),
};

const PROGRESSION_POOLS = {
  beginner: [
    {
      name: "I – IV – V – I",
      degrees: ["I", "IV", "V", "I"],
      chords: ["Maior", "Maior", "Maior", "Maior"],
    },
    {
      name: "I – V – I",
      degrees: ["I", "V", "I"],
      chords: ["Maior", "Maior", "Maior"],
    },
  ],
  intermediate: [
    {
      name: "I – IV – V – I",
      degrees: ["I", "IV", "V", "I"],
      chords: ["Maior", "Maior", "Maior", "Maior"],
    },
    {
      name: "I – V – vi – IV",
      degrees: ["I", "V", "VI", "IV"],
      chords: ["Maior", "Maior", "Menor", "Maior"],
    },
    {
      name: "I – vi – IV – V",
      degrees: ["I", "VI", "IV", "V"],
      chords: ["Maior", "Menor", "Maior", "Maior"],
    },
  ],
  advanced: [
    {
      name: "I – V – vi – IV",
      degrees: ["I", "V", "VI", "IV"],
      chords: ["Maior", "Maior", "Menor", "Maior"],
    },
    {
      name: "ii – V – I",
      degrees: ["II", "V", "I"],
      chords: ["Menor", "Dominante (7)", "Maior"],
    },
    {
      name: "I – vi – ii – V",
      degrees: ["I", "VI", "II", "V"],
      chords: ["Maior", "Menor", "Menor", "Dominante (7)"],
    },
  ],
};

const DEGREE_SEMITONES: Record<string, number> = {
  I: 0,
  II: 2,
  III: 4,
  IV: 5,
  V: 7,
  VI: 9,
  VII: 11,
};

/**
 * Helper function to shuffle the elements of an array
 * @param array
 * @returns a shuffled array
 */
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Helper function that samples 'n' elements of an array
 * @param array - the array to be sampled
 * @param n - quantity of elements to be returned
 * @returns n random elements of an array
 */
function sample<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

export function generateQuestion(config: ExerciseConfig): Question {
  const { mode, difficulty } = config;

  if (mode === "intervals") {
    const pool = INTERVAL_POOLS[difficulty];
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = sample(
      pool.filter((i) => i !== correct),
      3,
    );
    const options = shuffle([correct, ...wrongs]);
    const playMode = sample(
      ["ascending", "descending", "harmonic"] as const,
      1,
    )[0];

    return {
      rootNote: randomRootNote(),
      correct,
      options,
      playMode,
    };
  }

  if (mode === "chords") {
    const pool = CHORD_POOLS[difficulty];
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = sample(
      pool.filter((i) => i !== correct),
      3,
    );
    const options = shuffle([correct, ...wrongs]);
    const playMode = sample(["block", "arpeggio"] as const, 1)[0];

    return {
      rootNote: randomRootNote(),
      correct,
      options,
      playMode,
    };
  }

  // [TEMPORARY]: FOR PROGRESSIONS (THIS CODE WILL BE DELETED IN A FUTURE VERSION)
  const pool = PROGRESSION_POOLS[difficulty];
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = sample(
    pool.filter((p) => p.name !== correct.name),
    3,
  );
  const options = shuffle([correct, ...wrongs]).map((p) => p.name);

  const root = randomRootNote();

  // Monta os acordes da progressão com notas reais
  const progression = correct.chords.map((chordType, i) => ({
    rootNote: transposeNote(root, DEGREE_SEMITONES[correct.degrees[i]]),
    chordType,
  }));

  return {
    rootNote: root,
    correct: correct.name,
    options,
    playMode: "block",
    progression,
  };
}
