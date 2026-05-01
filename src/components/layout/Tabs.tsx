import { TabKey } from '../../types'

interface TabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  tabs: { key: TabKey; label: string }[]
}

export function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? 'tab active' : 'tab'}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
