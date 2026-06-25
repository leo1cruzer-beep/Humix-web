import { useState } from 'react'
import { Link } from 'react-router-dom'
import { callAI } from '../../utils/ai.js'

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

export default function SalaryInsights() {
  const [title, setTitle] = useState('')
  const [country, setCountry] = useState('')
  const [years, setYears] = useState('3')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const canGenerate = title.trim() && country.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Provide detailed salary insights for a ${title} with ${years} year(s) of experience in ${country}.

SALARY RANGES (in local currency AND USD equivalent)
• Entry level (0–2 years): [specific range]
• Mid level (3–6 years): [specific range]
• Senior level (7+ years): [specific range]
• Lead/Manager: [specific range]

WHAT MOST AFFECTS YOUR SALARY
(5 specific factors for ${title} in ${country} — be direct with numbers where possible)

5 HIGH-PAYING COMPANIES FOR THIS ROLE IN ${country.toUpperCase()}
(Company name + why they pay well + rough salary range)

NEGOTIATION STRATEGY (specific to ${country}'s market)
1. [Tactic 1 with exact phrasing to use]
2. [Tactic 2]
3. [Tactic 3]
4. [Tactic 4]

BENEFITS TO NEGOTIATE BEYOND BASE SALARY
(5 benefits with typical values in this market)

MARKET OUTLOOK
(Is demand for ${title} growing or shrinking in ${country}? What's driving it?)

Use real currency values. Be direct — no vague ranges.`
    try {
      setResult(await callAI(prompt, 900))
    } catch {
      setResult('Unable to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-enter" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/career" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Career Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>💰</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Salary Insights</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Real salary ranges, negotiation tactics, and market outlook for your role.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Role</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. DevOps Engineer, Marketing Manager" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Country / Market</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Canada, Nigeria, Germany" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Your Years of Experience</label>
                  <select value={years} onChange={e => setYears(e.target.value)} style={inputStyle}>
                    {['0','1','2','3','4','5','6','7','8','10','12','15','20+'].map(y => <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>)}
                  </select>
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Researching…' : 'Get Salary Insights →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Salary Report</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Researching salary data…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>💰</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enter your role and country to get real salary ranges and negotiation advice.</p>
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
