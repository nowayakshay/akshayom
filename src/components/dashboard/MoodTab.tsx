import { useMemo, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { daysAgo } from '../../utils/date'
import { average } from '../../utils/analysis'
import { MoodTag, DailyEntry } from '../../types'

const moodOptions = ['😞', '🙁', '😐', '🙂', '😄']
const moodTags: MoodTag[] = ['work', 'family', 'health', 'unknown']

export function MoodTab() {
  const { state, todayEntry, updateTodayEntry, toggleMoodTag } = useAppContext()
  const [moodSaved, setMoodSaved] = useState(false)

  const weekKeys = useMemo(() => daysAgo(7), [])
  const weekEntries = useMemo(
    () => weekKeys.map((date) => state.dailyEntries[date]).filter(Boolean) as DailyEntry[],
    [weekKeys, state.dailyEntries],
  )

  const weeklyMoodAverage = useMemo(
    () => average(weekEntries.map((entry) => entry.moodIntensity)).toFixed(1),
    [weekEntries],
  )

  const saveMoodEntry = (): void => {
    setMoodSaved(true)
    window.setTimeout(() => setMoodSaved(false), 1200)
  }

  return (
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
  )
}
