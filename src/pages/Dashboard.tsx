import { useEffect, useState } from 'react'
import MainHeatmap from '@/components/heatmap/MainHeatmap'
import DayModal from '@/components/heatmap/DayModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatCard from '@/components/ui/StatCard'
import { useHabitStore } from '@/store/habitStore'
import { useEntryStore } from '@/store/entryStore'
import { calculateStreaks } from '@/utils/streak'
import { today, formatDisplay } from '@/utils/date'

export default function Dashboard() {
  const { habits, fetchHabits, loading: habitsLoading } = useHabitStore()
  const { contributions, fetchContributions, loadingContributions, fetchDailyEntries, dailyEntries } = useEntryStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchHabits()
    fetchContributions()
    fetchDailyEntries(today())
  }, [fetchHabits, fetchContributions, fetchDailyEntries])

  const { current, longest } = calculateStreaks(contributions)
  const todayCompleted = dailyEntries.filter((e) => e.completed).length
  const totalToday = habits.length
  const cleanDaysTotal = contributions.filter((c) => c.count > 0).length

  const isLoading = habitsLoading || loadingContributions

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          {formatDisplay(today())} — Track your daily progress
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Today"
              value={`${todayCompleted}/${totalToday}`}
              subtitle="done"
              color="#238636"
            />
            <StatCard
              label="Current Streak"
              value={current}
              subtitle="days"
              color="#f78166"
            />
            <StatCard
              label="Longest Streak"
              value={longest}
              subtitle="days"
              color="#a371f7"
            />
            <StatCard
              label="Clean Days"
              value={cleanDaysTotal}
              subtitle="total"
              color="#ffa657"
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  Contribution Graph
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Green squares represent days where all habits were completed
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>Less</span>
                {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span>More</span>
              </div>
            </div>
            <MainHeatmap
              contributions={contributions}
              onDayClick={setSelectedDate}
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Today's Habits
            </h2>
            {habits.length === 0 ? (
              <p className="text-muted text-sm">
                No habits yet. <a href="/habits" className="text-accent hover:underline">Create your first habit →</a>
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {habits.map((habit) => {
                  const entry = dailyEntries.find((e) => e.habit === habit._id)
                  const done = entry?.completed ?? false
                  return (
                    <div
                      key={habit._id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md border ${
                        done ? 'bg-accent/5 border-accent/20' : 'bg-background border-border'
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className={`text-sm ${done ? 'text-text-primary' : 'text-muted'}`}>
                        {habit.name}
                      </span>
                      {done && (
                        <svg className="w-4 h-4 text-accent ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-muted text-center">
            Click any square to log or edit habits for that day
          </p>
        </>
      )}

      <DayModal date={selectedDate} onClose={() => setSelectedDate(null)} />
    </div>
  )
}
