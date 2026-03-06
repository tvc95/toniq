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
