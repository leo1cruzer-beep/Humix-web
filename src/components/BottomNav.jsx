const TABS = [
  { id: 'home', icon: '⊞', label: 'Home' },
  { id: 'flow', icon: '⚡', label: 'Flow' },
  { id: 'clarity', icon: '◈', label: 'Clarity' },
  { id: 'soul', icon: '◉', label: 'Soul' },
  { id: 'voice', icon: '◎', label: 'Voice' },
]

const COLORS = { flow: '#2563EB', clarity: '#059669', soul: '#7C3AED', voice: '#EA580C', home: '#1A1916' }

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => {
        const active = activeTab === tab.id
        const color = COLORS[tab.id]
        return (
          <button
            key={tab.id}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={active ? { '--active-color': color } : {}}
          >
            <span
              className="nav-icon"
              style={{
                fontSize: 24,
                color: active ? color : '#9B9890',
                fontStyle: 'normal',
              }}
            >
              {tab.id === 'home' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
                    fill={active ? color : '#9B9890'} />
                </svg>
              )}
              {tab.id === 'flow' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z" fill={active ? color : '#9B9890'} />
                </svg>
              )}
              {tab.id === 'clarity' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill={active ? color : '#9B9890'} />
                </svg>
              )}
              {tab.id === 'soul' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={active ? color : '#9B9890'} />
                </svg>
              )}
              {tab.id === 'voice' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"
                    fill={active ? color : '#9B9890'} />
                </svg>
              )}
            </span>
            <span className="nav-label" style={{ color: active ? color : '#9B9890' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
