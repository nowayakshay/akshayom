import { motion } from 'framer-motion'
import { SpotlightCard } from '../ui/SpotlightCard'
import { ArrowRight, Brain, Zap, Shield, Sparkles } from 'lucide-react'

interface LandingPageProps {
  onLaunch: () => void
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="landing">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="h-font" style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Personal Intelligence
        </div>
        <h1 className="hero-title">Inner Operating <br />System</h1>
        <p className="hero-subtitle muted">
          The high-end analytical hub for your mind. Track habits, monitor stress, 
          and decode behavioral patterns with executive precision.
        </p>
        
        <button className="primary" onClick={onLaunch} style={{ padding: '20px 40px', fontSize: '1.1rem' }}>
          Launch System <ArrowRight style={{ marginLeft: '12px', verticalAlign: 'middle' }} size={20} />
        </button>
      </motion.div>

      <div className="bento-grid-landing">
        <SpotlightCard className="span-2">
          <Brain size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3>Cognitive Tracking</h3>
          <p className="muted">Log mood intensity and emotional tags to build a detailed landscape of your mental state over time.</p>
        </SpotlightCard>
        
        <SpotlightCard>
          <Zap size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3>Habit Momentum</h3>
          <p className="muted">Build unbreakable routines with integrated streak tracking and behavioral insights.</p>
        </SpotlightCard>

        <SpotlightCard>
          <Shield size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3>Privacy First</h3>
          <p className="muted">Your data never leaves your browser. Local-first architecture ensures total sovereignty.</p>
        </SpotlightCard>

        <SpotlightCard className="span-2">
          <Sparkles size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3>AI-Powered Insights</h3>
          <p className="muted">Discover hidden correlations between your stress levels, sleep, and productivity with our offline intelligence engine.</p>
        </SpotlightCard>
      </div>
    </div>
  )
}
