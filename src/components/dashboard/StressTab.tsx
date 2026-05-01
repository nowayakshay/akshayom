import { useMemo } from 'react'
import { useAppContext } from '../../context/AppContext'
import { daysAgo } from '../../utils/date'
import { average } from '../../utils/analysis'
import { DailyEntry } from '../../types'

const stressTriggers = ['Workload', 'Sleep', 'Health', 'Relationships', 'Finances', 'Unclear']

export function StressTab() {
  const { state, todayEntry, updateTodayEntry } = useAppContext()

  const weekKeys = useMemo(() => daysAgo(7), [])
  const weekEntries = useMemo(
    () => weekKeys.map((date) => state.dailyEntries[date]).filter(Boolean) as DailyEntry[],
    [weekKeys, state.dailyEntries],
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

  return (
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
  )
}
