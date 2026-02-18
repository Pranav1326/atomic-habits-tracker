import apiClient from './axios'
import type { Entry, ContributionDay, HabitContributionDay } from '@/types/entry'

export const entriesApi = {
  getDaily: async (date: string): Promise<Entry[]> => {
    const { data } = await apiClient.get<Entry[]>(`/entries/daily/${date}`)
    return data
  },

  getContributions: async (): Promise<ContributionDay[]> => {
    const { data } = await apiClient.get<ContributionDay[]>('/entries/contributions')
    return data
  },

  getHabitContributions: async (habitId: string): Promise<HabitContributionDay[]> => {
    const { data } = await apiClient.get<HabitContributionDay[]>(
      `/entries/contributions/${habitId}`,
    )
    return data
  },

  logEntry: async (habitId: string): Promise<Entry> => {
    const { data } = await apiClient.post<Entry>(`/entries/${habitId}`)
    return data
  },

  updateDay: async (
    date: string,
    entries: { habitId: string; completed: boolean }[],
  ): Promise<Entry[]> => {
    const { data } = await apiClient.put<Entry[]>(`/entries/day/${date}`, { entries })
    return data
  },
}
