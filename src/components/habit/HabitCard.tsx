import { useState } from 'react'
import { useEntryStore } from '@/store/entryStore'
import { useHabitStore } from '@/store/habitStore'
import HabitHeatmap from '@/components/heatmap/HabitHeatmap'
import Modal from '@/components/ui/Modal'
import HabitForm from './HabitForm'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import { calculateCompletionPercentage } from '@/utils/streak'
import type { Habit, CreateHabitPayload } from '@/types/habit'
import toast from 'react-hot-toast'

interface HabitCardProps {
  habit: Habit
  showHeatmap?: boolean
}

export default function HabitCard({ habit, showHeatmap = false }: HabitCardProps) {
  const { updateHabit, deleteHabit } = useHabitStore()
  const { habitContributions, fetchHabitContributions } = useEntryStore()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [heatmapExpanded, setHeatmapExpanded] = useState(showHeatmap)
  const [deleting, setDeleting] = useState(false)

  const contributions = habitContributions[habit._id] ?? []
  const completedDays = contributions.filter((c) => c.count > 0).length
  const completionPct = calculateCompletionPercentage(completedDays, habit.createdAt)

  const handleExpand = () => {
    if (!heatmapExpanded && contributions.length === 0) {
      fetchHabitContributions(habit._id)
    }
    setHeatmapExpanded(!heatmapExpanded)
  }

  const handleEdit = async (data: CreateHabitPayload) => {
    await updateHabit(habit._id, data)
    toast.success('Habit updated')
    setEditOpen(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteHabit(habit._id)
      toast.success('Habit deleted')
    } finally {
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color }}
            />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary truncate">{habit.name}</h3>
              {habit.description && (
                <p className="text-xs text-muted truncate">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 text-muted hover:text-text-primary rounded transition-colors"
              aria-label="Edit habit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="p-1.5 text-muted hover:text-danger rounded transition-colors"
              aria-label="Delete habit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge color={habit.color}>
            🔥 {habit.streak} day streak
          </Badge>
          <Badge className="bg-border/60 text-muted">
            {habit.frequency}
          </Badge>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Completion rate</span>
            <span>{completionPct}%</span>
          </div>
          <ProgressBar value={completionPct} color={habit.color} />
        </div>

        <button
          onClick={handleExpand}
          className="flex items-center gap-1 text-xs text-muted hover:text-text-primary transition-colors w-fit"
        >
          <svg
            className={`w-3 h-3 transition-transform ${heatmapExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {heatmapExpanded ? 'Hide heatmap' : 'Show heatmap'}
        </button>

        {heatmapExpanded && (
          <div className="pt-2 border-t border-border animate-slide-in">
            <HabitHeatmap contributions={contributions} color={habit.color} />
          </div>
        )}
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Habit">
        <HabitForm
          initialValues={{ name: habit.name, description: habit.description, color: habit.color }}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
          submitLabel="Save Changes"
        />
      </Modal>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Habit" size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete <strong className="text-text-primary">"{habit.name}"</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDeleteConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
