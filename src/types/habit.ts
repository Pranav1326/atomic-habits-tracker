export interface Habit {
  _id: string
  name: string
  description: string
  color: string
  frequency: string
  streak: number
  createdAt: string
  updatedAt: string
}

export interface CreateHabitPayload {
  name: string
  description: string
  color: string
  frequency: string
}

export interface UpdateHabitPayload {
  name?: string
  description?: string
  color?: string
  frequency?: string
}
