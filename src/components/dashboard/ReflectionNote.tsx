import { useState, useMemo } from 'react'
import { SpotlightCard } from '../ui/SpotlightCard'
import { useAppContext } from '../../context/AppContext'

const PROMPTS = [
  "What was the highlight of your day?",
  "What's one thing you're grateful for today?",
  "Did you face any challenges? How did you handle them?",
  "What did you learn about yourself today?",
  "One thing you'd like to do differently tomorrow?",
  "Who made your day better today?",
  "What was your biggest win, however small?"
]

export function ReflectionNote() {
  const { todayEntry, updateTodayEntry } = useAppContext()
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length))

  const currentPrompt = useMemo(() => PROMPTS[promptIdx], [promptIdx])

  const nextPrompt = () => {
    setPromptIdx((prev) => (prev + 1) % PROMPTS.length)
  }

  return (
    <SpotlightCard className="span-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2>Daily Reflection</h2>
        <button 
          className="ghost" 
          onClick={nextPrompt}
          style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '8px' }}
        >
          New Prompt
        </button>
      </div>
      
      <p className="muted" style={{ marginBottom: '12px', fontSize: '0.9rem', fontStyle: 'italic' }}>
        "{currentPrompt}"
      </p>

      <textarea
        rows={4}
        placeholder="Capture your thoughts..."
        value={todayEntry.reflectionNote}
        onChange={(event) => updateTodayEntry({ reflectionNote: event.target.value })}
        style={{ marginTop: '0' }}
      />
    </SpotlightCard>
  )
}
