import { useState, useEffect } from 'react'
import type { Achievement } from '../../utils/achievements'

interface AchievementToastProps {
  achievements: Achievement[]
  onDone: () => void
}

export function AchievementToast({ achievements, onDone }: AchievementToastProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (achievements.length === 0) return

    const timer = setTimeout(() => {
      if (index < achievements.length - 1) {
        setIndex(i => i + 1)
      } else {
        setVisible(false)
        onDone()
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [index, achievements, onDone])

  if (!visible || achievements.length === 0) return null

  const current = achievements[index]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-primary)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 24px rgba(108, 99, 255, 0.3)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease',
      }}
    >
      <span style={{ fontSize: 32 }}>{current.icon}</span>
      <div>
        <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>
          CONQUISTA DESBLOQUEADA
        </div>
        <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{current.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{current.description}</div>
      </div>
    </div>
  )
}
