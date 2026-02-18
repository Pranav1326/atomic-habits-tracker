import { create } from 'zustand'
import dayjs from 'dayjs'
import { entriesApi } from '@/api/entries'
import type { Entry, ContributionDay, HabitContributionDay } from '@/types/entry'

interface EntryStore {
  dailyEntries: Entry[]
  contributions: ContributionDay[]
  habitContributions: Record<string, HabitContributionDay[]>
  loadingDaily: boolean
  loadingContributions: boolean
  error: string | null

  fetchDailyEntries: (date: string) => Promise<void>
  fetchContributions: () => Promise<void>
  fetchHabitContributions: (habitId: string) => Promise<void>
  updateDayEntries: (
    date: string,
    entries: { habitId: string; completed: boolean }[],
  ) => Promise<void>
  clearDailyEntries: () => void
}

/**
 * Generate all dates in a range to fill gaps in contribution data
 */
const generateDateRange = (startDate: string, endDate: string): ContributionDay[] => {
  const dates: ContributionDay[] = []
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  let current = start
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push({
      date: current.format('YYYY-MM-DD'),
      total: 0,
      completed: 0,
      cleanDay: false,
    })
    current = current.add(1, 'day')
  }

  return dates
}

/**
 * Merge API contributions with full date range, allowing clicks on any day
 */
const fillContributionGaps = (
  apiContributions: ContributionDay[],
  startDate: string,
  endDate: string,
): ContributionDay[] => {
  const allDates = generateDateRange(startDate, endDate)
  // Normalize API dates to YYYY-MM-DD format
  const apiMap = new Map(
    apiContributions.map((c) => [
      dayjs(c.date).format('YYYY-MM-DD'),
      { ...c, date: dayjs(c.date).format('YYYY-MM-DD') },
    ])
  )

  return allDates.map((date) => apiMap.get(date.date) ?? date)
}

/**
 * Generate habit contribution dates to fill gaps
 */
const generateHabitDateRange = (startDate: string, endDate: string): HabitContributionDay[] => {
  const dates: HabitContributionDay[] = []
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  let current = start
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push({
      date: current.format('YYYY-MM-DD'),
      completed: 0,
    })
    current = current.add(1, 'day')
  }

  return dates
}

/**
 * Merge habit contributions with full date range
 */
const fillHabitContributionGaps = (
  apiContributions: HabitContributionDay[],
  startDate: string,
  endDate: string,
): HabitContributionDay[] => {
  const allDates = generateHabitDateRange(startDate, endDate)
  // Normalize API dates to YYYY-MM-DD format
  const apiMap = new Map(
    apiContributions.map((c) => [
      dayjs(c.date).format('YYYY-MM-DD'),
      { ...c, date: dayjs(c.date).format('YYYY-MM-DD') },
    ])
  )

  return allDates.map((date) => apiMap.get(date.date) ?? date)
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  dailyEntries: [],
  contributions: [],
  habitContributions: {},
  loadingDaily: false,
  loadingContributions: false,
  error: null,

  fetchDailyEntries: async (date) => {
    set({ loadingDaily: true, error: null })
    try {
      const entries = await entriesApi.getDaily(date)
      set({ dailyEntries: entries, loadingDaily: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entries'
      set({ loadingDaily: false, error: message })
    }
  },

  fetchContributions: async () => {
    set({ loadingContributions: true, error: null })
    try {
      const startDate = dayjs().startOf('year').format('YYYY-MM-DD')
      const endDate = dayjs().endOf('year').format('YYYY-MM-DD')
      const apiContributions = await entriesApi.getContributions(startDate, endDate)
      const contributions = fillContributionGaps(apiContributions, startDate, endDate)
      set({ contributions, loadingContributions: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contributions'
      set({ loadingContributions: false, error: message })
    }
  },

  fetchHabitContributions: async (habitId) => {
    try {
      const startDate = dayjs().startOf('year').format('YYYY-MM-DD')
      const endDate = dayjs().endOf('year').format('YYYY-MM-DD')
      const apiData = await entriesApi.getHabitContributions(habitId, startDate, endDate)
      const data = fillHabitContributionGaps(apiData, startDate, endDate)
      set({
        habitContributions: {
          ...get().habitContributions,
          [habitId]: data,
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch habit contributions'
      set({ error: message })
    }
  },

  updateDayEntries: async (date, entries) => {
    const updated = await entriesApi.updateDay(date, entries)
    set({ dailyEntries: updated })
  },

  clearDailyEntries: () => set({ dailyEntries: [] }),
}))
