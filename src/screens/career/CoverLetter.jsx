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

export default function CoverLetter() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [background, setBackground] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()
  const { checkGate, recordUse } = useEmailGate()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])
  const canGenerate = title.trim() && company.trim() && background.trim()

  async function generate() {
    if (!canGenerate) return
    if (checkGate('career')) return
    recordUse('career')
    setLoading(true)
    setResult('')
    const prompt = `Write a compelling cover letter for a ${title} position at ${company}.

About the applicant: ${background}

Requirements:
- Opening: A strong hook that mentions ${company} specifically — show you know them
- Paragraph 2: Connect the applicant's background directly to what ${company} needs
- Paragraph 3: Specific value you bring — use numbers/metrics from the background given
- Closing: Confident call-to-action requesting an interview
- Length: 320-360 words
- Tone: Professional but personable — sounds human, not corporate

STRICT: Do NOT start with "I am writing to apply" or "Please find my resume attached". Begin with something that immediately grabs attention.`
    try {
      const text = await callAI(prompt, 700)
      setResult(text)
      logActivity('Cover Letter', 'Career', text)
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
            <span style={{ fontSize: '28px' }}>✉️</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Cover Letter Generator</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Company-specific, compelling cover letters that stand out from generic templates.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Job Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Product Manager" style={inputStyle} onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.24)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Stripe, Netflix, local startup" style={inputStyle} onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.24)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Your Background & Key Achievements</label>
                  <textarea value={background} onChange={e => setBackground(e.target.value)} placeholder="e.g. 5 years in product management, launched 3 apps with 100K+ users, expertise in B2B SaaS, previously at Shopify" rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.24)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Writing Letter…' : 'Generate Cover Letter →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Your Cover Letter</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Crafting your letter…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✉️</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fill in the details to get a tailored cover letter for this specific company.</p>
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
