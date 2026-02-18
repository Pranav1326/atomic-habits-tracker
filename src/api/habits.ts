import apiClient from './axios'
import type { Habit, CreateHabitPayload, UpdateHabitPayload } from '@/types/habit'

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const { data } = await apiClient.get<Habit[]>('/habits')
    return data
  },

  getById: async (id: string): Promise<Habit> => {
    const { data } = await apiClient.get<Habit>(`/habits/${id}`)
    return data
  },

  create: async (payload: CreateHabitPayload): Promise<Habit> => {
    const { data } = await apiClient.post<Habit>('/habits', payload)
    return data
  },

  update: async (id: string, payload: UpdateHabitPayload): Promise<Habit> => {
    const { data } = await apiClient.put<Habit>(`/habits/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`)
  },
}
