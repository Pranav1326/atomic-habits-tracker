interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  subtitle?: string
}

export default function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon && (
          <span className="text-muted" style={color ? { color } : undefined}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-text-primary" style={color ? { color } : undefined}>
          {value}
        </span>
        {subtitle && <span className="text-sm text-muted mb-1">{subtitle}</span>}
      </div>
    </div>
  )
}
