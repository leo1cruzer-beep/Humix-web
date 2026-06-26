import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { callAI } from '../../utils/ai'
import { useEmailGate } from '../../hooks/useEmailGate'

const CATEGORIES = [
  { id: 'image', icon: '🖼️', label: 'Image Labeling', desc: 'Describe what you see in photos', pay: '$0.05–0.25', time: '2 min' },
  { id: 'translation', icon: '🌐', label: 'Text Translation', desc: 'Translate short sentences to your language', pay: '$0.10–0.35', time: '3 min' },
  { id: 'audio', icon: '🎧', label: 'Audio Transcription', desc: 'Listen and type what you hear', pay: '$0.15–0.50', time: '5 min' },
  { id: 'survey', icon: '📊', label: 'Survey Responses', desc: 'Answer questions for companies', pay: '$0.10–0.40', time: '4 min' },
  { id: 'verify', icon: '✅', label: 'Data Verification', desc: 'Confirm if information is correct', pay: '$0.05–0.20', time: '2 min' },
]

const LANGUAGES = ['English', 'Urdu', 'Arabic', 'Hausa', 'Swahili', 'Hindi', 'Bengali']

function TaskCard({ task, onStart }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-card)', border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '16px', padding: '20px', transition: 'all 0.18s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? 'var(--shadow-hover)' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <span className="badge badge-green" style={{ fontSize: '11px' }}>⏱ {task.time}</span>
        <span className="badge badge-blue" style={{ fontSize: '11px' }}>💰 {task.pay}</span>
        <span className="badge" style={{ fontSize: '11px', background: 'var(--icon-bg)', color: 'var(--text-muted)' }}>🌐 {task.language}</span>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>{task.description}</p>
      <button className="btn btn-blue" onClick={() => onStart(task)} style={{ padding: '10px 20px', fontSize: '13px', width: '100%' }}>
        Start Task
      </button>
    </div>
  )
}

function TaskModal({ task, category, onClose }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [earned, setEarned] = useState('')
  const { checkGate, recordUse } = useEmailGate()

  async function submit(e) {
    e.preventDefault()
    if (!answer.trim() || loading) return
    if (checkGate('business')) return
    recordUse('business')
    setLoading(true)
    try {
      const prompt = `A user completed a micro-task in the "${category.label}" category.

Task: ${task.description}
Their answer: ${answer}

Provide brief, encouraging feedback (2-3 sentences). Tell them what they did well and one thing to improve. Be specific and practical. End with how much they earned: pick a specific amount between ${task.pay}.`
      const res = await callAI(prompt, 200)
      setFeedback(res)
      const match = res.match(/\$(\d+\.?\d*)/g)
      setEarned(match ? match[match.length - 1] : task.pay.split('–')[0])
      setDone(true)
    } catch {
      setFeedback('Great work completing this task! Your response has been submitted for review.')
      setEarned(task.pay.split('–')[0])
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111111', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{category.icon} {category.label}</span>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>Earn up to {task.pay}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
        </div>

        {done ? (
          <div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', marginBottom: '6px' }}>Task Completed! You earned {earned}</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{feedback}</p>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              In the real marketplace (Appen, Scale AI, Remotasks) this payment would go to your account. For now this is practice — real integrations coming soon!
            </p>
            <button className="btn btn-ghost" onClick={onClose} style={{ width: '100%', padding: '12px' }}>Try Another Task</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ background: 'var(--icon-bg)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>YOUR TASK</div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{task.description}</p>
            </div>
            <textarea
              style={{
                width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border)',
                borderRadius: '10px', padding: '12px', color: 'var(--text-primary)',
                fontSize: '14px', resize: 'vertical', minHeight: '100px', display: 'block',
              }}
              placeholder="Type your answer here…"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-blue"
              disabled={!answer.trim() || loading}
              style={{ width: '100%', padding: '13px', marginTop: '12px', opacity: !answer.trim() || loading ? 0.5 : 1 }}
            >
              {loading ? 'Submitting…' : 'Submit Answer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function MicroTasks() {
  const [activeCategory, setActiveCategory] = useState('image')
  const [language, setLanguage] = useState('English')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [generated, setGenerated] = useState({})

  const cat = CATEGORIES.find(c => c.id === activeCategory)

  async function loadTasks() {
    const key = `${activeCategory}-${language}`
    if (generated[key]) { setTasks(generated[key]); return }
    setLoading(true)
    setTasks([])
    try {
      const prompt = `Generate 4 realistic micro-task descriptions for the "${cat.label}" category, available in ${language}.

Category description: ${cat.desc}
Each task should be specific, achievable in ${cat.time}, and realistic for someone earning ${cat.pay}.

Return ONLY a JSON array of 4 objects, each with:
- "description": the specific task (1-2 sentences, very clear instructions)
- "time": exact time like "2 min" or "4 min"
- "pay": specific pay like "$0.10" or "$0.25"
- "language": "${language}"

No extra text, just the JSON array.`
      const res = await callAI(prompt, 600)
      const match = res.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        setGenerated(p => ({ ...p, [key]: parsed }))
        setTasks(parsed)
      }
    } catch {
      const fallback = Array.from({ length: 4 }, (_, i) => ({
        description: `${cat.label} task ${i + 1}: ${cat.desc}. Complete this task carefully and accurately.`,
        time: cat.time,
        pay: cat.pay.split('–')[0],
        language,
      }))
      setTasks(fallback)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [activeCategory, language])

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '80px' }}>
      {activeTask && <TaskModal task={activeTask} category={cat} onClose={() => setActiveTask(null)} />}

      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px', marginBottom: '32px' }}>
        <div style={container}>
          <Link to="/business" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            ← Business Tools
          </Link>
          <span className="badge badge-green" style={{ display: 'inline-flex', marginBottom: '12px' }}>Earn Money Now</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Micro-Tasks Marketplace</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
            Small tasks that pay real money. AI training data, translations, surveys — earn from your phone in minutes.
          </p>
        </div>
      </div>

      <div style={container}>
        {/* Language toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>Language:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLanguage(l)}
                style={{
                  padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                  background: language === l ? 'var(--accent)' : 'var(--icon-bg)',
                  color: language === l ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid ' + (language === l ? 'var(--accent)' : 'var(--border)'),
                  cursor: 'pointer',
                }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                background: activeCategory === c.id ? 'var(--accent)' : 'var(--bg-card)',
                color: activeCategory === c.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeCategory === c.id ? 'var(--accent)' : 'var(--border)'),
                cursor: 'pointer',
              }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Task grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {tasks.map((t, i) => (
              <TaskCard key={i} task={t} onStart={setActiveTask} />
            ))}
          </div>
        )}

        {/* Info banner */}
        <div style={{ marginTop: '32px', padding: '18px 20px', background: 'var(--accent-light)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--accent-text)', marginBottom: '4px' }}>🚀 Real marketplace coming soon</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            These are AI-generated practice tasks. Real tasks from Appen, Scale AI, and Remotasks are being integrated. Complete practice tasks to get familiar with the work.
          </p>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
