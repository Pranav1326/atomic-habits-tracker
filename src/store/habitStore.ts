import { create } from 'zustand'
import { habitsApi } from '@/api/habits'
import type { Habit, CreateHabitPayload, UpdateHabitPayload } from '@/types/habit'

interface HabitStore {
  habits: Habit[]
  loading: boolean
  error: string | null
  fetchHabits: () => Promise<void>
  createHabit: (payload: CreateHabitPayload) => Promise<Habit>
  updateHabit: (id: string, payload: UpdateHabitPayload) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  setHabits: (habits: Habit[]) => void
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null })
    try {
      const habits = await habitsApi.getAll()
      set({ habits, loading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch habits'
      set({ loading: false, error: message })
    }
  },

  createHabit: async (payload) => {
    const habit = await habitsApi.create(payload)
    set({ habits: [...get().habits, habit] })
    return habit
  },

  updateHabit: async (id, payload) => {
    const updated = await habitsApi.update(id, payload)
    set({
      habits: get().habits.map((h) => (h._id === id ? updated : h)),
    })
  },

  deleteHabit: async (id) => {
    await habitsApi.delete(id)
    set({ habits: get().habits.filter((h) => h._id !== id) })
  },

  setHabits: (habits) => set({ habits }),
}))
