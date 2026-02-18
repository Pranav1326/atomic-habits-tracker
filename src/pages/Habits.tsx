import { useEffect, useState } from 'react'
import HabitCard from '@/components/habit/HabitCard'
import HabitForm from '@/components/habit/HabitForm'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useHabitStore } from '@/store/habitStore'
import type { CreateHabitPayload } from '@/types/habit'
import toast from 'react-hot-toast'

export default function Habits() {
  const { habits, fetchHabits, createHabit, loading } = useHabitStore()
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleCreate = async (data: CreateHabitPayload) => {
    await createHabit(data)
    toast.success('Habit created!')
    setCreateOpen(false)
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Habits</h1>
          <p className="text-sm text-muted mt-1">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Habit
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">No habits yet</h3>
            <p className="text-sm text-muted mt-1">
              Start building better habits by creating your first one.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>Create your first habit</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <HabitCard key={habit._id} habit={habit} />
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Habit">
        <HabitForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          submitLabel="Create Habit"
        />
      </Modal>
    </div>
  )
}
