import { useNavigate } from "react-router-dom";
import type { ExerciseConfig } from "../../types/db";
import logo from "../../assets/toniq-logo.png";

const MODES = [
  {
    mode: "intervals" as const,
    title: "Intervalos",
    description: "Identifique a distância entre duas notas",
    icon: "🎵",
    color: "var(--color-primary)",
  },
  {
    mode: "chords" as const,
    title: "Acordes",
    description: "Reconheça tríades e tétrades",
    icon: "🎹",
    color: "var(--color-secondary)",
  },
  {
    mode: "progressions" as const,
    title: "Progressões",
    description: "Identifique sequências harmônicas",
    icon: "🎸",
    color: "var(--color-warning)",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  function handleStart(mode: ExerciseConfig["mode"]) {
    navigate("/exercise", {
      state: {
        mode,
        difficulty: "beginner",
        totalQuestions: 10,
      } satisfies ExerciseConfig,
    });
  }

  return (
    <div className="min-h-screen space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <div>
            <img src={logo} alt="TonIQ logo" className="w-32 h-auto" />
          </div>
          <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Treine seu ouvido musical
          </p>
        </div>

        <button className="btn-ghost" onClick={() => navigate("/history")}>
          📊 Histórico
        </button>
      </header>

      <section className="space-y-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Escolha um modo
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {MODES.map(({ mode, title, description, icon, color }) => (
            <button
              key={mode}
              onClick={() => handleStart(mode)}
              className="card text-left flex items-center gap-5 hover:brightness-125 transition-all duration-150 cursor-pointer"
            >
              <span className="text-4xl">{icon}</span>
              <div className="flex-1">
                <p className="text-lg font-semibold" style={{ color }}>
                  {title}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {description}
                </p>
              </div>
              <span style={{ color: "var(--color-text-muted)" }}>→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
