import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './index.css'
import { ASSESSMENT_TESTS } from './data/tests'
import type { AppState, DailyEntry, Habit, MoodTag } from './types'
import { daysAgo, formatLongDate, isConsecutiveDate, todayKey } from './utils/date'
import { buildInitialState, defaultEntry, loadState, saveState } from './utils/storage'

type TabKey = 'dashboard' | 'mood' | 'habits' | 'stress' | 'tests' | 'insights' | 'future'
type ViewKey = 'landing' | 'dashboard'

const moodOptions = ['😞', '🙁', '😐', '🙂', '😄']
const moodTags: MoodTag[] = ['work', 'family', 'health', 'unknown']
const stressTriggers = ['Workload', 'Sleep', 'Health', 'Relationships', 'Finances', 'Unclear']

const tabs: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: 'Home' },
  { key: 'mood', label: 'Mood' },
  { key: 'habits', label: 'Habits' },
  { key: 'stress', label: 'Stress' },
  { key: 'tests', label: 'Tests' },
  { key: 'insights', label: 'Insights' },
  { key: 'future', label: 'Future' },
]

const average = (values: number[]): number => {
  if (!values.length) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

const asPercent = (value: number): string => `${Math.round(value)}%`

const buildStressAlert = (entries: Record<string, DailyEntry>): string | null => {
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

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="landing page-enter">
      <section className="landing-hero card reveal in-view">
        <div className="hero-copy">
          <p className="eyebrow">Akshayom</p>
          <h1>Track Your Mind. Build Your Life.</h1>
          <p className="subtitle">
            Akshayom is your personal inner operating system — track mood, habits, stress, and growth patterns in one
            calm dashboard.
          </p>
          <p className="founder-line">Built by a founder, for self-aware builders.</p>
          <div className="hero-actions">
            <button className="primary" onClick={onLaunch}>
              Get Started
            </button>
            <button className="ghost" onClick={onLaunch}>
              View Dashboard Demo
            </button>
          </div>
        </div>
        <div className="shape-layer" aria-hidden="true">
          <span className="shape s1" />
          <span className="shape s2" />
          <span className="shape s3" />
        </div>
      </section>

      <section className="landing-section reveal">
        <h2>Core Features</h2>
        <div className="feature-grid">
          <article className="card feature-card">
            <div className="feature-icon">🙂</div>
            <h3>Mood Tracking</h3>
            <p className="muted">Log daily emotions, intensity, and tags with a clean visual timeline.</p>
          </article>
          <article className="card feature-card">
            <div className="feature-icon">✓</div>
            <h3>Habit Analytics</h3>
            <p className="muted">Track streaks and completion rates to understand your consistency patterns.</p>
          </article>
          <article className="card feature-card">
            <div className="feature-icon">◔</div>
            <h3>Stress Monitoring</h3>
            <p className="muted">Capture stress trends and triggers with weekly summaries and supportive alerts.</p>
          </article>
          <article className="card feature-card">
            <div className="feature-icon">↗</div>
            <h3>Weekly Insights</h3>
            <p className="muted">Get simple, meaningful observations from your behavior patterns each week.</p>
          </article>
        </div>
      </section>

      <section className="landing-section reveal">
        <h2>How It Works</h2>
        <div className="steps card">
          <div className="step">
            <strong>1. Track Daily</strong>
            <p className="muted">Capture mood, habits, stress, and notes in less than two minutes.</p>
          </div>
          <div className="step-sep" />
          <div className="step">
            <strong>2. Reflect Weekly</strong>
            <p className="muted">Review trends, test results, and meaningful summaries across your week.</p>
          </div>
          <div className="step-sep" />
          <div className="step">
            <strong>3. Improve Gradually</strong>
            <p className="muted">Use insights to make small, sustainable adjustments to your routines.</p>
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <article className="card final-cta">
          <h2>Start building your inner clarity today.</h2>
          <button className="primary glow" onClick={onLaunch}>
            Launch Dashboard
          </button>
        </article>
      </section>

      <footer className="footer reveal in-view">
        <p>
          © 2026 Akshayom<br />
          Crafted with clarity by{' '}
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            Akshay
          </a>
        </p>
      </footer>
    </main>
  )
}

function App() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return buildInitialState()
    return loadState()
  })
  const [view, setView] = useState<ViewKey>('landing')
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [habitDraft, setHabitDraft] = useState('')
  const [moodSaved, setMoodSaved] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState(ASSESSMENT_TESTS[0].id)
  const [answers, setAnswers] = useState<Record<string, number>>({})

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

  const activeHabits = useMemo(() => state.habits.filter((habit) => habit.active), [state.habits])

  const weekKeys = useMemo(() => daysAgo(7), [])

  const weekEntries = useMemo(
    () => weekKeys.map((date) => state.dailyEntries[date]).filter(Boolean) as DailyEntry[],
    [weekKeys, state.dailyEntries],
  )

  const weeklyMoodAverage = useMemo(
    () => average(weekEntries.map((entry) => entry.moodIntensity)).toFixed(1),
    [weekEntries],
  )

  const weeklyStressAverage = useMemo(
    () => average(weekEntries.map((entry) => entry.stressLevel)).toFixed(0),
    [weekEntries],
  )

  const weeklyStressSeries = useMemo(
    () => weekKeys.map((date) => state.dailyEntries[date]?.stressLevel ?? 0),
    [weekKeys, state.dailyEntries],
  )

  const stressChart = useMemo(() => {
    const width = 640
    const height = 180
    const padX = 20
    const padY = 16
    const stepX = (width - padX * 2) / Math.max(weeklyStressSeries.length - 1, 1)
    const toY = (value: number) => height - padY - (value / 100) * (height - padY * 2)
    const points = weeklyStressSeries.map((value, index) => {
      const x = padX + index * stepX
      const y = toY(value)
      return { x, y, value, date: weekKeys[index] }
    })
    const line = points.map((point) => `${point.x},${point.y}`).join(' ')
    const area = `${padX},${height - padY} ${line} ${padX + stepX * (points.length - 1)},${height - padY}`
    return { width, height, padX, padY, points, line, area }
  }, [weekKeys, weeklyStressSeries])

  const weeklyHabitCompletion = useMemo(() => {
    if (!activeHabits.length) return 0
    const totalSlots = activeHabits.length * 7
    const completed = weekEntries.reduce((sum, entry) => {
      const count = entry.completedHabits.filter((id) => activeHabits.some((habit) => habit.id === id)).length
      return sum + count
    }, 0)
    return (completed / totalSlots) * 100
  }, [activeHabits, weekEntries])

  const stressAlert = useMemo(() => buildStressAlert(state.dailyEntries), [state.dailyEntries])

  const selectedTest = useMemo(
    () => ASSESSMENT_TESTS.find((test) => test.id === selectedTestId) ?? ASSESSMENT_TESTS[0],
    [selectedTestId],
  )

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

  const addHabit = (event: FormEvent): void => {
    event.preventDefault()
    const name = habitDraft.trim()
    if (!name) return
    if (activeHabits.length >= 5) return

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
    setHabitDraft('')
  }

  const setHabitActive = (habitId: string, active: boolean): void => {
    if (active && activeHabits.length >= 5) return
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

  const weeklyHabitCount = (habitId: string): number =>
    weekEntries.filter((entry) => entry.completedHabits.includes(habitId)).length

  const saveMoodEntry = (): void => {
    setMoodSaved(true)
    window.setTimeout(() => setMoodSaved(false), 1200)
  }

  const submitTest = (): void => {
    const allAnswered = selectedTest.questions.every((q) => answers[q.id] !== undefined)
    if (!allAnswered) return

    const score = selectedTest.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    const maxScore = selectedTest.questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0)
    const interpretation = selectedTest.interpret(score, maxScore)

    setState((prev) => ({
      ...prev,
      testHistory: [
        {
          id: `t-${Date.now()}`,
          testId: selectedTest.id,
          testTitle: selectedTest.title,
          takenAt: new Date().toISOString(),
          score,
          maxScore,
          interpretation,
        },
        ...prev.testHistory,
      ],
    }))

    setAnswers({})
  }

  const insights = useMemo(() => {
    const lines: string[] = []
    const week = weekEntries

    const highHabitDays = week.filter((entry) => entry.completedHabits.length >= 2)
    const lowHabitDays = week.filter((entry) => entry.completedHabits.length < 2)
    if (highHabitDays.length && lowHabitDays.length) {
      const highAvg = average(highHabitDays.map((entry) => entry.moodIntensity))
      const lowAvg = average(lowHabitDays.map((entry) => entry.moodIntensity))
      if (highAvg > lowAvg + 0.3) {
        lines.push('You feel better on days you complete more habits.')
      }
    }

    const midWeekStress = average(
      week.filter((entry) => {
        const day = new Date(entry.date).getDay()
        return day >= 2 && day <= 4
      }).map((entry) => entry.stressLevel),
    )
    const weekOverallStress = average(week.map((entry) => entry.stressLevel))
    if (midWeekStress > weekOverallStress + 5) {
      lines.push('Your stress appears to rise in the middle of the week.')
    }

    lines.push(`Your average mood this week: ${weeklyMoodAverage}`)

    if (activeHabits.length) {
      const topHabit = [...activeHabits].sort((a, b) => weeklyHabitCount(b.id) - weeklyHabitCount(a.id))[0]
      lines.push(`Your strongest routine this week is "${topHabit.name}".`)
    }

    return lines
  }, [activeHabits, weekEntries, weeklyMoodAverage])

  if (view === 'landing') {
    return (
      <div className={`app theme-${state.theme}`}>
        <div className="landing-top-actions">
          <button className="ghost" onClick={toggleTheme}>
            {state.theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button className="primary" onClick={() => setView('dashboard')}>
            Open App
          </button>
        </div>
        <LandingPage onLaunch={() => setView('dashboard')} />
      </div>
    )
  }

  return (
    <div className={`app theme-${state.theme} page-enter`}>
      <header className="hero card">
        <div>
          <p className="eyebrow">Akshayom Dashboard</p>
          <h1>Personal Inner Operating System</h1>
          <p className="subtitle">{formatLongDate(today)}</p>
        </div>
        <div className="hero-actions">
          <button className="ghost" onClick={() => setView('landing')}>
            Landing
          </button>
          <button className="ghost" onClick={toggleTheme}>
            {state.theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {stressAlert && <div className="alert">{stressAlert}</div>}

      {activeTab === 'dashboard' && (
        <section className="grid">
          <article className="card">
            <h2>Quick mood</h2>
            <div className="mood-row">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  className={todayEntry.moodEmoji === mood ? 'emoji active' : 'emoji'}
                  onClick={() => updateTodayEntry({ moodEmoji: mood })}
                >
                  {mood}
                </button>
              ))}
            </div>
            <label>Mood intensity: {todayEntry.moodIntensity}/10</label>
            <input
              type="range"
              min={1}
              max={10}
              value={todayEntry.moodIntensity}
              onChange={(event) => updateTodayEntry({ moodIntensity: Number(event.target.value) })}
            />
          </article>

          <article className="card">
            <h2>Daily rating</h2>
            <label>Today score: {todayEntry.dailyRating}/10</label>
            <input
              type="range"
              min={0}
              max={10}
              value={todayEntry.dailyRating}
              onChange={(event) => updateTodayEntry({ dailyRating: Number(event.target.value) })}
            />
            <h3>Stress</h3>
            <label>{todayEntry.stressLevel}/100</label>
            <input
              type="range"
              min={0}
              max={100}
              value={todayEntry.stressLevel}
              onChange={(event) => updateTodayEntry({ stressLevel: Number(event.target.value) })}
            />
          </article>

          <article className="card">
            <h2>Quick habits</h2>
            <div className="list">
              {activeHabits.map((habit) => (
                <label key={habit.id} className="check">
                  <input
                    type="checkbox"
                    checked={todayEntry.completedHabits.includes(habit.id)}
                    onChange={() => toggleHabitToday(habit.id)}
                  />
                  {habit.name}
                </label>
              ))}
              {!activeHabits.length && <p className="muted">Add habits from the Habits tab.</p>}
            </div>
          </article>

          <article className="card full">
            <h2>Reflection note</h2>
            <textarea
              rows={4}
              placeholder="Add reflection note"
              value={todayEntry.reflectionNote}
              onChange={(event) => updateTodayEntry({ reflectionNote: event.target.value })}
            />
          </article>
        </section>
      )}

      {activeTab === 'mood' && (
        <section className="grid">
          <article className="card">
            <h2>Track today mood</h2>
            <div className="mood-row">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  className={todayEntry.moodEmoji === mood ? 'emoji active' : 'emoji'}
                  onClick={() => updateTodayEntry({ moodEmoji: mood })}
                >
                  {mood}
                </button>
              ))}
            </div>
            <label>Intensity: {todayEntry.moodIntensity}/10</label>
            <input
              type="range"
              min={1}
              max={10}
              value={todayEntry.moodIntensity}
              onChange={(event) => updateTodayEntry({ moodIntensity: Number(event.target.value) })}
            />
            <p>Tags</p>
            <div className="chips">
              {moodTags.map((tag) => (
                <button
                  key={tag}
                  className={todayEntry.moodTags.includes(tag) ? 'chip active' : 'chip'}
                  onClick={() => toggleMoodTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button className="primary" onClick={saveMoodEntry}>
              Save daily entry
            </button>
            {moodSaved && <p className="ok">Mood entry saved.</p>}
          </article>

          <article className="card">
            <h2>Weekly mood average</h2>
            <p className="metric">{weeklyMoodAverage}</p>
            <p className="muted">Based on the past 7 days.</p>
          </article>

          <article className="card full">
            <h2>Calendar view</h2>
            <div className="calendar-grid">
              {daysAgo(28).map((date) => {
                const entry = state.dailyEntries[date]
                return (
                  <div key={date} className="calendar-cell">
                    <small>{date.slice(5)}</small>
                    <strong>{entry ? entry.moodEmoji : '·'}</strong>
                    <small>{entry ? `${entry.moodIntensity}/10` : '--'}</small>
                  </div>
                )
              })}
            </div>
          </article>
        </section>
      )}

      {activeTab === 'habits' && (
        <section className="grid">
          <article className="card">
            <h2>Active habits (max 5)</h2>
            <form onSubmit={addHabit} className="row">
              <input
                value={habitDraft}
                onChange={(event) => setHabitDraft(event.target.value)}
                placeholder="New habit"
              />
              <button className="primary" type="submit" disabled={activeHabits.length >= 5}>
                Add
              </button>
            </form>
            {activeHabits.length >= 5 && <p className="muted">Limit reached. Deactivate one to add another.</p>}
          </article>

          <article className="card full">
            <h2>Habit board</h2>
            <div className="list">
              {state.habits.map((habit) => (
                <div key={habit.id} className="habit-row">
                  <div>
                    <strong>{habit.name}</strong>
                    <p className="muted">
                      Streak: {habitStreak(habit.id)} days | Weekly: {weeklyHabitCount(habit.id)}/7
                    </p>
                  </div>
                  <button
                    className="ghost"
                    onClick={() => setHabitActive(habit.id, !habit.active)}
                    disabled={!habit.active && activeHabits.length >= 5}
                  >
                    {habit.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h2>Completion percentage</h2>
            <p className="metric">{asPercent(weeklyHabitCompletion)}</p>
            <p className="muted">Across active habits this week.</p>
          </article>
        </section>
      )}

      {activeTab === 'stress' && (
        <section className="grid">
          <article className="card">
            <h2>Daily stress tracking</h2>
            <label>Stress level: {todayEntry.stressLevel}/100</label>
            <input
              type="range"
              min={0}
              max={100}
              value={todayEntry.stressLevel}
              onChange={(event) => updateTodayEntry({ stressLevel: Number(event.target.value) })}
            />
            <label>Trigger</label>
            <select
              value={todayEntry.stressTrigger}
              onChange={(event) => updateTodayEntry({ stressTrigger: event.target.value })}
            >
              <option value="">Select trigger</option>
              {stressTriggers.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {trigger}
                </option>
              ))}
            </select>
          </article>

          <article className="card full">
            <h2>Weekly stress graph</h2>
            <div className="chart-wrap">
              <svg
                className="stress-chart"
                viewBox={`0 0 ${stressChart.width} ${stressChart.height}`}
                role="img"
                aria-label="Weekly stress line chart"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="stressArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
                  </linearGradient>
                </defs>
                <line
                  x1={stressChart.padX}
                  x2={stressChart.width - stressChart.padX}
                  y1={stressChart.height - stressChart.padY}
                  y2={stressChart.height - stressChart.padY}
                  className="chart-axis"
                />
                <line
                  x1={stressChart.padX}
                  x2={stressChart.width - stressChart.padX}
                  y1={stressChart.height / 2}
                  y2={stressChart.height / 2}
                  className="chart-grid"
                />
                <polygon points={stressChart.area} className="chart-area" />
                <polyline points={stressChart.line} className="chart-line" />
                {stressChart.points.map((point) => (
                  <circle
                    key={point.date}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    className="chart-point"
                    aria-label={`${point.date} stress ${point.value}`}
                  />
                ))}
              </svg>
              <div className="chart-labels">
                {weekKeys.map((date) => (
                  <small key={date}>{date.slice(5)}</small>
                ))}
              </div>
            </div>
            <p className="muted">Weekly average stress: {weeklyStressAverage}/100</p>
          </article>
        </section>
      )}

      {activeTab === 'tests' && (
        <section className="grid">
          <article className="card">
            <h2>Self-assessment tests</h2>
            <select
              value={selectedTestId}
              onChange={(event) => {
                setSelectedTestId(event.target.value)
                setAnswers({})
              }}
            >
              {ASSESSMENT_TESTS.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.title}
                </option>
              ))}
            </select>
            <p className="muted">{selectedTest.description}</p>

            <div className="test-list">
              {selectedTest.questions.map((question) => (
                <div key={question.id} className="question">
                  <p>{question.prompt}</p>
                  <div className="chips">
                    {question.options.map((option) => (
                      <button
                        key={option.label}
                        className={answers[question.id] === option.score ? 'chip active' : 'chip'}
                        onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.score }))}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="primary"
              onClick={submitTest}
              disabled={!selectedTest.questions.every((q) => answers[q.id] !== undefined)}
            >
              Score test
            </button>
          </article>

          <article className="card full">
            <h2>Test history</h2>
            <div className="list">
              {state.testHistory.map((result) => (
                <div key={result.id} className="history-row">
                  <div>
                    <strong>{result.testTitle}</strong>
                    <p className="muted">{new Date(result.takenAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>
                      {result.score}/{result.maxScore}
                    </p>
                    <p className="muted">{result.interpretation}</p>
                  </div>
                </div>
              ))}
              {!state.testHistory.length && <p className="muted">No tests taken yet.</p>}
            </div>
          </article>
        </section>
      )}

      {activeTab === 'insights' && (
        <section className="grid">
          <article className="card full">
            <h2>Insights engine</h2>
            <div className="list">
              {insights.map((line) => (
                <p key={line}>• {line}</p>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeTab === 'future' && (
        <section className="grid">
          <article className="card">
            <h2>Auth placeholder</h2>
            <p className="muted">Prepare route and state boundary for email/social login.</p>
          </article>
          <article className="card">
            <h2>Cloud sync placeholder</h2>
            <p className="muted">Ready for remote profile store and multi-device sync.</p>
          </article>
          <article className="card">
            <h2>AI reflection placeholder</h2>
            <p className="muted">Reserved for guided reflection and narrative feedback.</p>
          </article>
          <article className="card">
            <h2>Pro model placeholder</h2>
            <p className="muted">Feature gating and subscription lifecycle architecture slot.</p>
          </article>
        </section>
      )}
    </div>
  )
}

export default App
