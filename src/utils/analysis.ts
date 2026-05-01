import { DailyEntry } from '../types'
import { isConsecutiveDate } from './date'

export const average = (values: number[]): number => {
  if (!values.length) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

export const asPercent = (value: number): string => `${Math.round(value)}%`

export const buildStressAlert = (entries: Record<string, DailyEntry>): string | null => {
  const keys = Object.keys(entries).sort()
  if (keys.length < 5) return null

  let streak = 0
  let previous: string | null = null

  for (const key of keys) {
    const entry = entries[key]
    const high = entry.stressLevel > 70

    if (!high) {
      streak = 0
      previous = key
      continue
    }

    if (!previous) {
      streak = 1
      previous = key
      continue
    }

    streak = isConsecutiveDate(previous, key) ? streak + 1 : 1
    previous = key

    if (streak >= 5) {
      return 'Stress alert: your stress has stayed above 70 for 5 consecutive days. Consider recovery time.'
    }
  }

  return null
}
