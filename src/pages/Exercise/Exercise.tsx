import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExercise } from "../../hooks/useExercise";
import { Waveform } from "../../components/Waveform/Waveform";
import type { ExerciseConfig } from "../../types/db";
import { stopAll } from "../../audio/AudioEngine";

export default function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state as ExerciseConfig;
  const started = useRef(false);

  const exercise = useExercise(config);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
  }, [])

  useEffect(() => {
    return () => setIsPlaying(false);
  }, [])

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    exercise.startSession();
  }, []);

  useEffect(() => {
    if (exercise.status === "finished") {
      navigate("/results", {
        state: {
          results: exercise.results,
          score: exercise.score,
          config,
        },
      });
    }
  }, [exercise.status]);

  async function handleReplay() {
    stopAll();
    await exercise.replay();
  }

  if (!exercise.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-text-secondary)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8 max-w-lg mx-auto">
      <header className="flex items-center justify-between">
        <button
          className="btn-ghost px-3 py-2 text-sm"
          onClick={() => {
            stopAll();
            navigate("/");
          }}
        >
          ← Sair
        </button>

        <div className="flex items-center gap-4">
          <span
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {exercise.questionIndex + 1} / {config.totalQuestions}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {exercise.score} pts
          </span>
        </div>
      </header>

      <div
        className="w-full h-1.5 rounded-full"
        style={{ background: "var(--color-border)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${(exercise.questionIndex / config.totalQuestions) * 100}%`,
            background: "var(--color-primary)",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-3 py-6">
        <button
          onClick={handleReplay}
          disabled={exercise.status === "answered"}
          className="w-24 h-24 rounded-full text-4xl font-bold transition-all duration-150 active:scale-95 disabled:opacity-40"
          style={{
            background: "var(--color-bg-elevated)",
            border: "2px solid var(--color-primary)",
            boxShadow: "var(--shadow-glow-primary)",
            color: "var(--color-primary)",
          }}
        >
          🔊
        </button>
        <Waveform isPlaying={isPlaying} />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {exercise.status === "answered"
            ? "Aguarde..."
            : "Toque para ouvir novamente"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {exercise.current.options.map((opt) => {
          const isAnswered = exercise.status === "answered";
          const isCorrect = opt === exercise.current!.correct;
          const lastResult = exercise.results[exercise.results.length - 1];
          const isChosen = lastResult?.userAnswer === opt;

          let borderColor = "var(--color-border)";
          let textColor = "var(--color-text-primary)";
          let bgColor = "var(--color-bg-surface)";

          if (isAnswered) {
            if (isCorrect) {
              borderColor = "var(--color-secondary)";
              textColor = "var(--color-secondary)";
              bgColor = "rgba(46, 196, 182, 0.08)";
            } else if (isChosen) {
              borderColor = "var(--color-danger)";
              textColor = "var(--color-danger)";
              bgColor = "rgba(232, 72, 85, 0.08)";
            }
          }

          return (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => exercise.answer(opt)}
              className="py-4 px-3 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-95 disabled:cursor-default"
              style={{
                border: `1px solid ${borderColor}`,
                color: textColor,
                backgroundColor: bgColor,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p
        className="text-center text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        Dificuldade: {exercise.difficulty}
      </p>
    </div>
  );
}
