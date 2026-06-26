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

export default function PitchDeck() {
  const [idea, setIdea] = useState('')
  const [stage, setStage] = useState('pre-seed')
  const [ask, setAsk] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])
  const canGenerate = idea.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Create a detailed 10-slide pitch deck outline for this startup:

${idea}

Stage: ${stage}
Funding Ask: ${ask || 'Not specified'}

For each slide provide:
- SLIDE [N]: [Title]
- One-sentence core message
- 4 specific bullet points with actual content suggestions (not just "add your metrics here")

SLIDE 1: THE PROBLEM
SLIDE 2: OUR SOLUTION
SLIDE 3: PRODUCT (Demo/Screenshots)
SLIDE 4: MARKET SIZE (TAM → SAM → SOM with specific numbers)
SLIDE 5: BUSINESS MODEL (how you make money, unit economics)
SLIDE 6: TRACTION (what to show — if pre-launch, show validation evidence)
SLIDE 7: GO-TO-MARKET STRATEGY
SLIDE 8: COMPETITION & DIFFERENTIATION (comparison matrix format)
SLIDE 9: THE TEAM (what roles and backgrounds to highlight)
SLIDE 10: THE ASK (${ask ? `$${ask}` : 'funding amount'} + use of funds breakdown + 18-month milestones)

After the slides, add:
INVESTOR FAQs — 5 tough questions investors will ask with suggested answers.`
    try {
      const text = await callAI(prompt, 1000)
      setResult(text)
      logActivity('Pitch Deck', 'Business', text)
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
            <Link to="/business" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Business Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🎨</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Pitch Deck Outline</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            10-slide investor pitch deck with specific content for every slide.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Startup</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Startup Idea</label>
                  <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. SaaS platform that helps restaurants reduce food waste by predicting demand using AI, targeting mid-size restaurant chains in the US" rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Startup Stage</label>
                  <select value={stage} onChange={e => setStage(e.target.value)} style={inputStyle}>
                    <option value="idea">Idea Stage (no product yet)</option>
                    <option value="pre-seed">Pre-Seed (MVP / early users)</option>
                    <option value="seed">Seed (product-market fit)</option>
                    <option value="series-a">Series A (scaling)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Funding Ask (optional)</label>
                  <input value={ask} onChange={e => setAsk(e.target.value)} placeholder="e.g. $500,000 or $2M" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Building Deck…' : 'Generate Pitch Deck →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Pitch Deck Outline</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Building your pitch deck…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎨</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Describe your startup to get a complete 10-slide pitch deck outline + investor FAQs.</p>
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
