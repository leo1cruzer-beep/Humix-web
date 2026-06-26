import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { callAI } from '../../utils/ai.js'
import { useActivityLogger } from '../../hooks/useActivityLogger'
import { useEmailGate } from '../../hooks/useEmailGate'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <button onClick={copy} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '13px' }}>
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}

export default function InterviewPrep() {
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('mid')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { logActivity } = useActivityLogger()
  const { checkGate, recordUse } = useEmailGate()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])

  async function generate() {
    if (!role.trim()) return
    if (checkGate('career')) return
    recordUse('career')
    setLoading(true)
    setResult('')
    const prompt = `I have an interview for a ${role} (${level}-level) position. Give me EXACTLY 10 interview questions I'm most likely to be asked, with a strong sample answer for each.

Format EXACTLY as:
Q1: [question]
A1: [2-3 sentence answer that is specific to the ${role} role, using STAR method where relevant]

Q2: [question]
A2: [answer]

...continue for all 10.

Include a mix of:
- 3 behavioral questions (Tell me about a time when...)
- 2 role-specific technical/knowledge questions
- 2 situational questions (What would you do if...)
- 1 strengths question
- 1 weakness question (with a genuine answer that shows self-awareness)
- 1 "Why this role/company?" question

All answers must be specific to a ${level}-level ${role}. No generic answers.`
    try {
      const text = await callAI(prompt, 1000)
      setResult(text)
      logActivity('Interview Prep', 'Career', text)
    } catch {
      setResult('Unable to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-enter page-transition" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/career" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Career Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Interview Prep</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Role-specific questions and sample answers to walk in confident.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Interview</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Job Role</label>
                  <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Data Analyst, UX Designer, Sales Manager" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>
                    <option value="entry">Entry Level (0–2 years)</option>
                    <option value="mid">Mid Level (3–5 years)</option>
                    <option value="senior">Senior Level (6+ years)</option>
                    <option value="lead">Lead / Manager</option>
                  </select>
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!role.trim() || loading} style={{ padding: '13px', fontSize: '15px', opacity: !role.trim() ? 0.6 : 1 }}>
                  {loading ? 'Preparing Questions…' : 'Get Top 10 Questions →'}
                </button>
              </div>
              <div style={{ marginTop: '20px', padding: '14px 16px', background: 'var(--accent-light)', borderRadius: '10px', border: '1px solid rgba(27,79,216,0.12)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>💡 Pro tip</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Practice each answer out loud. Aim for 90–120 seconds per answer in a real interview.</p>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Interview Questions & Answers</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Preparing your questions…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enter your role to get the top 10 questions with strong sample answers.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }
const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }
const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '16px', color: 'var(--text-primary)', background: 'var(--input-bg)', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }
