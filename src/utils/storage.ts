import type { AppState, DailyEntry, Habit, ThemeMode } from '../types'
import { todayKey } from './date'

const STORAGE_KEY = 'akshayom.v1'

const defaultHabits: Habit[] = [
  { id: 'h-breathing', name: 'Breathing reset', active: true, createdAt: todayKey() },
  { id: 'h-walk', name: '20 min walk', active: true, createdAt: todayKey() },
  { id: 'h-journal', name: 'Journal 5 mins', active: true, createdAt: todayKey() },
]

export const defaultEntry = (date: string): DailyEntry => ({
  date,
  moodEmoji: '🙂',
  moodIntensity: 6,
  moodTags: [],
  dailyRating: 6,
  stressLevel: 35,
  stressTrigger: '',
  completedHabits: [],
  reflectionNote: '',
})

const getPreferredTheme = (): ThemeMode =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const buildInitialState = (): AppState => ({
  theme: getPreferredTheme(),
  habits: defaultHabits,
  dailyEntries: {
    [todayKey()]: defaultEntry(todayKey()),
  },
  testHistory: [],
})

export const loadState = (): AppState => {
  const fallback = buildInitialState()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      theme: parsed.theme === 'dark' ? 'dark' : fallback.theme,
      habits: Array.isArray(parsed.habits) && parsed.habits.length ? parsed.habits : fallback.habits,
      dailyEntries: parsed.dailyEntries && typeof parsed.dailyEntries === 'object' ? parsed.dailyEntries : fallback.dailyEntries,
      testHistory: Array.isArray(parsed.testHistory) ? parsed.testHistory : fallback.testHistory,
    }
  } catch {
    return fallback
  }
}

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
