import CalendarHeatmap from 'react-calendar-heatmap'
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import type { HabitContributionDay } from '@/types/entry'
import dayjs from 'dayjs'
import { formatDisplay } from '@/utils/date'

interface HeatmapValue {
  date: string
  count: number
}

interface HabitMonthHeatmapProps {
  contributions: HabitContributionDay[]
  color: string
}

export default function HabitMonthHeatmap({ contributions, color }: HabitMonthHeatmapProps) {
  const startDate = dayjs().startOf('month').format('YYYY-MM-DD')
  const endDate = dayjs().endOf('month').format('YYYY-MM-DD')

  const styleId = `month-heatmap-${color.replace('#', '')}`

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Filter contributions for current month only
  const monthContributions = contributions.filter((c) => {
    const date = dayjs(c.date)
    return (date.isAfter(startDate, 'day') || date.isSame(startDate, 'day')) && 
           (date.isBefore(endDate, 'day') || date.isSame(endDate, 'day'))
  })

  const getTooltip = (raw: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
    const value = raw as HeatmapValue | undefined
    if (!value?.date) return { 'aria-label': 'No data' } as TooltipDataAttrs
    const label = value.count > 0 ? 'Completed' : 'Not completed'
    return { 'aria-label': `${formatDisplay(value.date)} — ${label}` } as TooltipDataAttrs
  }

  const handleDayClick = (value: ReactCalendarHeatmapValue<string> | undefined) => {
    // Click handler for future enhancements
    const heatmapValue = value as HeatmapValue | undefined
    if (heatmapValue?.date) {
      // Could open a day modal here if needed
    }
  }

  return (
    <div className={`w-full overflow-x-auto ${styleId} h-[80px]`}>
      <style>{`
        .${styleId} .react-calendar-heatmap {
          transform: scale(0.6);
          transform-origin: top left;
        }
        .${styleId} .color-empty { 
          fill: #0d1117; 
          stroke: #30363d; 
          stroke-width: 1px;
        }
        .${styleId} .color-scale-1 { fill: ${hexToRgba(color, 0.8)}; }
        .${styleId} rect { rx: 3; ry: 3; }
        .${styleId} rect:hover { stroke: #8b949e; stroke-width: 1px; cursor: pointer; }
        .${styleId} text { fill: #8b949e; font-size: 9px; }
      `}</style>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={monthContributions.map((c) => ({
          date: c.date,
          count: c.completed,
        }))}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty'
          return 'color-scale-1'
        }}
        tooltipDataAttrs={getTooltip}
        onClick={handleDayClick}
        showWeekdayLabels={false}
      />
    </div>
  )
}
