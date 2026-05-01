import { useAppContext } from '../../context/AppContext'

export function FutureTab() {
  const { state, setState } = useAppContext()

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `akshayom-backup-${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)
        // Basic validation
        if (parsed.dailyEntries && parsed.habits) {
          setState(parsed)
          alert('Data imported successfully!')
        } else {
          alert('Invalid backup file.')
        }
      } catch {
        alert('Error parsing backup file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="grid">
      <article className="card">
        <h2>Data Management</h2>
        <p className="muted" style={{ marginBottom: '16px' }}>Export your data for backup or import a previous session.</p>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button className="primary" onClick={exportData}>Export JSON Backup</button>
          <label className="ghost" style={{ textAlign: 'center', cursor: 'pointer', marginTop: '0' }}>
            Import Backup
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </article>

      <article className="card">
        <h2>Cloud Sync</h2>
        <p className="muted">Ready for remote profile store and multi-device sync (Coming Soon).</p>
      </article>
      
      <article className="card">
        <h2>AI Reflection</h2>
        <p className="muted">Reserved for guided reflection and narrative feedback (Coming Soon).</p>
      </article>
      
      <article className="card">
        <h2>Pro Model</h2>
        <p className="muted">Feature gating and subscription lifecycle architecture slot (Coming Soon).</p>
      </article>
    </section>
  )
}
