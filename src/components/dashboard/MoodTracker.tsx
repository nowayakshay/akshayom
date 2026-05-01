import { SpotlightCard } from '../ui/SpotlightCard'
import { useAppContext } from '../../context/AppContext'

const moodOptions = ['😞', '🙁', '😐', '🙂', '😄']

export function MoodTracker() {
  const { todayEntry, updateTodayEntry } = useAppContext()

  return (
    <SpotlightCard className="full-height">
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
    </SpotlightCard>
  )
}
