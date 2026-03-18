interface StreakBadgeProps {
  current: number
  best: number
  practicedToday: boolean
}

export function StreakBadge({ current, best, practicedToday }: StreakBadgeProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 16px',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24 }}>{practicedToday ? '🔥' : '💤'}</div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: practicedToday ? 'var(--color-warning)' : 'var(--color-text-muted)',
          }}
        >
          {current}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>sequência</div>
      </div>

      <div
        style={{
          width: 1,
          height: 40,
          background: 'var(--color-border)',
        }}
      />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24 }}>🏆</div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-secondary)',
          }}
        >
          {best}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>recorde</div>
      </div>
    </div>
  )
}
