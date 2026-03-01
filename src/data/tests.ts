import type { AssessmentTest } from '../types'

const scaleOptions = [
  { label: 'Never', score: 0 },
  { label: 'Rarely', score: 1 },
  { label: 'Sometimes', score: 2 },
  { label: 'Often', score: 3 },
]

export const ASSESSMENT_TESTS: AssessmentTest[] = [
  {
    id: 'stress-check',
    title: 'Stress Check',
    description: 'Understand current stress load from daily pressure signals.',
    questions: [
      { id: 's1', prompt: 'I feel mentally overloaded during the day.', options: scaleOptions },
      { id: 's2', prompt: 'I find it difficult to switch off after work.', options: scaleOptions },
      { id: 's3', prompt: 'I notice physical tension (jaw, neck, shoulders).', options: scaleOptions },
      { id: 's4', prompt: 'Small setbacks feel harder than usual.', options: scaleOptions },
      { id: 's5', prompt: 'My sleep quality has dropped this week.', options: scaleOptions },
      { id: 's6', prompt: 'I skip breaks because I feel behind.', options: scaleOptions },
    ],
    interpret: (score, maxScore) => {
      const ratio = score / maxScore
      if (ratio < 0.34) return 'Low stress: your current load appears manageable.'
      if (ratio < 0.67) return 'Moderate stress: recovery habits may help this week.'
      return 'High stress: reduce load and add recovery time intentionally.'
    },
  },
  {
    id: 'burnout-check',
    title: 'Burnout Check',
    description: 'Check for exhaustion and emotional detachment patterns.',
    questions: [
      { id: 'b1', prompt: 'I wake up already feeling tired.', options: scaleOptions },
      { id: 'b2', prompt: 'I feel less motivated by tasks that used to matter.', options: scaleOptions },
      { id: 'b3', prompt: 'I feel emotionally drained after normal days.', options: scaleOptions },
      { id: 'b4', prompt: 'I avoid responsibilities because of low energy.', options: scaleOptions },
      { id: 'b5', prompt: 'I feel cynical or detached from my goals.', options: scaleOptions },
      { id: 'b6', prompt: 'Rest does not fully reset me lately.', options: scaleOptions },
      { id: 'b7', prompt: 'I feel constantly behind, no matter what I finish.', options: scaleOptions },
    ],
    interpret: (score, maxScore) => {
      const ratio = score / maxScore
      if (ratio < 0.34) return 'Low burnout risk: energy and engagement look stable.'
      if (ratio < 0.67) return 'Rising burnout risk: adjust pace and boundaries now.'
      return 'High burnout risk: prioritize rest and support immediately.'
    },
  },
  {
    id: 'mental-clarity',
    title: 'Mental Clarity Check',
    description: 'Measure focus, decision confidence, and cognitive clarity.',
    questions: [
      { id: 'm1', prompt: 'I can focus on one important task without drifting.', options: scaleOptions },
      { id: 'm2', prompt: 'My thinking feels clear rather than foggy.', options: scaleOptions },
      { id: 'm3', prompt: 'I make decisions without excessive second-guessing.', options: scaleOptions },
      { id: 'm4', prompt: 'I can prioritize effectively under pressure.', options: scaleOptions },
      { id: 'm5', prompt: 'My attention remains stable throughout the day.', options: scaleOptions },
    ],
    interpret: (score, maxScore) => {
      const ratio = score / maxScore
      if (ratio < 0.34) return 'Low clarity: simplify commitments and reduce input noise.'
      if (ratio < 0.67) return 'Moderate clarity: momentum is present but uneven.'
      return 'Strong clarity: your focus system is working well this week.'
    },
  },
]
