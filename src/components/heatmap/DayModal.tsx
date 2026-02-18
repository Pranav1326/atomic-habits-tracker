import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useHabitStore } from '@/store/habitStore'
import { useEntryStore } from '@/store/entryStore'
import { formatDisplay } from '@/utils/date'
import type { DailyHabitStatus } from '@/types/entry'

interface DayModalProps {
  date: string | null
  onClose: () => void
}

export default function DayModal({ date, onClose }: DayModalProps) {
  const { habits } = useHabitStore()
  const { dailyEntries, fetchDailyEntries, updateDayEntries, loadingDaily } = useEntryStore()
  const [statuses, setStatuses] = useState<DailyHabitStatus[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (date) {
      fetchDailyEntries(date)
    }
  }, [date, fetchDailyEntries])

  useEffect(() => {
    if (habits.length === 0) return
    const mapped: DailyHabitStatus[] = habits.map((habit) => {
      const entry = dailyEntries.find((e) => e.habit === habit._id)
      return {
        habitId: habit._id,
        habitName: habit.name,
        habitColor: habit.color,
        completed: entry?.completed ?? false,
        entryId: entry?._id ?? null,
      }
    })
    setStatuses(mapped)
  }, [habits, dailyEntries])

  const toggleHabit = (habitId: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.habitId === habitId ? { ...s, completed: !s.completed } : s)),
    )
  }

  const handleSave = async () => {
    if (!date) return
    setSaving(true)
    try {
      await updateDayEntries(
        date,
        statuses.map((s) => ({ habitId: s.habitId, completed: s.completed })),
      )
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const completedCount = statuses.filter((s) => s.completed).length
  const isCleanDay = statuses.length > 0 && completedCount === statuses.length

  return (
    <Modal
      isOpen={!!date}
      onClose={onClose}
      title={date ? formatDisplay(date) : ''}
      size="md"
    >
      {loadingDaily ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {completedCount} / {statuses.length} habits completed
            </span>
            {isCleanDay && (
              <span className="text-accent font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Clean Day!
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {statuses.map((status) => (
              <button
                key={status.habitId}
                onClick={() => toggleHabit(status.habitId)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-md border transition-colors duration-150
                  ${status.completed
                    ? 'bg-accent/10 border-accent/30'
                    : 'bg-background border-border hover:border-muted'
                  }
                `}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors`}
                  style={{
                    borderColor: status.completed ? status.habitColor : '#30363d',
                    backgroundColor: status.completed ? status.habitColor : 'transparent',
                  }}
                >
                  {status.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-medium flex-1 text-left ${
                    status.completed ? 'text-text-primary' : 'text-muted'
                  }`}
                >
                  {status.habitName}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
