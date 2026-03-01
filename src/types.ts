export type ThemeMode = 'light' | 'dark'

export type MoodTag = 'work' | 'family' | 'health' | 'unknown'

export interface Habit {
  id: string
  name: string
  active: boolean
  createdAt: string
}

export interface DailyEntry {
  date: string
  moodEmoji: string
  moodIntensity: number
  moodTags: MoodTag[]
  dailyRating: number
  stressLevel: number
  stressTrigger: string
  completedHabits: string[]
  reflectionNote: string
}

export interface TestOption {
  label: string
  score: number
}

export interface TestQuestion {
  id: string
  prompt: string
  options: TestOption[]
}

export interface AssessmentTest {
  id: string
  title: string
  description: string
  questions: TestQuestion[]
  interpret: (score: number, maxScore: number) => string
}

export interface TestResult {
  id: string
  testId: string
  testTitle: string
  takenAt: string
  score: number
  maxScore: number
  interpretation: string
}

export interface AppState {
  theme: ThemeMode
  habits: Habit[]
  dailyEntries: Record<string, DailyEntry>
  testHistory: TestResult[]
}
