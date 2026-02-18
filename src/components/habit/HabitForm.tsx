import { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import ColorPicker from './ColorPicker'
import type { CreateHabitPayload } from '@/types/habit'

interface HabitFormProps {
  initialValues?: Partial<CreateHabitPayload>
  onSubmit: (data: CreateHabitPayload) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

interface FormErrors {
  name?: string
  description?: string
}

export default function HabitForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Create Habit',
}: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [color, setColor] = useState(initialValues?.color ?? '#238636')
  const [frequency] = useState(initialValues?.frequency ?? 'daily')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (name.trim().length > 80) newErrors.name = 'Name must be 80 characters or less'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), color, frequency })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Morning run"
        error={errors.name}
        autoFocus
      />
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What is this habit about?"
      />
      <ColorPicker value={color} onChange={setColor} />
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
