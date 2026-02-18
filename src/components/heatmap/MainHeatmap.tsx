import CalendarHeatmap from 'react-calendar-heatmap'
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import type { ContributionDay } from '@/types/entry'
import { oneYearAgo, today, formatDisplay } from '@/utils/date'

interface HeatmapValue {
  date: string
  count: number
}

interface MainHeatmapProps {
  contributions: ContributionDay[]
  onDayClick: (date: string) => void
}

export default function MainHeatmap({ contributions, onDayClick }: MainHeatmapProps) {
  const startDate = oneYearAgo()
  const endDate = today()

  // Ensure dates are in YYYY-MM-DD format
  const values = contributions.map((c) => ({
    date: c.date,
    count: c.completed,
  }))

  const getTooltip = (raw: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
    const value = raw as HeatmapValue | undefined
    if (!value?.date) return { 'aria-label': 'No data' } as TooltipDataAttrs
    const label = value.count > 0 ? 'Clean day' : 'Incomplete'
    return { 'aria-label': `${formatDisplay(value.date)} — ${label}` } as TooltipDataAttrs
  }

  const handleDayClick = (value: ReactCalendarHeatmapValue<string> | undefined) => {
    const heatmapValue = value as HeatmapValue | undefined
    if (heatmapValue?.date) {
      // Ensure date is in YYYY-MM-DD format
      const dateStr = typeof heatmapValue.date === 'string' 
        ? heatmapValue.date.split('T')[0] 
        : heatmapValue.date
      onDayClick(dateStr)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <style>{`
        .react-calendar-heatmap .color-empty { 
          fill: #0d1117; 
          stroke: #30363d; 
          stroke-width: 1px;
        }
        .react-calendar-heatmap .color-scale-1 { fill: #0e4429; }
        .react-calendar-heatmap .color-scale-2 { fill: #006d32; }
        .react-calendar-heatmap .color-scale-3 { fill: #26a641; }
        .react-calendar-heatmap .color-scale-4 { fill: #39d353; }
        .react-calendar-heatmap rect { rx: 3; ry: 3; }
        .react-calendar-heatmap rect:hover { stroke: #8b949e; stroke-width: 1px; cursor: pointer; }
        .react-calendar-heatmap text { fill: #8b949e; font-size: 9px; }
      `}</style>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty'
          return 'color-scale-4'
        }}
        tooltipDataAttrs={getTooltip}
        onClick={handleDayClick}
        showWeekdayLabels
      />
    </div>
  )
}
