import dayjs from 'dayjs'

export const FORMAT_DATE = 'YYYY-MM-DD'
export const FORMAT_DISPLAY = 'MMM D, YYYY'
export const FORMAT_DISPLAY_SHORT = 'MMM D'

export const today = (): string => dayjs().format(FORMAT_DATE)

export const formatDate = (date: string | Date): string =>
  dayjs(date).format(FORMAT_DATE)

export const formatDisplay = (date: string | Date): string =>
  dayjs(date).format(FORMAT_DISPLAY)

export const formatDisplayShort = (date: string | Date): string =>
  dayjs(date).format(FORMAT_DISPLAY_SHORT)

export const oneYearAgo = (): string =>
  dayjs().subtract(1, 'year').format(FORMAT_DATE)

export const generateDateRange = (start: string, end: string): string[] => {
  const dates: string[] = []
  let current = dayjs(start)
  const endDate = dayjs(end)

  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    dates.push(current.format(FORMAT_DATE))
    current = current.add(1, 'day')
  }

  return dates
}

export const isToday = (date: string): boolean =>
  dayjs(date).isSame(dayjs(), 'day')

export const isFuture = (date: string): boolean =>
  dayjs(date).isAfter(dayjs(), 'day')

export const daysBetween = (start: string, end: string): number =>
  dayjs(end).diff(dayjs(start), 'day')
