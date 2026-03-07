export interface Session {
  date: string;
  mode: "intervals" | "chords" | "progressions";
  score: number;
  total: number;
  duration_ms: number;
}

export interface Answer {
  question: string;
  correct_answer: string;
  user_answer: string;
  response_time_ms: number;
}

export interface SaveSessionData {
  session: Session;
  answers: Answer[];
}

export type SettingKey = "theme" | "bpm" | "instrument" | "difficulty";
export type ExerciseMode = "intervals" | "chords" | "progressions";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ExerciseConfig {
  mode: ExerciseMode;
  difficulty: Difficulty;
  totalQuestions: number;
}

export interface Question {
  rootNote: string;
  correct: string;
  options: string[];
  playMode: "ascending" | "descending" | "harmonic" | "block" | "arpeggio";
}

export interface ExerciseResult {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  responseTime_ms: number;
}
