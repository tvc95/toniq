interface XPBarProps {
  currentLevel: number
  totalXp: number
}

export function XPBar({ currentLevel, totalXp }: XPBarProps) {
  const current = Math.floor(100 * Math.pow(currentLevel - 1, 1.8))  // XP para entrar no nível atual
  const next = Math.floor(100 * Math.pow(currentLevel, 1.8))

  const xpIntoLevel = totalXp - current
  const xpNeeded = next - current
  const percent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100))

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Nível {currentLevel}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          {xpIntoLevel} / {xpNeeded} XP
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            borderRadius: 4,
            background: 'var(--color-primary)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}
