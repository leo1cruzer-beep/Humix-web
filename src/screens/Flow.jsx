import { useState, useRef, useEffect } from 'react'
import { ARIA_RESPONSES, AUTOMATIONS, SERVICES } from '../data'

const COLOR = '#2563EB'
const BG = '#EFF6FF'

const SUGGESTIONS = [
  'Set up morning briefing',
  'Auto-post my content',
  'Track my spending',
  'Connect Google',
]

function getARIAResponse(text) {
  const t = text.toLowerCase()
  if (t.includes('automat') || t.includes('set up') || t.includes('configure')) {
    return pick(ARIA_RESPONSES.automation)
  }
  if (t.includes('social') || t.includes('instagram') || t.includes('twitter') || t.includes('post')) {
    return pick(ARIA_RESPONSES.social)
  }
  if (t.includes('financ') || t.includes('spend') || t.includes('money') || t.includes('saving') || t.includes('budget')) {
    return pick(ARIA_RESPONSES.finance)
  }
  if (t.includes('task') || t.includes('notion') || t.includes('slack') || t.includes('email') || t.includes('product')) {
    return pick(ARIA_RESPONSES.productivity)
  }
  return pick(ARIA_RESPONSES.default)
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const CATEGORIES = ['All', 'Social', 'Finance', 'Productivity', 'Personal']

// ── FlowHome ──────────────────────────────────────────────────────────────
function FlowHome({ onNav }) {
  const active = AUTOMATIONS.filter(a => a.active)
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <h1 style={{ color: COLOR }}>FLOW</h1>
        </div>
        <p>AI automations & connections</p>
      </div>

      <div className="section">
        <button className="btn btn-full" onClick={() => onNav('chat')}
          style={{ background: COLOR, color: '#fff', fontSize: 16, padding: '16px 24px', borderRadius: 'var(--radius)' }}>
          💬 Chat with ARIA
        </button>
      </div>

      <div className="section">
        <div className="stat-row">
          {[['8', 'Active'], ['3', 'Services'], ['156', 'Tasks done']].map(([n,l]) => (
            <div key={l} className="stat-box">
              <div className="stat-num" style={{ color: COLOR }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Active Automations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {active.map(a => (
            <div key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Ran {a.runs} times</div>
              </div>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#22c55e', boxShadow: '0 0 6px #22c55e88' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => onNav('automations')}>⚙️ Automations</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => onNav('connect')}>🔗 Connect</button>
        </div>
      </div>
    </div>
  )
}

// ── FlowChat ──────────────────────────────────────────────────────────────
function FlowChat({ onBack }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: pick(ARIA_RESPONSES.greeting) }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text) => {
    if (!text.trim()) return
    const userMsg = text.trim()
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', text: getARIAResponse(userMsg) }])
    }, 900 + Math.random() * 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ padding: '52px 20px 12px', background: BG, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: COLOR }}>ARIA</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>AI Automation Assistant</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
      </div>

      {/* Suggestions */}
      <div className="h-scroll" style={{ padding: '10px 16px' }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 99,
            border: `1.5px solid ${COLOR}44`, background: BG,
            color: COLOR, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-body)', whiteSpace: 'nowrap'
          }}>{s}</button>
        ))}
      </div>

      <div className="chat-container" style={{ flex: 1, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
            style={m.role === 'ai' ? { borderLeft: `3px solid ${COLOR}` } : { background: COLOR }}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="bubble bubble-ai" style={{ borderLeft: `3px solid ${COLOR}` }}>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: 3, background: COLOR,
                  animation: `pulse 0.9s ease ${i * 0.15}s infinite`
                }} />
              ))}
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <button style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>🎙️</button>
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Message ARIA..."
        />
        <button className="chat-send" style={{ background: COLOR, color: '#fff' }} onClick={() => send(input)}>↑</button>
      </div>
    </div>
  )
}

// ── FlowAutomations ───────────────────────────────────────────────────────
function FlowAutomations({ onBack }) {
  const [automations, setAutomations] = useState(AUTOMATIONS)
  const [cat, setCat] = useState('All')

  const toggle = (id) => setAutomations(a => a.map(x => x.id === id ? { ...x, active: !x.active } : x))
  const filtered = cat === 'All' ? automations : automations.filter(a => a.category === cat)

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Automations</h1>
        <p>Manage your active automations</p>
      </div>
      <div className="sub-tabs">
        {CATEGORIES.map(c => (
          <button key={c} className={`sub-tab ${cat === c ? 'active' : ''}`}
            style={cat === c ? { background: COLOR } : {}}
            onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => (
            <div key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24, width: 40, textAlign: 'center' }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.category} · {a.active ? `${a.runs} runs` : 'Paused'}</div>
              </div>
              <div className={`toggle ${a.active ? 'on' : ''}`} style={{ color: COLOR }} onClick={() => toggle(a.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── FlowConnect ───────────────────────────────────────────────────────────
function FlowConnect({ onBack }) {
  const [services, setServices] = useState(SERVICES)
  const [connecting, setConnecting] = useState(null)

  const handleConnect = (id) => {
    const svc = services.find(s => s.id === id)
    if (svc.connected) {
      setServices(s => s.map(x => x.id === id ? { ...x, connected: false } : x))
      return
    }
    setConnecting(id)
    setTimeout(() => {
      setServices(s => s.map(x => x.id === id ? { ...x, connected: true } : x))
      setConnecting(null)
    }, 1400)
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Connect Services</h1>
        <p>Link your apps for seamless automation</p>
      </div>
      <div className="section">
        <div className="grid-2">
          {services.map(svc => (
            <div key={svc.id} className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{svc.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>{svc.name}</div>
              <button
                className={`btn btn-sm btn-full ${svc.connected ? 'btn-outline' : ''}`}
                style={!svc.connected ? { background: COLOR, color: '#fff' } : {}}
                onClick={() => handleConnect(svc.id)}
              >
                {connecting === svc.id ? '⏳' : svc.connected ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Flow (router) ─────────────────────────────────────────────────────────
export default function Flow() {
  const [screen, setScreen] = useState('home')

  if (screen === 'chat') return <FlowChat onBack={() => setScreen('home')} />
  if (screen === 'automations') return <FlowAutomations onBack={() => setScreen('home')} />
  if (screen === 'connect') return <FlowConnect onBack={() => setScreen('home')} />
  return <FlowHome onNav={setScreen} />
}
