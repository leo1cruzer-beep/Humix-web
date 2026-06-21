import { useState, useRef, useEffect } from 'react'
import { SOUL_RESPONSES, JOURNEY_ITEMS, MEMORIES, PROMISES_SWIPE } from '../data'

const COLOR = '#7C3AED'
const BG = '#F5F3FF'

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── SoulHome ──────────────────────────────────────────────────────────────
function SoulHome({ onNav }) {
  const [mood, setMood] = useState(null)
  const MOODS = [
    { emoji: '😔', label: 'Struggling' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😊', label: 'Great' },
    { emoji: '🤩', label: 'Amazing' },
  ]
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>◉</span>
          <h1 style={{ color: COLOR }}>SOUL</h1>
        </div>
        <p>Your emotional memory & growth</p>
      </div>

      <div className="section">
        <div className="stat-row">
          {[['127', 'Memories'], ['34', 'Promises'], ['8', 'Reflections']].map(([n, l]) => (
            <div key={l} className="stat-box">
              <div className="stat-num" style={{ color: COLOR }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>How are you feeling today?</div>
          <div className="mood-row">
            {MOODS.map(m => (
              <button key={m.label} className={`mood-btn ${mood === m.label ? 'selected' : ''}`} onClick={() => setMood(m.label)}>
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          {mood && (
            <div style={{ marginTop: 8, padding: '10px 14px', background: BG, borderRadius: 'var(--radius-sm)', fontSize: 13, color: COLOR, fontWeight: 500, animation: 'fadeIn 0.3s ease' }}>
              I hear you. Would you like to talk about it?
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <button className="btn btn-full" onClick={() => onNav('chat')}
          style={{ background: COLOR, color: '#fff', fontSize: 16, padding: '16px 24px' }}>
          🌙 Start Talking
        </button>
      </div>

      <div className="section">
        <div className="section-title">Explore</div>
        <div className="grid-2">
          {[
            { label: 'Journey', icon: '🗺️', screen: 'journey', desc: 'Your life timeline' },
            { label: 'Promises', icon: '🤝', screen: 'promises', desc: '34 made, 18 kept' },
            { label: 'Memories', icon: '💫', screen: 'chat', desc: '127 captured' },
            { label: 'Reflect', icon: '🪞', screen: 'reflect', desc: 'Weekly check-in' },
          ].map(item => (
            <button key={item.label} className="card" onClick={() => onNav(item.screen)}
              style={{ textAlign: 'left', border: 'none', cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SoulChat ──────────────────────────────────────────────────────────────
function SoulChat({ onBack }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey… I'm here. 🌙 What's on your heart today?" }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text) => {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text: text.trim() }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', text: pick(SOUL_RESPONSES) }])
    }, 1100 + Math.random() * 800)
  }

  const PROMPTS = ['I need to talk', "I'm feeling lost", 'Something happened', 'I need to reflect']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ padding: '52px 20px 12px', background: BG, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: COLOR }}>SOUL</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>Your emotional companion</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌙</div>
      </div>

      <div className="h-scroll" style={{ padding: '10px 16px' }}>
        {PROMPTS.map(s => (
          <button key={s} onClick={() => send(s)} style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 99,
            border: `1.5px solid ${COLOR}44`, background: BG,
            color: COLOR, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-body)', whiteSpace: 'nowrap'
          }}>{s}</button>
        ))}
      </div>

      <div className="chat-container" style={{ flex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
            style={m.role === 'ai' ? { borderLeft: `3px solid ${COLOR}`, lineHeight: 1.6 } : { background: COLOR }}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="bubble bubble-ai" style={{ borderLeft: `3px solid ${COLOR}` }}>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: COLOR, animation: `pulse 0.9s ease ${i * 0.15}s infinite` }} />
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
          placeholder="Share what's on your mind..."
          style={{ '--focus-color': COLOR }}
        />
        <button className="chat-send" style={{ background: COLOR, color: '#fff' }} onClick={() => send(input)}>↑</button>
      </div>
    </div>
  )
}

// ── SoulJourney ───────────────────────────────────────────────────────────
function SoulJourney({ onBack }) {
  const TABS = ['Promises', 'Fears', 'Goals', 'Milestones', 'Struggles']
  const [tab, setTab] = useState('Goals')

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Your Journey</h1>
        <p>Every chapter of your story</p>
      </div>
      <div className="sub-tabs">
        {TABS.map(t => (
          <button key={t} className={`sub-tab ${tab === t ? 'active' : ''}`}
            style={tab === t ? { background: COLOR } : {}}
            onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(JOURNEY_ITEMS[tab] || []).map((item, i) => (
            <div key={item.id} className="card fade-up" style={{ display: 'flex', gap: 14, animationDelay: `${i * 0.06}s` }}>
              <div style={{ fontSize: 26 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{item.text}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.date}</div>
                {item.status && (
                  <span style={{
                    display: 'inline-block', marginTop: 6,
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                    background: item.status === 'kept' ? '#ECFDF5' : BG,
                    color: item.status === 'kept' ? '#059669' : COLOR
                  }}>
                    {item.status === 'kept' ? '✓ Kept' : '● Active'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SoulPromises ──────────────────────────────────────────────────────────
function SoulPromises({ onBack }) {
  const [cards, setCards] = useState(PROMISES_SWIPE)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [decision, setDecision] = useState(null)
  const [kept, setKept] = useState(0)
  const [letGo, setLetGo] = useState(0)
  const startX = useRef(0)

  const current = cards[0]

  const onPointerDown = (e) => {
    setDragging(true)
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - startX.current
    setOffset(x)
    if (x > 60) setDecision('kept')
    else if (x < -60) setDecision('letgo')
    else setDecision(null)
  }
  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(offset) > 80) {
      if (offset > 0) setKept(k => k + 1)
      else setLetGo(l => l + 1)
      setCards(c => c.slice(1))
    }
    setOffset(0)
    setDecision(null)
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Promises</h1>
        <p>Swipe right to keep · left to let go</p>
      </div>

      <div className="section">
        <div className="stat-row">
          <div className="stat-box"><div className="stat-num" style={{ color: '#22c55e' }}>{kept}</div><div className="stat-label">Kept</div></div>
          <div className="stat-box"><div className="stat-num" style={{ color: COLOR }}>{PROMISES_SWIPE.length}</div><div className="stat-label">Total</div></div>
          <div className="stat-box"><div className="stat-num" style={{ color: '#6B6860' }}>{letGo}</div><div className="stat-label">Let go</div></div>
        </div>
      </div>

      {current ? (
        <div className="section" style={{ userSelect: 'none' }}>
          <div style={{ position: 'relative', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cards[1] && (
              <div className="swipe-card" style={{ position: 'absolute', width: '90%', opacity: 0.6, transform: 'scale(0.94)', zIndex: 0 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{cards[1].emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{cards[1].text}</div>
              </div>
            )}
            <div
              className="swipe-card"
              style={{
                position: 'absolute', width: '90%', zIndex: 1,
                transform: `translateX(${offset}px) rotate(${offset * 0.06}deg)`,
                border: decision === 'kept' ? '2px solid #22c55e' : decision === 'letgo' ? `2px solid ${COLOR}` : '2px solid transparent',
                cursor: 'grab',
              }}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            >
              {decision === 'kept' && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#22c55e', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>KEPT ✓</div>
              )}
              {decision === 'letgo' && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: COLOR, color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>LET GO</div>
              )}
              <div style={{ fontSize: 40, marginBottom: 16 }}>{current.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{current.text}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{current.context}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: 13, color: 'var(--text2)' }}>
            <span>← Let go</span>
            <span style={{ fontSize: 12 }}>{cards.length} remaining</span>
            <span>Keep it →</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn btn-outline" style={{ flex: 1, borderColor: COLOR, color: COLOR }} onClick={() => { setLetGo(l => l+1); setCards(c => c.slice(1)) }}>Let go</button>
            <button className="btn" style={{ flex: 1, background: '#22c55e', color: '#fff' }} onClick={() => { setKept(k => k+1); setCards(c => c.slice(1)) }}>Keep it ✓</button>
          </div>
        </div>
      ) : (
        <div className="section" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>All done!</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>You kept {kept} and let go of {letGo}. That takes courage.</div>
        </div>
      )}
    </div>
  )
}

// ── SoulReflect ───────────────────────────────────────────────────────────
function SoulReflect({ onBack }) {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' })
  const [submitted, setSubmitted] = useState(false)

  const QUESTIONS = [
    { key: 'q1', q: 'What was the highlight of this week?' },
    { key: 'q2', q: 'What challenged you most?' },
    { key: 'q3', q: 'What do you want to carry into next week?' },
  ]

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Weekly Reflect</h1>
        <p>June 15 – 21, 2026</p>
      </div>

      <div className="section">
        <div className="section-title">Surfaced memories 💫</div>
        {MEMORIES.map(m => (
          <div key={m.id} className="card" style={{ marginBottom: 10, borderLeft: `3px solid ${COLOR}` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{m.emoji}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text)' }}>"{m.text}"</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>{m.date}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn btn-sm btn-outline" style={{ flex: 1, fontSize: 12 }}>Still true</button>
              <button className="btn btn-sm btn-outline" style={{ flex: 1, fontSize: 12 }}>Things changed</button>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="section">
          <div className="section-title">This week's reflection</div>
          {QUESTIONS.map(({ key, q }) => (
            <div key={key} className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: COLOR }}>{q}</div>
              <textarea
                value={answers[key]}
                onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))}
                placeholder="Write freely..."
                rows={3}
                style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 10,
                  padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-body)',
                  resize: 'none', outline: 'none', background: 'var(--bg)'
                }}
              />
            </div>
          ))}
          <button className="btn btn-primary btn-full" onClick={() => setSubmitted(true)}>Save Reflection</button>
        </div>
      ) : (
        <div className="section" style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌙</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Reflection saved</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>SOUL will surface this when it matters most.</div>
        </div>
      )}
    </div>
  )
}

// ── Soul (router) ─────────────────────────────────────────────────────────
export default function Soul() {
  const [screen, setScreen] = useState('home')

  if (screen === 'chat') return <SoulChat onBack={() => setScreen('home')} />
  if (screen === 'journey') return <SoulJourney onBack={() => setScreen('home')} />
  if (screen === 'promises') return <SoulPromises onBack={() => setScreen('home')} />
  if (screen === 'reflect') return <SoulReflect onBack={() => setScreen('home')} />
  return <SoulHome onNav={setScreen} />
}
