export interface Entry {
  _id: string
  habit: string
  date: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface DailyEntry {
  habitId: string
  completed: boolean
}

export interface ContributionDay {
  date: string
  count: number
}

export interface HabitContributionDay {
  date: string
  count: number
}

export interface DailyHabitStatus {
  habitId: string
  habitName: string
  habitColor: string
  completed: boolean
  entryId: string | null
}
