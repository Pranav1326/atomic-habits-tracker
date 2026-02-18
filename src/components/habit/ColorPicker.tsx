const PRESET_COLORS = [
  '#238636', '#1f6feb', '#a371f7', '#f78166',
  '#ffa657', '#3fb950', '#58a6ff', '#ff7b72',
  '#d2a8ff', '#79c0ff', '#56d364', '#e3b341',
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorPicker({ value, onChange, label = 'Color' }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full transition-transform duration-100 ${
              value === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-surface' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <label
          className="w-7 h-7 rounded-full border-2 border-dashed border-border cursor-pointer flex items-center justify-center hover:border-muted transition-colors"
          title="Custom color"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className="text-muted text-xs">+</span>
        </label>
      </div>
      <div
        className="w-full h-2 rounded-full"
        style={{ backgroundColor: value }}
      />
    </div>
  )
}
