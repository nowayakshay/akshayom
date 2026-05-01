import { useMemo } from 'react'
import { SpotlightCard } from '../ui/SpotlightCard'
import { useAppContext } from '../../context/AppContext'
import { Plus, Check } from 'lucide-react'

export function HabitQuickList() {
  const { state, todayEntry, toggleHabitToday } = useAppContext()

  const activeHabits = useMemo(() => state.habits.filter((habit) => habit.active), [state.habits])

  return (
    <SpotlightCard className="span-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ marginBottom: 0 }}>Your Habits Today</h2>
        <button className="primary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem' }}>
          <Plus size={16} style={{ marginRight: '4px' }} /> New Habit
        </button>
      </div>

      <div className="habit-list">
        {activeHabits.map((habit) => {
          const isDone = todayEntry.completedHabits.includes(habit.id)
          return (
            <div key={habit.id} className="habit-item">
              <div className="habit-info">
                <div className="habit-name">
                  {habit.name}
                  <span className="tag">Wellness</span>
                </div>
                <div className="habit-meta">Daily · 8:00 AM · {isDone ? 'Complete' : 'Pending'}</div>
              </div>
              <button 
                className={`emoji ${isDone ? 'active' : ''}`}
                onClick={() => toggleHabitToday(habit.id)}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  border: isDone ? 'none' : '2px solid var(--border)',
                  background: isDone ? 'var(--ok)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {isDone && <Check size={16} color="white" />}
              </button>
            </div>
          )
        })}
      </div>
    </SpotlightCard>
  )
}
