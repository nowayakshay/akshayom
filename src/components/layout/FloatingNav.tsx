import { motion } from 'framer-motion'
import { Magnetic } from '../ui/Magnetic'
import { TabKey } from '../../types'
import { LayoutDashboard, Heart, CheckCircle2, AlertCircle, BarChart3, Lightbulb, GraduationCap } from 'lucide-react'

interface FloatingNavProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  tabs: { key: TabKey; label: string }[]
}

const getIcon = (key: TabKey) => {
  switch (key) {
    case 'dashboard': return <LayoutDashboard size={18} />
    case 'mood': return <Heart size={18} />
    case 'habits': return <CheckCircle2 size={18} />
    case 'stress': return <AlertCircle size={18} />
    case 'tests': return <GraduationCap size={18} />
    case 'insights': return <Lightbulb size={18} />
    case 'future': return <BarChart3 size={18} />
    default: return null
  }
}

export function FloatingNav({ activeTab, onTabChange, tabs }: FloatingNavProps) {
  return (
    <div className="floating-nav-container">
      <nav className="floating-nav">
        {tabs.map((tab) => (
          <Magnetic key={tab.key} strength={0.2}>
            <button
              className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {getIcon(tab.key)}
              <span className="label">{tab.label}</span>
            </button>
          </Magnetic>
        ))}
      </nav>
    </div>
  )
}
