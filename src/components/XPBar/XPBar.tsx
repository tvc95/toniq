import { xpForNextLevel } from '../../utils/xpCalculator'

interface XPBarProps {
  totalXp: number
  currentLevel: number
}

export function XPBar({ totalXp, currentLevel }: XPBarProps) {
  const current = xpForNextLevel(currentLevel - 1)
  const next = xpForNextLevel(currentLevel)
  const percent = Math.round(((totalXp - current) / (next - current)) * 100)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Nível {currentLevel}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          {totalXp} / {next} XP
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
