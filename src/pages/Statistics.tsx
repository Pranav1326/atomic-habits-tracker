import { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import StatCard from '@/components/ui/StatCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useHabitStore } from '@/store/habitStore'
import { useEntryStore } from '@/store/entryStore'
import { calculateStreaks, calculateCompletionPercentage } from '@/utils/streak'

interface ChartDataPoint {
  name: string
  completion: number
  color: string
}

export default function Statistics() {
  const { habits, fetchHabits, loading: habitsLoading } = useHabitStore()
  const {
    contributions,
    habitContributions,
    fetchContributions,
    fetchHabitContributions,
    loadingContributions,
  } = useEntryStore()

  useEffect(() => {
    fetchHabits()
    fetchContributions()
  }, [fetchHabits, fetchContributions])

  useEffect(() => {
    habits.forEach((habit) => {
      if (!habitContributions[habit._id]) {
        fetchHabitContributions(habit._id)
      }
    })
  }, [habits, habitContributions, fetchHabitContributions])

  const { current, longest } = calculateStreaks(contributions)
  const cleanDaysTotal = contributions.filter((c) => c.cleanDay).length

  const chartData: ChartDataPoint[] = habits.map((habit) => {
    const contribs = habitContributions[habit._id] ?? []
    const completed = contribs.filter((c) => c.completed === 1).length
    const pct = calculateCompletionPercentage(completed, habit.createdAt)
    return {
      name: habit.name.length > 14 ? `${habit.name.slice(0, 14)}…` : habit.name,
      completion: pct,
      color: habit.color,
    }
  })

  const isLoading = habitsLoading || loadingContributions

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: { value: number }[]
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-md px-3 py-2 text-sm shadow-lg">
          <p className="text-text-primary font-medium">{label}</p>
          <p className="text-muted">{payload[0].value}% completion</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Statistics</h1>
        <p className="text-sm text-muted mt-1">Your performance overview</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard
              label="Current Streak"
              value={current}
              subtitle="days"
              color="#f78166"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              }
            />
            <StatCard
              label="Longest Streak"
              value={longest}
              subtitle="days"
              color="#a371f7"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
            <StatCard
              label="Total Clean Days"
              value={cleanDaysTotal}
              subtitle="days"
              color="#238636"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-base font-semibold text-text-primary mb-1">
              Habit Completion Rates
            </h2>
            <p className="text-xs text-muted mb-6">
              Percentage of days completed since habit was created
            </p>

            {chartData.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">
                No habits to display. Create habits to see statistics.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#8b949e', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#8b949e', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                  <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Habit Details
            </h2>
            {habits.length === 0 ? (
              <p className="text-muted text-sm">No habits tracked yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {habits.map((habit) => {
                  const contribs = habitContributions[habit._id] ?? []
                  const completed = contribs.filter((c) => c.count > 0).length
                  const pct = calculateCompletionPercentage(completed, habit.createdAt)
                  return (
                    <div key={habit._id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div>
                          <span className="text-sm font-medium text-text-primary">
                            {habit.name}
                          </span>
                          <p className="text-xs text-muted">
                            {completed} days completed · {habit.streak} day streak
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: habit.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
