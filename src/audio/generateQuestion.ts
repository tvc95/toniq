import { INTERVALS, CHORDS, randomRootNote } from "./musicTheoryData";
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
  const pool = CHORD_POOLS[difficulty];
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = sample(
    pool.filter((c) => c !== correct),
    3,
  );
  const options = shuffle([correct, ...wrongs]);

  return {
    rootNote: randomRootNote(),
    correct,
    options,
    playMode: "block",
  };
}
