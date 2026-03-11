import { useLocation, useNavigate } from 'react-router-dom'
import type { ExerciseConfig, ExerciseResult } from '../../types/db'

interface ResultsState {
  results: ExerciseResult[]
  score: number
  config: ExerciseConfig
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { results, score, config } = location.state as ResultsState

  const correct = results.filter(r => r.isCorrect).length
  const total = results.length
  const hitRate = Math.round((correct / total) * 100)
  const avgTime = Math.round(results.reduce((acc, r) => acc + r.responseTime_ms, 0) / total / 1000)

  function medalEmoji() {
    if (hitRate >= 80) return '🥇'
    if (hitRate >= 60) return '🥈'
    return '🥉'
  }

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8 max-w-lg mx-auto">
      <header className="text-center space-y-2 pt-4">
        <p className="text-6xl">{medalEmoji()}</p>
        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
          {score} pts
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Sessão encerrada</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Acertos', value: `${correct}/${total}` },
          { label: 'Taxa', value: `${hitRate}%` },
          { label: 'Tempo médio', value: `${avgTime}s` },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center space-y-1 p-4">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Detalhes
        </h2>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className="card flex items-center justify-between p-4"
              style={{
                borderColor: r.isCorrect ? 'var(--color-secondary)' : 'var(--color-danger)',
              }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {r.question.correct}
                </p>
                {!r.isCorrect && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-danger)' }}>
                    Você respondeu: {r.userAnswer}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg">{r.isCorrect ? '✅' : '❌'}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {(r.responseTime_ms / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 pb-8">
        <button className="btn-ghost flex-1" onClick={() => navigate('/')}>
          ← Home
        </button>
        <button
          className="btn-primary flex-1"
          onClick={() => navigate('/exercise', { state: config })}
        >
          Jogar novamente
        </button>
      </div>
    </div>
  )
}
