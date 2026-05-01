import { DailyEntry, Habit } from '../types'
import { average } from './analysis'

export interface InsightLine {
  text: string
  type: 'positive' | 'neutral' | 'warning'
}

export const generateInsights = (
  entries: DailyEntry[],
  habits: Habit[],
  moodAverage: string
): InsightLine[] => {
  const lines: InsightLine[] = []
  
  if (entries.length < 3) {
    return [{ text: 'Keep tracking to unlock deeper behavioral insights.', type: 'neutral' }]
  }

  // 1. Mood vs Habits Correlation
  const highHabitDays = entries.filter((entry) => entry.completedHabits.length >= 2)
  const lowHabitDays = entries.filter((entry) => entry.completedHabits.length < 2)
  
  if (highHabitDays.length && lowHabitDays.length) {
    const highAvg = average(highHabitDays.map((entry) => entry.moodIntensity))
    const lowAvg = average(lowHabitDays.map((entry) => entry.moodIntensity))
    
    if (highAvg > lowAvg + 0.5) {
      lines.push({ 
        text: `Your mood is significantly higher (${highAvg.toFixed(1)}) on days you stick to your routines.`, 
        type: 'positive' 
      })
    }
  }

  // 2. Stress Patterns
  const midWeekStress = average(
    entries.filter((entry) => {
      const day = new Date(entry.date).getDay()
      return day >= 2 && day <= 4
    }).map((entry) => entry.stressLevel)
  )
  const weekOverallStress = average(entries.map((entry) => entry.stressLevel))
  
  if (midWeekStress > weekOverallStress + 10) {
    lines.push({ 
      text: 'Your stress levels peak mid-week. Consider blocking "deep work" time to reduce overwhelm.', 
      type: 'warning' 
    })
  }

  // 3. Habit Momentum
  if (habits.length) {
    const habitStats = habits.map(h => ({
      name: h.name,
      count: entries.filter(e => e.completedHabits.includes(h.id)).length
    })).sort((a, b) => b.count - a.count)

    const topHabit = habitStats[0]
    if (topHabit && topHabit.count >= 5) {
      lines.push({ 
        text: `Incredible consistency with "${topHabit.name}" this week!`, 
        type: 'positive' 
      })
    }
  }

  // 4. Stress vs Mood Inverse Correlation
  const highStressDays = entries.filter(e => e.stressLevel > 60)
  if (highStressDays.length > 0) {
    const highStressMood = average(highStressDays.map(e => e.moodIntensity))
    if (highStressMood < Number(moodAverage) - 1) {
      lines.push({ 
        text: 'High stress is noticeably impacting your mood. Prioritize recovery today.', 
        type: 'warning' 
      })
    }
  }

  // Fallback
  if (lines.length === 0) {
    lines.push({ text: `Your average mood is stable at ${moodAverage} this week.`, type: 'neutral' })
  }

  return lines
}
