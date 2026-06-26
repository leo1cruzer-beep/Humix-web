import { useState, useEffect } from 'react'

const SYSTEMS = [
  { id: 'flow', name: 'FLOW', icon: '⚡', color: '#2563EB', bg: '#EFF6FF', desc: 'AI & Automations', status: '8 active', tab: 'flow' },
  { id: 'clarity', name: 'CLARITY', icon: '◈', color: '#059669', bg: '#ECFDF5', desc: 'Finances', status: '+$247 today', tab: 'clarity' },
  { id: 'soul', name: 'SOUL', icon: '◉', color: '#7C3AED', bg: '#F5F3FF', desc: 'Memory & Growth', status: '127 memories', tab: 'soul' },
  { id: 'voice', name: 'VOICE', icon: '◎', color: '#EA580C', bg: '#FFF7ED', desc: 'Knowledge', status: 'Ask anything', tab: 'voice' },
]

const WHATS_NEW = [
  { title: 'ARIA learned 3 new automations', color: '#2563EB', bg: '#EFF6FF', icon: '⚡' },
  { title: 'Your remittance rate improved', color: '#059669', bg: '#ECFDF5', icon: '💸' },
  { title: 'New memory surfaced from 6 months ago', color: '#7C3AED', bg: '#F5F3FF', icon: '◉' },
  { title: 'Voice: Farm market prices updated', color: '#EA580C', bg: '#FFF7ED', icon: '🌾' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5) return { text: 'Still up?', emoji: '🌙' }
  if (h < 12) return { text: 'Good morning', emoji: '☀️' }
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  if (h < 21) return { text: 'Good evening', emoji: '🌆' }
  return { text: 'Good night', emoji: '🌙' }
}

export default function Home({ userProfile, onTabChange }) {
  const [loaded, setLoaded] = useState(false)
  const greeting = getGreeting()

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 2 }}>
              {greeting.text} {greeting.emoji}
            </p>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
              Your Havro
            </h1>
          </div>
          <button
            onClick={() => onTabChange('profile')}
            style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'var(--text)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {userProfile?.identity?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>

      {/* System cards 2x2 */}
      <div className="section">
        {loaded ? (
          <div className="grid-2">
            {SYSTEMS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onTabChange(s.tab)}
                style={{
                  background: s.bg,
                  borderRadius: 'var(--radius)',
                  padding: 16,
                  border: `1.5px solid ${s.color}22`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  animation: `fadeUp 0.35s ease ${i * 0.07}s both`,
                  display: 'block',
                  width: '100%',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: s.color, marginBottom: 2 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{s.desc}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.color, background: 'white', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>
                  {s.status}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid-2">
            {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius)' }} />)}
          </div>
        )}
      </div>

      {/* What's new */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ padding: '0 20px', marginBottom: 12 }}>What's new ✦</div>
        <div className="h-scroll">
          {WHATS_NEW.map((item, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 200, padding: 14,
              background: item.bg, borderRadius: 'var(--radius)',
              border: `1.5px solid ${item.color}22`,
              animation: `fadeUp 0.35s ease ${i * 0.08}s both`
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: item.color, lineHeight: 1.4 }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Community stat */}
      <div className="section">
        <div className="card" style={{ background: 'var(--text)', color: '#fff', textAlign: 'center', padding: '24px 20px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            15.2M
          </div>
          <div style={{ fontSize: 14, color: '#aaa', lineHeight: 1.5 }}>
            people improving their lives with Havro across 47 countries and 12 languages
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
            {[['47', 'countries'], ['12', 'languages'], ['98%', 'love it']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
