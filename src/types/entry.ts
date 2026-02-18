export interface HabitPopulated {
  _id: string
  name: string
  description: string
  color: string
  frequency: string
  streak: number
  createdAt: string
  updatedAt: string
}

export interface Entry {
  _id: string
  habit: string | HabitPopulated
  date: string
  completed: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface DailyEntry {
  habitId: string
  completed: boolean
}

export interface ContributionDay {
  date: string
  total: number
  completed: number
  cleanDay: boolean
}

export interface HabitContributionDay {
  date: string
  completed: number
}

export interface DailyHabitStatus {
  habitId: string
  habitName: string
  habitColor: string
  completed: boolean
  entryId: string | null
}
