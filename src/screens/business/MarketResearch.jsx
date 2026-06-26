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

export default function MarketResearch() {
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])
  const canGenerate = industry.trim() && country.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Conduct comprehensive market research for the ${industry} industry in ${country}.

MARKET OVERVIEW
• Current market size: [USD estimate with reasoning]
• 5-year growth rate (CAGR estimate): [%]
• Market maturity: [emerging / growing / mature / declining]
• Key drivers of growth

TOP 5 COMPETITORS / PLAYERS
For each: Name | Market position | Key strength | Key weakness | Estimated revenue or market share

CUSTOMER SEGMENTS
Segment 1: [Name] — size estimate, pain points, willingness to pay
Segment 2: [Name] — size estimate, pain points, willingness to pay
Segment 3: [Name] — size estimate, pain points, willingness to pay

TOP 5 MARKET OPPORTUNITIES
(Specific gaps, underserved niches, or emerging trends to capitalize on)

KEY RISKS & CHALLENGES
1. [Risk] — Probability: High/Med/Low — Impact: High/Med/Low
2. [Risk]
3. [Risk]
4. [Risk]

MARKET ENTRY STRATEGY FOR ${country.toUpperCase()}
• Recommended entry approach
• Key partnerships to seek
• Pricing strategy for this market
• Regulatory considerations
• Timeline: realistic months to first revenue

DATA DISCLAIMER
This is AI-generated analysis based on training data. Validate with primary research, government trade databases, and industry reports before making investment decisions.`
    try {
      const text = await callAI(prompt, 1000)
      setResult(text)
      logActivity('Market Research', 'Business', text)
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
            <Link to="/business" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Business Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🔍</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Market Research Assistant</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Market size, competitors, opportunities, and entry strategy for any industry.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Market</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Industry / Niche</label>
                  <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Online grocery delivery, EdTech, Electric vehicles, Telemedicine" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Target Country / Region</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Indonesia, Sub-Saharan Africa, Latin America" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Researching…' : 'Start Market Research →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Market Report</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Researching market data…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enter an industry and country to get a full market research report with competitors and entry strategy.</p>
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
