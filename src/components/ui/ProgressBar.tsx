interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  showLabel?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  className = '',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color ?? '#238636',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted w-10 text-right">{percentage}%</span>
      )}
    </div>
  )
}
