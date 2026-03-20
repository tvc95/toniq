export interface StreakData {
  current: number
  best: number
  last_active: string
}

export function calculateStreak(row: StreakData, today: string): StreakData {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (row.last_active === today) {
    return row
  }

  let newCurrent: number

  if (row.last_active === yesterdayStr) {
    newCurrent = row.current + 1
  } else {
    newCurrent = 1
  }

  return {
    current: newCurrent,
    best: Math.max(newCurrent, row.best),
    last_active: today,
  }
}
