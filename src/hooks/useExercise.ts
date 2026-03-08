import { useState, useRef, useCallback } from "react";
import { generateQuestion } from "../audio/generateQuestion";
import { playInterval, playChord } from "../audio/AudioEngine";
import type { ExerciseConfig, ExerciseResult, Question } from "../types/db";

interface ExerciseState {
  status: "idle" | "playing" | "answered" | "finished";
  current: Question | null;
  questionIndex: number;
  results: ExerciseResult[];
  score: number;
}

export function useExercise(config: ExerciseConfig) {
  const [state, setState] = useState<ExerciseState>({
    status: "idle",
    current: null,
    questionIndex: 0,
    results: [],
    score: 0,
  });

  const startedAt = useRef<number>(0);

  const playCurrentQuestion = useCallback(
    async (question: Question) => {
      if (config.mode === "intervals") {
        await playInterval(
          question.rootNote,
          question.correct,
          question.playMode as "ascending" | "descending" | "harmonic",
        );
      } else {
        await playChord(
          question.rootNote,
          question.correct,
          question.playMode as "block" | "arpeggio",
        );
      }
    },
    [config.mode],
  );

  const startSession = useCallback(async () => {
    const question = generateQuestion(config);
    startedAt.current = Date.now();

    setState({
      status: "playing",
      current: question,
      questionIndex: 0,
      results: [],
      score: 0,
    });

    await playCurrentQuestion(question);
  }, [config, playCurrentQuestion]);

  // Reproduz a questão atual novamente
  const replay = useCallback(async () => {
    if (state.current) await playCurrentQuestion(state.current);
  }, [state.current, playCurrentQuestion]);

  // Responde a questão atual
  const answer = useCallback(
    (userAnswer: string) => {
      if (!state.current || state.status !== "playing") return;

      const isCorrect = userAnswer === state.current.correct;
      const responseTime = Date.now() - startedAt.current;
      const points = isCorrect ? 10 : -3;

      const result: ExerciseResult = {
        question: state.current,
        userAnswer,
        isCorrect,
        responseTime_ms: responseTime,
      };

      const newResults = [...state.results, result];
      const newScore = Math.max(0, state.score + points);
      const isLast = state.questionIndex + 1 >= config.totalQuestions;

      if (isLast) {
        stop();
        setState((s) => ({
          ...s,
          status: "finished",
          results: newResults,
          score: newScore,
        }));
        return;
      }

      setState((s) => ({
        ...s,
        status: "answered",
        results: newResults,
        score: newScore,
        current: { ...s.current!, _feedback: isCorrect } as any,
      }));

      // Avança para próxima questão após 1.5s
      setTimeout(async () => {
        const next = generateQuestion(config);
        startedAt.current = Date.now();
        setState((s) => ({
          ...s,
          status: "playing",
          current: next,
          questionIndex: s.questionIndex + 1,
        }));
        await playCurrentQuestion(next);
      }, 1500);
    },
    [state, config, playCurrentQuestion],
  );

  return {
    ...state,
    startSession,
    replay,
    answer,
  };
}
