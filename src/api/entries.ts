import apiClient from './axios'
import type { Entry, ContributionDay, HabitContributionDay } from '@/types/entry'

export const entriesApi = {
  getDaily: async (date: string): Promise<Entry[]> => {
    const { data } = await apiClient.get<Entry[]>(`/entries/daily/${date}`)
    return data
  },

  getContributions: async (startDate: string, endDate: string): Promise<ContributionDay[]> => {
    const { data } = await apiClient.get<ContributionDay[]>(`/entries/contributions?startDate=${startDate}&endDate=${endDate}`)
    return data;
  },

  getHabitContributions: async (
    habitId: string,
    startDate: string,
    endDate: string,
  ): Promise<HabitContributionDay[]> => {
    const { data } = await apiClient.get<HabitContributionDay[]>(
      `/entries/contributions/${habitId}?startDate=${startDate}&endDate=${endDate}`,
    )
    return data
  },

  logEntry: async (habitId: string, date: string, completed: boolean = true): Promise<Entry> => {
    const { data } = await apiClient.post<Entry>(`/entries/${habitId}`, { date, completed })
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
