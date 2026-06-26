import { useState, useEffect, useRef } from 'react'
import { VOICE_RESPONSES } from '../data'
import { LoanShield } from './LoanShield'

const COLOR = '#EA580C'
const BG = '#FFF7ED'

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const SERVICES_LIST = [
  { id: 'health', icon: '🏥', label: 'Health', color: '#ef4444' },
  { id: 'farm', icon: '🌾', label: 'Farm', color: '#84cc16' },
  { id: 'legal', icon: '⚖️', label: 'Legal', color: '#6366f1' },
  { id: 'learn', icon: '📚', label: 'Learn', color: '#0ea5e9' },
  { id: 'earn', icon: '💰', label: 'Earn', color: '#22c55e' },
]

// ── VoiceHome ─────────────────────────────────────────────────────────────
function VoiceHome({ onNav }) {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>◎</span>
          <h1 style={{ color: COLOR }}>VOICE</h1>
        </div>
        <p>Knowledge for every situation</p>
      </div>

      <div className="section" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8, color: 'var(--text2)', fontSize: 14 }}>Tap to ask anything</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <button className="mic-btn" onClick={() => onNav('speak')} style={{ background: BG, border: `3px solid ${COLOR}` }}>
            <span style={{ fontSize: 36 }}>🎙️</span>
          </button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>Speak in your language · Available 24/7</div>
      </div>

      <div className="section">
        <div className="section-title">Services</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {SERVICES_LIST.map(svc => (
            <button key={svc.id} onClick={() => onNav(svc.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 'var(--radius-sm)', minWidth: 56 }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: svc.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{svc.icon}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>{svc.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Recent questions</div>
        {[
          { q: 'What crops grow best in June?', svc: '🌾', time: '2h ago' },
          { q: 'What are my worker rights?', svc: '⚖️', time: 'Yesterday' },
          { q: 'How to treat fever in a child?', svc: '🏥', time: '3 days ago' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
            <span style={{ fontSize: 20 }}>{item.svc}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.q}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.time}</div>
            </div>
            <span style={{ color: 'var(--text2)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── VoiceSpeak ────────────────────────────────────────────────────────────
function VoiceSpeak({ onBack }) {
  const [state, setState] = useState('idle') // idle | recording | responding
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const SAMPLE_QUESTIONS = ['What is the best crop for this season?', 'How do I treat a child with fever?', "What are my rights as a worker?"]

  const startRecording = () => {
    setState('recording')
    setTranscript('')
    setResponse('')
    const q = pick(SAMPLE_QUESTIONS)
    let i = 0
    const tick = setInterval(() => {
      i++
      setTranscript(q.slice(0, Math.floor((i / 20) * q.length)))
      if (i >= 20) {
        clearInterval(tick)
        setTimeout(() => {
          setState('responding')
          const key = q.toLowerCase().includes('crop') || q.toLowerCase().includes('farm') ? 'farm'
            : q.toLowerCase().includes('fever') || q.toLowerCase().includes('child') ? 'health'
            : 'legal'
          setResponse(pick(VOICE_RESPONSES[key]))
        }, 500)
      }
    }, 100)
  }

  return (
    <div style={{ minHeight: '100dvh', background: state === 'recording' ? '#1A1916' : 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background 0.4s ease' }}>
      <div style={{ padding: '52px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="back-btn" onClick={onBack} style={{ color: state === 'recording' ? '#fff' : undefined }}>← Back</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 24 }}>
        {state === 'idle' && (
          <>
            <div style={{ fontSize: 18, color: 'var(--text2)', textAlign: 'center' }}>Tap the mic and speak your question</div>
            <button className="mic-btn" onClick={startRecording}
              style={{ width: 96, height: 96, background: BG, border: `3px solid ${COLOR}`, fontSize: 40 }}>
              🎙️
            </button>
            <div style={{ fontSize: 14, color: 'var(--text2)' }}>Supports 12 languages</div>
          </>
        )}

        {state === 'recording' && (
          <>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.7 }}>Listening...</div>
            <button className="mic-btn recording" onClick={() => setState('idle')}
              style={{ width: 96, height: 96, background: COLOR, border: 'none', fontSize: 40 }}>
              🎙️
            </button>
            <div className="waveform">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="wave-bar" style={{ background: '#fff', animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
            {transcript && (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: 16, color: '#fff', fontSize: 15, textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                "{transcript}"
              </div>
            )}
          </>
        )}

        {state === 'responding' && (
          <div style={{ width: '100%', animation: 'fadeUp 0.4s ease' }}>
            <div style={{ background: '#EFF9F6', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16, borderLeft: `4px solid #059669` }}>
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginBottom: 8 }}>VOICE RESPONSE</div>
              <div style={{ fontSize: 15, lineHeight: 1.7 }}>{response}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setState('idle'); setTranscript(''); setResponse('') }}>Ask another</button>
              <button className="btn" style={{ flex: 1, background: COLOR, color: '#fff' }}>🔊 Read aloud</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── VoiceHealth ───────────────────────────────────────────────────────────
function VoiceHealth({ onBack }) {
  const [selected, setSelected] = useState(null)
  const TOPICS = [
    { icon: '👶', label: "Child Health", key: 0 },
    { icon: '🤱', label: "Maternal Care", key: 1 },
    { icon: '💧', label: "Safe Water", key: 2 },
    { icon: '💉', label: "Vaccination", key: 3 },
    { icon: '🚨', label: "Emergency Signs", key: 4 },
  ]
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Health</h1>
        <p>Essential health knowledge</p>
      </div>
      <div className="section">
        {TOPICS.map(t => (
          <div key={t.key}>
            <button className="card" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, background: selected === t.key ? '#FEF2F2' : 'var(--surface)' }}
              onClick={() => setSelected(selected === t.key ? null : t.key)}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{t.label}</div>
              </div>
              <span style={{ color: 'var(--text2)', transform: selected === t.key ? 'rotate(90deg)' : '', transition: '0.2s' }}>›</span>
            </button>
            {selected === t.key && (
              <div style={{ background: '#FEF2F2', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 12, animation: 'fadeIn 0.25s ease', fontSize: 14, lineHeight: 1.7, color: 'var(--text)', borderLeft: '3px solid #ef4444' }}>
                {VOICE_RESPONSES.health[t.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── VoiceFarm ─────────────────────────────────────────────────────────────
function VoiceFarm({ onBack }) {
  const [crop, setCrop] = useState(null)
  const CROPS = ['🌾 Wheat', '🌽 Maize', '🍅 Tomatoes', '🌿 Rice', '🧅 Onion']

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Farm</h1>
        <p>Agricultural guidance & market prices</p>
      </div>
      <div className="section">
        <div className="section-title">Select your crop</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {CROPS.map(c => (
            <button key={c} onClick={() => setCrop(c)}
              style={{ padding: '8px 16px', borderRadius: 99, border: `1.5px solid ${crop === c ? '#84cc16' : 'var(--border)'}`, background: crop === c ? '#F0FDF4' : 'var(--surface)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: crop === c ? '#16a34a' : 'var(--text)' }}>
              {c}
            </button>
          ))}
        </div>

        {crop && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="card" style={{ marginBottom: 12, borderLeft: '3px solid #84cc16' }}>
              <div style={{ fontSize: 12, color: '#84cc16', fontWeight: 700, marginBottom: 8 }}>GUIDANCE FOR {crop}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                {VOICE_RESPONSES.farm[Math.floor(Math.random() * VOICE_RESPONSES.farm.length)]}
              </div>
            </div>
          </div>
        )}

        <div className="section-title">Market Prices Today</div>
        {[
          { name: 'Wheat', price: 'PKR 3,900/40kg', change: '+2.1%', up: true },
          { name: 'Maize', price: 'PKR 2,100/40kg', change: '-0.8%', up: false },
          { name: 'Tomatoes', price: 'PKR 80/kg', change: '+5.2%', up: true },
          { name: 'Rice', price: 'PKR 4,200/40kg', change: '+1.4%', up: true },
        ].map(item => (
          <div key={item.name} className="rate-row">
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>{item.price}</div>
              <div style={{ fontSize: 12, color: item.up ? '#22c55e' : '#ef4444' }}>{item.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── VoiceLegal ────────────────────────────────────────────────────────────
function VoiceLegal({ onBack }) {
  const [selected, setSelected] = useState(null)
  const SITUATIONS = [
    { icon: '🪪', label: 'Right to Identity', key: 0 },
    { icon: '💼', label: 'Labor Rights', key: 1 },
    { icon: '🏡', label: 'Land Rights', key: 2 },
    { icon: '🛡️', label: 'Safety & Protection', key: 3 },
    { icon: '🛒', label: 'Consumer Rights', key: 4 },
    { icon: '🔍', label: 'Loan Shield', key: 5 },
  ]
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Legal</h1>
        <p>Know your rights · plain language</p>
      </div>
      <div className="section">
        {SITUATIONS.map(s => (
          <div key={s.key}>
            <button className="card" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, background: selected === s.key ? '#EEF2FF' : 'var(--surface)' }}
              onClick={() => setSelected(selected === s.key ? null : s.key)}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{s.label}</div>
              <span style={{ color: 'var(--text2)', transform: selected === s.key ? 'rotate(90deg)' : '', transition: '0.2s' }}>›</span>
            </button>
            {selected === s.key && (
              <div style={{ background: s.key === 5 ? 'rgba(0,196,140,0.05)' : '#EEF2FF', borderRadius: 'var(--radius-sm)', padding: s.key === 5 ? '0 0 8px 0' : 16, marginBottom: 12, animation: 'fadeIn 0.25s ease', fontSize: 14, lineHeight: 1.7, borderLeft: s.key === 5 ? '3px solid #00C48C' : '3px solid #6366f1' }}>
                {s.key === 5 ? <LoanShield /> : VOICE_RESPONSES.legal[s.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── VoiceLearn ────────────────────────────────────────────────────────────
function VoiceLearn({ onBack }) {
  const [grade, setGrade] = useState(null)
  const [subject, setSubject] = useState(null)
  const [answer, setAnswer] = useState(null)

  const GRADES = ['Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Grade 10-12']
  const SUBJECTS = ['📐 Math', '🔬 Science', '🌍 Geography', '📖 History', '💻 Tech']

  const explain = () => {
    setAnswer(pick(VOICE_RESPONSES.learn))
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Learn</h1>
        <p>Knowledge explained simply</p>
      </div>
      <div className="section">
        <div className="section-title">Select grade level</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {GRADES.map(g => (
            <button key={g} onClick={() => setGrade(g)}
              style={{ padding: '8px 16px', borderRadius: 99, border: `1.5px solid ${grade === g ? '#0ea5e9' : 'var(--border)'}`, background: grade === g ? '#F0F9FF' : 'var(--surface)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: grade === g ? '#0ea5e9' : 'var(--text)' }}>
              {g}
            </button>
          ))}
        </div>
        <div className="section-title">Subject</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(s)}
              style={{ padding: '8px 16px', borderRadius: 99, border: `1.5px solid ${subject === s ? '#0ea5e9' : 'var(--border)'}`, background: subject === s ? '#F0F9FF' : 'var(--surface)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: subject === s ? '#0ea5e9' : 'var(--text)' }}>
              {s}
            </button>
          ))}
        </div>
        {grade && subject && !answer && (
          <button className="btn btn-full" onClick={explain} style={{ background: '#0ea5e9', color: '#fff', animation: 'fadeIn 0.3s ease' }}>
            Explain like I'm 10 🧒
          </button>
        )}
        {answer && (
          <div className="card" style={{ borderLeft: '3px solid #0ea5e9', animation: 'fadeUp 0.35s ease' }}>
            <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 700, marginBottom: 8 }}>
              {grade} · {subject}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>{answer}</div>
            <button className="btn btn-sm btn-outline" style={{ marginTop: 12 }} onClick={() => setAnswer(null)}>Ask another</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── VoiceEarn ─────────────────────────────────────────────────────────────
function VoiceEarn({ onBack }) {
  const [quizStep, setQuizStep] = useState(0)
  const [skill, setSkill] = useState(null)

  const SKILLS = [
    { id: 'design', label: 'Graphic Design', icon: '🎨', earn: '$20-50/hr' },
    { id: 'video', label: 'Video Editing', icon: '🎬', earn: '$15-40/hr' },
    { id: 'data', label: 'Data Entry', icon: '⌨️', earn: '$8-15/hr' },
    { id: 'social', label: 'Social Media', icon: '📱', earn: '$12-25/hr' },
    { id: 'write', label: 'Writing', icon: '✍️', earn: '$10-30/hr' },
    { id: 'code', label: 'Basic Coding', icon: '💻', earn: '$25-80/hr' },
  ]

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Earn</h1>
        <p>Build skills. Find work. Change your life.</p>
      </div>
      <div className="section">
        {!skill ? (
          <>
            <div className="section-title">What skill interests you?</div>
            <div className="grid-2">
              {SKILLS.map(s => (
                <button key={s.id} className="card" onClick={() => setSkill(s)}
                  style={{ textAlign: 'center', border: 'none', cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>{s.earn}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            <div className="card" style={{ background: '#F0FDF4', borderLeft: '3px solid #22c55e', marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{skill.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{skill.label}</div>
              <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{skill.earn} potential</div>
            </div>

            <div className="section-title">Your 90-day roadmap</div>
            {[
              { weeks: 'Week 1-2', task: 'Learn the basics (free YouTube courses)', done: false },
              { weeks: 'Week 3-4', task: 'Complete 3 practice projects', done: false },
              { weeks: 'Week 5-8', task: 'Build your portfolio (5 samples)', done: false },
              { weeks: 'Week 9-10', task: 'Create Fiverr & Upwork profiles', done: false },
              { weeks: 'Week 11-12', task: 'Apply to 10+ jobs. Get first review.', done: false },
            ].map((step, i) => (
              <div key={i} className="card" style={{ marginBottom: 8, display: 'flex', gap: 12, padding: '12px 14px' }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, color: 'var(--text2)' }}>{i+1}</div>
                <div>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, marginBottom: 2 }}>{step.weeks}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{step.task}</div>
                </div>
              </div>
            ))}

            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Start on</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-sm btn-full" style={{ background: '#00b22d', color: '#fff', flex: 1 }}>Fiverr →</button>
                <button className="btn btn-sm btn-full btn-outline" style={{ flex: 1 }}>Upwork →</button>
              </div>
            </div>

            <button className="btn btn-sm btn-outline" style={{ marginTop: 12, width: '100%' }} onClick={() => setSkill(null)}>
              ← Choose different skill
            </button>

            <div className="card" style={{ marginTop: 12, background: 'var(--bg2)', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text2)' }}>
                {pick(VOICE_RESPONSES.earn)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Voice (router) ────────────────────────────────────────────────────────
export default function Voice() {
  const [screen, setScreen] = useState('home')

  if (screen === 'speak') return <VoiceSpeak onBack={() => setScreen('home')} />
  if (screen === 'health') return <VoiceHealth onBack={() => setScreen('home')} />
  if (screen === 'farm') return <VoiceFarm onBack={() => setScreen('home')} />
  if (screen === 'legal') return <VoiceLegal onBack={() => setScreen('home')} />
  if (screen === 'learn') return <VoiceLearn onBack={() => setScreen('home')} />
  if (screen === 'earn') return <VoiceEarn onBack={() => setScreen('home')} />
  return <VoiceHome onNav={setScreen} />
}
