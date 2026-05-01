import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppState, DailyEntry, Habit, MoodTag, TestResult } from '../types'
import { todayKey } from '../utils/date'
import { buildInitialState, defaultEntry, loadState, saveState } from '../utils/storage'
import { buildStressAlert } from '../utils/analysis'

interface AppContextType {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  today: string
  todayEntry: DailyEntry
  updateTodayEntry: (patch: Partial<DailyEntry>) => void
  toggleMoodTag: (tag: MoodTag) => void
  toggleHabitToday: (habitId: string) => void
  toggleTheme: () => void
  addHabit: (name: string) => void
  setHabitActive: (habitId: string, active: boolean) => void
  habitStreak: (habitId: string) => number
  stressAlert: string | null
  addTestResult: (result: TestResult) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return buildInitialState()
    return loadState()
  })

  const today = todayKey()
  const todayEntry = state.dailyEntries[today] ?? defaultEntry(today)

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    saveState(state)
  }, [state])

  useEffect(() => {
    if (!state.dailyEntries[today]) {
      setState((prev) => ({
        ...prev,
        dailyEntries: {
          ...prev.dailyEntries,
          [today]: defaultEntry(today),
        },
      }))
    }
  }, [today, state.dailyEntries])

  const updateTodayEntry = (patch: Partial<DailyEntry>): void => {
    setState((prev) => {
      const current = prev.dailyEntries[today] ?? defaultEntry(today)
      return {
        ...prev,
        dailyEntries: {
          ...prev.dailyEntries,
          [today]: {
            ...current,
            ...patch,
          },
        },
      }
    })
  }

  const toggleMoodTag = (tag: MoodTag): void => {
    const tags = todayEntry.moodTags.includes(tag)
      ? todayEntry.moodTags.filter((value) => value !== tag)
      : [...todayEntry.moodTags, tag]
    updateTodayEntry({ moodTags: tags })
  }

  const toggleHabitToday = (habitId: string): void => {
    const next = todayEntry.completedHabits.includes(habitId)
      ? todayEntry.completedHabits.filter((id) => id !== habitId)
      : [...todayEntry.completedHabits, habitId]
    updateTodayEntry({ completedHabits: next })
  }

  const toggleTheme = (): void => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }))
  }

  const addHabit = (name: string): void => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name,
      active: true,
      createdAt: today,
    }

    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }))
  }

  const setHabitActive = (habitId: string, active: boolean): void => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((habit) => (habit.id === habitId ? { ...habit, active } : habit)),
    }))
  }

  const habitStreak = (habitId: string): number => {
    const keys = Object.keys(state.dailyEntries).sort().reverse()
    let streak = 0
    for (const key of keys) {
      const day = state.dailyEntries[key]
      if (day.completedHabits.includes(habitId)) {
        streak += 1
      } else {
        break
      }
    }
    return streak
  }

  const addTestResult = (result: TestResult): void => {
    setState((prev) => ({
      ...prev,
      testHistory: [result, ...prev.testHistory],
    }))
  }

  const stressAlert = useMemo(() => buildStressAlert(state.dailyEntries), [state.dailyEntries])

  const value = {
    state,
    setState,
    today,
    todayEntry,
    updateTodayEntry,
    toggleMoodTag,
    toggleHabitToday,
    toggleTheme,
    addHabit,
    setHabitActive,
    habitStreak,
    stressAlert,
    addTestResult,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
