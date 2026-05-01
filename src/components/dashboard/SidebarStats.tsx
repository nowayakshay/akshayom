import { motion } from 'framer-motion'
import { SpotlightCard } from '../ui/SpotlightCard'
import { Trophy, Clock, Flame } from 'lucide-react'

export function SidebarStats() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SpotlightCard className="quote-card">
        <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.8 }}>Quote of the Day</h4>
        <p>"Small steps every day lead to big results."</p>
        <span>— James Clear</span>
      </SpotlightCard>

      <SpotlightCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', margin: 0 }}>Upcoming</h2>
          <span className="muted" style={{ fontSize: '0.75rem' }}>View all</span>
        </div>
        <div className="list" style={{ gap: '12px' }}>
          <div className="habit-item" style={{ padding: '12px', marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: 'var(--accent)' }}><Clock size={16} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Meditation</div>
            </div>
            <div className="muted" style={{ fontSize: '0.75rem' }}>9:00 AM</div>
          </div>
          <div className="habit-item" style={{ padding: '12px', marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: 'var(--accent)' }}><Clock size={16} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>30 min Workout</div>
            </div>
            <div className="muted" style={{ fontSize: '0.75rem' }}>6:00 PM</div>
          </div>
        </div>
      </SpotlightCard>

      <SpotlightCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', margin: 0 }}>Achievements</h2>
          <span className="muted" style={{ fontSize: '0.75rem' }}>View all</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div className="mini-stat-card" style={{ padding: '12px 4px' }}>
             <Trophy size={18} color="var(--accent)" style={{ marginBottom: '4px' }} />
             <div style={{ fontSize: '0.6rem', fontWeight: 600 }}>Champ</div>
          </div>
          <div className="mini-stat-card" style={{ padding: '12px 4px' }}>
             <Flame size={18} color="#f43f5e" style={{ marginBottom: '4px' }} />
             <div style={{ fontSize: '0.6rem', fontWeight: 600 }}>Streak</div>
          </div>
          <div className="mini-stat-card" style={{ padding: '12px 4px' }}>
             <Trophy size={18} color="#6366f1" style={{ marginBottom: '4px' }} />
             <div style={{ fontSize: '0.6rem', fontWeight: 600 }}>Early</div>
          </div>
        </div>
      </SpotlightCard>

      <div className="stat-card" style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(124, 58, 237, 0.2)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ background: '#7c3aed', padding: '10px', borderRadius: '50%', color: 'white' }}>
          <Flame size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>7 Day Streak</div>
          <div className="muted" style={{ fontSize: '0.75rem' }}>Keep going! You're on your way.</div>
        </div>
      </div>
    </div>
  )
}
