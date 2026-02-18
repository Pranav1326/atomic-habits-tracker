import CalendarHeatmap from 'react-calendar-heatmap'
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import type { HabitContributionDay } from '@/types/entry'
import { oneYearAgo, today, formatDisplay } from '@/utils/date'

interface HeatmapValue {
  date: string
  count: number
}

interface HabitHeatmapProps {
  contributions: HabitContributionDay[]
  color: string
  onDayClick?: (date: string) => void
}

export default function HabitHeatmap({ contributions, color, onDayClick }: HabitHeatmapProps) {
  const startDate = oneYearAgo()
  const endDate = today()

  const styleId = `heatmap-${color.replace('#', '')}`

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const getTooltip = (raw: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
    const value = raw as HeatmapValue | undefined
    if (!value?.date) return { 'aria-label': 'No data' } as TooltipDataAttrs
    const label = value.count > 0 ? 'Completed' : 'Not completed'
    return { 'aria-label': `${formatDisplay(value.date)} — ${label}` } as TooltipDataAttrs
  }

  return (
    <div className={`w-full overflow-x-auto ${styleId}`}>
      <style>{`
        .${styleId} .color-empty { fill: #161b22; }
        .${styleId} .color-scale-1 { fill: ${hexToRgba(color, 0.8)}; }
        .${styleId} rect { rx: 2; }
        .${styleId} rect:hover { stroke: #8b949e; stroke-width: 1px; cursor: pointer; }
        .${styleId} text { fill: #8b949e; font-size: 9px; }
      `}</style>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={contributions.map((c) => ({ date: c.date, count: c.count }))}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty'
          return 'color-scale-1'
        }}
        tooltipDataAttrs={getTooltip}
        onClick={(raw: ReactCalendarHeatmapValue<string> | undefined) => {
          const value = raw as HeatmapValue | undefined
          if (value?.date && onDayClick) onDayClick(value.date)
        }}
        showWeekdayLabels
      />
    </div>
  )
}
