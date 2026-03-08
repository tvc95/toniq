import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "../../types/db";

const MODE_LABEL = {
  intervals: "Intervalos",
  chords: "Acordes",
  progressions: "Progressões",
};

const MODE_COLOR = {
  intervals: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  progressions: "var(--color-warning)",
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.api
      .getHistory()
      .then((data) => setSessions(data))
      .finally(() => setLoading(false));
  }, []);

  const totalSessions = sessions.length;
  const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const avgHitRate = sessions.length
    ? Math.round(
        sessions.reduce((acc, s) => acc + (s.score / (s.total * 10)) * 100, 0) /
          sessions.length,
      )
    : 0;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDuration(ms: number) {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const rest = secs % 60;
    return mins > 0 ? `${mins}m ${rest}s` : `${rest}s`;
  }

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8 max-w-lg mx-auto">
      <header className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          Histórico
        </h1>
        <button
          className="btn-ghost px-3 py-2 text-sm"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sessões", value: totalSessions },
          { label: "Pontuação", value: totalScore },
          { label: "Taxa média", value: `${avgHitRate}%` },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center space-y-1 p-4">
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {value}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2
          className="font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Sessões anteriores
        </h2>

        {loading && (
          <p
            className="text-center py-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            Carregando...
          </p>
        )}

        {!loading && sessions.length === 0 && (
          <div className="card text-center py-12 space-y-2">
            <p className="text-4xl">🎵</p>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Nenhuma sessão ainda
            </p>
            <button className="btn-primary mt-2" onClick={() => navigate("/")}>
              Começar agora
            </button>
          </div>
        )}

        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span
                  className="badge"
                  style={{
                    background: "var(--color-bg-elevated)",
                    color:
                      MODE_COLOR[s.mode as keyof typeof MODE_COLOR] ??
                      "var(--color-primary)",
                  }}
                >
                  {MODE_LABEL[s.mode]}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {s.score} pts — {s.total} questões
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatDate(s.date)} · {formatDuration(s.duration_ms)}
                  </p>
                </div>
              </div>
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    s.score >= s.total * 7
                      ? "var(--color-secondary)"
                      : "var(--color-text-muted)",
                }}
              >
                {Math.round((s.score / (s.total * 10)) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
