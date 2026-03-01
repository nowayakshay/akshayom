export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = (): string => toDateKey(new Date())

export const formatLongDate = (key: string): string => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const daysAgo = (count: number): string[] => {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const copy = new Date(now)
    copy.setDate(now.getDate() - index)
    return toDateKey(copy)
  }).reverse()
}

export const isConsecutiveDate = (prev: string, next: string): boolean => {
  const [y1, m1, d1] = prev.split('-').map(Number)
  const [y2, m2, d2] = next.split('-').map(Number)
  const left = new Date(y1, m1 - 1, d1)
  const right = new Date(y2, m2 - 1, d2)
  const diff = (right.getTime() - left.getTime()) / (1000 * 60 * 60 * 24)
  return diff === 1
}
