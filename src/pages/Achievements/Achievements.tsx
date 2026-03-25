import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../../hooks/useAchievements'
import { ACHIEVEMENTS_LIST, type AchievementCategory } from '../../utils/achievements'

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  progression: 'Progressão',
  consistency: 'Consistência',
  performance: 'Desempenho',
  challenge: 'Desafios',
}

export default function AchievementsPage() {
  const navigate = useNavigate()
  const { unlocked } = useAchievements()
  const unlockedIds = unlocked.map(a => a.id)

  const categories: AchievementCategory[] = [
    'progression',
    'consistency',
    'performance',
    'challenge',
  ]

  return (
    <div className="min-h-screen space-y-8">
      <header className="flex items-center gap-4">
        <button className="btn-ghost" onClick={() => navigate('/')}>
          ← Voltar
        </button>
        <h1 className="text-xl font-bold">Conquistas</h1>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          {unlocked.length} / {ACHIEVEMENTS_LIST.length}
        </span>
      </header>

      {categories.map(category => (
        <section key={category} className="space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            {CATEGORY_LABELS[category]}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {ACHIEVEMENTS_LIST.filter(a => a.category === category).map(achievement => {
              const isUnlocked = unlockedIds.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className="card flex items-center gap-4"
                  style={{
                    opacity: isUnlocked ? 1 : 0.4,
                    filter: isUnlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {achievement.description}
                    </p>
                  </div>
                  {isUnlocked && (
                    <span style={{ color: 'var(--color-secondary)', fontSize: 18 }}>✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
