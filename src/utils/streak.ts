import dayjs from 'dayjs'
import type { ContributionDay } from '@/types/entry'

export interface StreakResult {
  current: number
  longest: number
}

/**
 * Calculates current and longest streak from contribution days.
 * A "clean day" has count > 0.
 */
export const calculateStreaks = (contributions: ContributionDay[]): StreakResult => {
  if (contributions.length === 0) return { current: 0, longest: 0 }

  const sorted = [...contributions]
    .filter((d) => d.count > 0)
    .map((d) => d.date)
    .sort()

  if (sorted.length === 0) return { current: 0, longest: 0 }

  let longest = 1
  let current = 1
  let tempStreak = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1])
    const curr = dayjs(sorted[i])
    if (curr.diff(prev, 'day') === 1) {
      tempStreak++
      if (tempStreak > longest) longest = tempStreak
    } else {
      tempStreak = 1
    }
  }

  // Calculate current streak (must include today or yesterday)
  const todayStr = dayjs().format('YYYY-MM-DD')
  const yesterdayStr = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const lastCleanDay = sorted[sorted.length - 1]

  if (lastCleanDay !== todayStr && lastCleanDay !== yesterdayStr) {
    current = 0
  } else {
    current = 1
    for (let i = sorted.length - 2; i >= 0; i--) {
      const next = dayjs(sorted[i + 1])
      const curr = dayjs(sorted[i])
      if (next.diff(curr, 'day') === 1) {
        current++
      } else {
        break
      }
    }
  }

  return { current, longest }
}

/**
 * Calculates completion percentage for a habit.
 * completedDays / totalDaysSinceCreation
 */
export const calculateCompletionPercentage = (
  completedDays: number,
  createdAt: string,
): number => {
  const total = dayjs().diff(dayjs(createdAt), 'day') + 1
  if (total <= 0) return 0
  return Math.round((completedDays / total) * 100)
}
