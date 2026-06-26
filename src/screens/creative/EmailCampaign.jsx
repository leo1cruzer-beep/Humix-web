import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { callAI } from '../../utils/ai.js'
import { useActivityLogger } from '../../hooks/useActivityLogger'

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

export default function EmailCampaign() {
  const [product, setProduct] = useState('')
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])
  const canGenerate = product.trim() && offer.trim() && audience.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Write a complete, high-converting email campaign for:

Product/Service: ${product}
Offer: ${offer}
Target Audience: ${audience}

Provide the full email campaign:

SUBJECT LINE A/B TEST
Option A: [Curiosity-driven, under 45 characters]
Option B: [Benefit-driven, under 45 characters]

PREVIEW TEXT
[55-85 chars that creates intrigue alongside the subject line]

EMAIL BODY
[230-270 words — conversational, not salesy. Structure:]

Opening hook (1-2 sentences): Address the audience's specific pain point or desire
Bridge (1-2 sentences): Connect their situation to what you're offering
Value section (2-3 sentences): What it is + the specific outcome they'll get
Social proof line: [Suggest what type of proof to insert + placeholder]
Main CTA button: [Exact button text + what it links to]
P.S. line: [One line that reinforces urgency or the offer]

SENDING STRATEGY
Best day and time for ${audience}
Subject line A/B test split recommendation
Follow-up email timing if no open

Keep the copy feeling like it's from a real human, not a marketing department.`
    try {
      const text = await callAI(prompt, 800)
      setResult(text)
      logActivity('Email Campaign', 'Creative', text)
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
            <Link to="/creative" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Creative Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>📧</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Email Campaign Writer</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Subject lines, preview text, body copy, and sending strategy — all in one.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Campaign Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Product / Service</label>
                  <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Online bookkeeping course for freelancers" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Offer / Promotion</label>
                  <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 50% off this weekend only, or free 7-day trial" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Target Audience</label>
                  <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Freelance designers earning $3K–$8K/month who hate doing taxes" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Writing Campaign…' : 'Write Email Campaign →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Email Campaign</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Writing your email campaign…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enter your product, offer, and audience to get a complete email campaign with A/B subject lines.</p>
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
