import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { daysAgo } from '../../utils/date'
import { average } from '../../utils/analysis'
import { generateInsights } from '../../utils/insights'
import { DailyEntry } from '../../types'

export function InsightsTab() {
  const { state } = useAppContext()

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

  const insights = useMemo(() => 
    generateInsights(weekEntries, activeHabits, weeklyMoodAverage), 
    [activeHabits, weekEntries, weeklyMoodAverage]
  )

  return (
    <section className="grid">
      <article className="card full">
        <h2>Intelligence Engine</h2>
        <div className="list" style={{ gap: '16px' }}>
          {insights.map((insight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`insight-item ${insight.type}`}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: insight.type === 'positive' ? 'rgba(5, 150, 105, 0.08)' : 
                           insight.type === 'warning' ? 'rgba(225, 29, 72, 0.08)' : 
                           'var(--surface-2)',
                borderLeft: `4px solid ${
                  insight.type === 'positive' ? 'var(--ok)' : 
                  insight.type === 'warning' ? 'var(--danger)' : 
                  'var(--accent)'
                }`
              }}
            >
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                {insight.type === 'positive' ? '✨ ' : 
                 insight.type === 'warning' ? '⚠️ ' : 
                 '💡 '}
                {insight.text}
              </p>
            </motion.div>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Weekly Correlation</h2>
        <p className="muted">We analyze your habits, stress, and mood to find patterns that help you grow.</p>
        <div style={{ marginTop: '20px' }}>
          <div className="history-row" style={{ marginBottom: '10px' }}>
            <span>Avg Mood</span>
            <strong>{weeklyMoodAverage}/10</strong>
          </div>
          <div className="history-row">
            <span>Avg Stress</span>
            <strong>{average(weekEntries.map(e => e.stressLevel)).toFixed(0)}/100</strong>
          </div>
        </div>
      </article>
    </section>
  )
}
