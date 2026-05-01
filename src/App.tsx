import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import { useAppContext } from './context/AppContext'
import { LandingPage } from './components/landing/LandingPage'
import { Header } from './components/layout/Header'
import { FloatingNav } from './components/layout/FloatingNav'
import { MoodTracker } from './components/dashboard/MoodTracker'
import { HabitQuickList } from './components/dashboard/HabitQuickList'
import { DailyRating } from './components/dashboard/DailyRating'
import { ReflectionNote } from './components/dashboard/ReflectionNote'
import { SidebarStats } from './components/dashboard/SidebarStats'
import { MoodTab } from './components/dashboard/MoodTab'
import { HabitsTab } from './components/dashboard/HabitsTab'
import { StressTab } from './components/dashboard/StressTab'
import { TestsTab } from './components/dashboard/TestsTab'
import { InsightsTab } from './components/dashboard/InsightsTab'
import { FutureTab } from './components/dashboard/FutureTab'
import { TabKey, ViewKey } from './types'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: 'Home' },
  { key: 'mood', label: 'Mood' },
  { key: 'habits', label: 'Habits' },
  { key: 'stress', label: 'Stress' },
  { key: 'tests', label: 'Tests' },
  { key: 'insights', label: 'Insights' },
  { key: 'future', label: 'Pro' },
]

const pageVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
}

function App() {
  const { state, stressAlert, toggleTheme } = useAppContext()
  const [view, setView] = useState<ViewKey>('landing')
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')

  if (view === 'landing') {
    return (
      <div className={`app theme-${state.theme}`}>
        <div className="landing-top-actions">
          <button className="ghost" onClick={toggleTheme}>
            {state.theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <button className="primary" onClick={() => setView('dashboard')}>
            Enter
          </button>
        </div>
        <LandingPage onLaunch={() => setView('dashboard')} />
      </div>
    )
  }

  return (
    <div className={`app theme-${state.theme}`}>
      <Header onBackToLanding={() => setView('landing')} />

      <main style={{ maxWidth: '1200px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                   {/* Greeting Section */}
                   <div style={{ marginBottom: '8px' }}>
                     <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Good Morning, Akshay 👋</h1>
                     <p className="muted">Let's make today count. You've got 7 habits scheduled.</p>
                   </div>

                   {/* Dashboard Layout - 2:1 on Desktop */}
                   <div className="dashboard-content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                         <DailyRating />
                         <HabitQuickList />
                         <MoodTracker />
                         <ReflectionNote />
                      </div>
                      
                      {/* Secondary Column */}
                      <SidebarStats />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'mood' && <MoodTab />}
            {activeTab === 'habits' && <HabitsTab />}
            {activeTab === 'stress' && <StressTab />}
            {activeTab === 'tests' && <TestsTab />}
            {activeTab === 'insights' && <InsightsTab />}
            {activeTab === 'future' && <FutureTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
    </div>
  )
}

export default App
