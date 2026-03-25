export type AchievementCategory = 'progression' | 'consistency' | 'performance' | 'challenge'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // Progression
  {
    id: 'first_session',
    name: 'Primeira Nota',
    description: 'Complete sua primeira sessão',
    icon: '🎵',
    category: 'progression',
  },
  {
    id: 'sessions_10',
    name: 'Aquecendo',
    description: 'Complete 10 sessões',
    icon: '🔥',
    category: 'progression',
  },
  {
    id: 'sessions_50',
    name: 'Músico Dedicado',
    description: 'Complete 50 sessões',
    icon: '🎓',
    category: 'progression',
  },
  {
    id: 'sessions_100',
    name: 'Veterano',
    description: 'Complete 100 sessões',
    icon: '🏅',
    category: 'progression',
  },
  {
    id: 'level_5',
    name: 'Iniciante',
    description: 'Atinja o nível 5',
    icon: '⭐',
    category: 'progression',
  },
  {
    id: 'level_10',
    name: 'Intermediário',
    description: 'Atinja o nível 10',
    icon: '🌟',
    category: 'progression',
  },
  {
    id: 'level_20',
    name: 'Avançado',
    description: 'Atinja o nível 20',
    icon: '💫',
    category: 'progression',
  },
  {
    id: 'level_50',
    name: 'Mestre',
    description: 'Atinja o nível 50',
    icon: '👑',
    category: 'progression',
  },

  // Consistency
  {
    id: 'streak_3',
    name: 'Primeiros Passos',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '📅',
    category: 'consistency',
  },
  {
    id: 'streak_7',
    name: 'Semana Perfeita',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '📆',
    category: 'consistency',
  },
  {
    id: 'streak_30',
    name: 'Mês Dedicado',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🗓️',
    category: 'consistency',
  },
  {
    id: 'streak_100',
    name: 'Inabalável',
    description: 'Mantenha uma sequência de 100 dias',
    icon: '💎',
    category: 'consistency',
  },

  // Performance
  {
    id: 'perfect_session',
    name: 'Perfeição',
    description: '100% de acertos em uma sessão',
    icon: '✨',
    category: 'performance',
  },
  {
    id: 'session_10_hits',
    name: 'Ouvido Afinado',
    description: 'Acerte 10 questões em uma sessão',
    icon: '👂',
    category: 'performance',
  },
  {
    id: 'consistent_80',
    name: 'Consistente',
    description: '80%+ de acertos em 5 sessões seguidas',
    icon: '📈',
    category: 'performance',
  },
  {
    id: 'total_500',
    name: 'Acumulador',
    description: 'Acerte 500 questões no total',
    icon: '🎯',
    category: 'performance',
  },
  {
    id: 'total_1000',
    name: 'Milhar',
    description: 'Acerte 1000 questões no total',
    icon: '🏆',
    category: 'performance',
  },

  // Challenges
  {
    id: 'combo_3',
    name: 'Combo x3',
    description: 'Acerte 3 questões seguidas em uma sessão',
    icon: '⚡',
    category: 'challenge',
  },
  {
    id: 'combo_5',
    name: 'Combo x5',
    description: 'Acerte 5 questões seguidas em uma sessão',
    icon: '🌪️',
    category: 'challenge',
  },
  {
    id: 'combo_10',
    name: 'Combo x10',
    description: 'Acerte 10 questões seguidas em uma sessão',
    icon: '💥',
    category: 'challenge',
  },
  {
    id: 'fast_answer',
    name: 'Relâmpago',
    description: 'Responda em menos de 2 segundos',
    icon: '⚡',
    category: 'challenge',
  },
  {
    id: 'fast_5',
    name: 'Flash',
    description: '5 respostas em menos de 2s em uma sessão',
    icon: '🚀',
    category: 'challenge',
  },
  {
    id: 'all_modes',
    name: 'Explorador',
    description: 'Complete uma sessão nos 3 modos',
    icon: '🗺️',
    category: 'challenge',
  },
  {
    id: 'all_modes_80',
    name: 'Completo',
    description: 'Complete os 3 modos com 80%+ de acertos',
    icon: '🎖️',
    category: 'challenge',
  },
]
