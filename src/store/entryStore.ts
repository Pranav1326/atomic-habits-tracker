import { create } from 'zustand'
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
      const contributions = await entriesApi.getContributions()
      set({ contributions, loadingContributions: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contributions'
      set({ loadingContributions: false, error: message })
    }
  },

  fetchHabitContributions: async (habitId) => {
    try {
      const data = await entriesApi.getHabitContributions(habitId)
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
