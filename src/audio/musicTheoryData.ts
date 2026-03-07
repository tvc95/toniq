export const INTERVALS: Record<string, number> = {
  Uníssono: 0,
  "2ª menor": 1,
  "2ª maior": 2,
  "3ª menor": 3,
  "3ª maior": 4,
  "4ª justa": 5,
  "4ª aumentada": 6,
  "5ª justa": 7,
  "5ª aumentada": 8,
  "6ª menor": 8,
  "6ª maior": 9,
  "7ª menor": 10,
  "7ª maior": 11,
  Oitava: 12,
};

export const CHORDS: Record<string, number[]> = {
  Maior: [0, 4, 7],
  Menor: [0, 3, 7],
  Diminuto: [0, 3, 6],
  Aumentado: [0, 4, 8],
  "Maior com 7ª": [0, 4, 7, 11],
  "Dominante (7)": [0, 4, 7, 10],
  "Menor com 7ª": [0, 3, 7, 10],
};

export const PROGRESSIONS: Record<string, string> = {
  "I – IV – V – I": "clássica",
  "I – V – vi – IV": "pop",
  "ii – V – I": "jazz",
  "I – vi – IV – V": "anos 50",
};

export const CHROMATIC_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/**
 * Transposes a note for N semitones
 * @param note
 * @param semitones
 * @returns
 */
export function transposeNote(note: string, semitones: number): string {
  const octave = parseInt(note.slice(-1));
  const name = note.slice(0, -1);
  const index = CHROMATIC_NOTES.indexOf(name);
  const newIndex = (index + semitones) % 12;
  const newOctave = octave + Math.floor((index + semitones) / 12);
  return `${CHROMATIC_NOTES[newIndex]}${newOctave}`;
}

/**
 * Returns a random root note between C3 and G4
 * @returns
 */
export function randomRootNote(): string {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const octaves = [3, 4];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const octave = octaves[Math.floor(Math.random() * octaves.length)];
  // Limits G4 as highest note
  if (octave === 4 && ["A", "B"].includes(note)) return `${note}3`;
  return `${note}${octave}`;
}
