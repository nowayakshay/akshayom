import { SpotlightCard } from '../ui/SpotlightCard'
import { useAppContext } from '../../context/AppContext'
import { Droplets, BookOpen, Heart } from 'lucide-react'

export function DailyRating() {
  const { todayEntry, updateTodayEntry } = useAppContext()

  return (
    <SpotlightCard className="span-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ marginBottom: 0 }}>Daily Overview</h2>
        <button className="ghost" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>View Details</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
        <div className="stat-row">
          <div style={{ padding: '8px', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '50%', color: 'var(--accent)' }}>
            <Droplets size={20} />
          </div>
          <div className="stat-bar-container">
            <div className="stat-bar" style={{ width: '60%' }}></div>
          </div>
          <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>60%</span>
        </div>

        <div className="stat-row">
          <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: '#6366f1' }}>
            <BookOpen size={20} />
          </div>
          <div className="stat-bar-container">
            <div className="stat-bar" style={{ width: '30%', background: '#6366f1' }}></div>
          </div>
          <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>30%</span>
        </div>

        <div className="stat-row">
          <div style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '50%', color: '#f43f5e' }}>
            <Heart size={20} />
          </div>
          <div className="stat-bar-container">
            <div className="stat-bar" style={{ width: '85%', background: '#f43f5e' }}></div>
          </div>
          <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>85%</span>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <label className="muted" style={{ display: 'block', marginBottom: '8px' }}>Global Satisfaction Rating: {todayEntry.dailyRating}/10</label>
        <input
          type="range"
          min={1}
          max={10}
          value={todayEntry.dailyRating}
          onChange={(event) => updateTodayEntry({ dailyRating: Number(event.target.value) })}
        />
      </div>
    </SpotlightCard>
  )
}
