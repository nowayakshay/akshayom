import { useMemo, useState, FormEvent } from 'react'
import { useAppContext } from '../../context/AppContext'
import { daysAgo } from '../../utils/date'
import { asPercent } from '../../utils/analysis'
import { DailyEntry } from '../../types'

export function HabitsTab() {
  const { state, addHabit, setHabitActive, habitStreak, toggleHabitToday, todayEntry } = useAppContext()
  const [habitDraft, setHabitDraft] = useState('')

  const activeHabits = useMemo(() => state.habits.filter((habit) => habit.active), [state.habits])
  const weekKeys = useMemo(() => daysAgo(7), [])
  const weekEntries = useMemo(
    () => weekKeys.map((date) => state.dailyEntries[date]).filter(Boolean) as DailyEntry[],
    [weekKeys, state.dailyEntries],
  )

  const weeklyHabitCount = (habitId: string): number =>
    weekEntries.filter((entry) => entry.completedHabits.includes(habitId)).length

  const weeklyHabitCompletion = useMemo(() => {
    if (!activeHabits.length) return 0
    const totalSlots = activeHabits.length * 7
    const completed = weekEntries.reduce((sum, entry) => {
      const count = entry.completedHabits.filter((id) => activeHabits.some((habit) => habit.id === id)).length
      return sum + count
    }, 0)
    return (completed / totalSlots) * 100
  }, [activeHabits, weekEntries])

  const handleAddHabit = (event: FormEvent) => {
    event.preventDefault()
    const name = habitDraft.trim()
    if (!name) return
    if (activeHabits.length >= 5) return
    addHabit(name)
    setHabitDraft('')
  }

  return (
    <section className="grid">
      <article className="card">
        <h2>Active habits (max 5)</h2>
        <form onSubmit={handleAddHabit} className="row">
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
  )
}
