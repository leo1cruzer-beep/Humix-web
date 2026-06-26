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

export default function BusinessPlan() {
  const [idea, setIdea] = useState('')
  const [market, setMarket] = useState('')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()
  const location = useLocation()
  const previousContent = location.state?.previousContent

  useEffect(() => {
    if (previousContent) setResult(previousContent)
  }, [])
  const canGenerate = idea.trim() && market.trim() && country.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Generate a professional, investor-ready business plan for:

Business Idea: ${idea}
Target Market: ${market}
Country/Region: ${country}

EXECUTIVE SUMMARY
(150 words — the hook that makes investors want to read more)

MARKET ANALYSIS
• Market size: [specific estimate with reasoning]
• Target customer: [detailed profile — demographics, pain points, spending behavior]
• Key trends driving this market
• Top 3 competitors: [name, strength, weakness each]
• Our competitive advantage

REVENUE MODEL
• Primary revenue stream + pricing
• Secondary revenue opportunities
• Unit economics: Customer Acquisition Cost estimate, Lifetime Value estimate
• Path to profitability

3-YEAR FINANCIAL PROJECTION
Year 1: Revenue [amount], Costs [amount], Result [profit/loss]
Year 2: Revenue [amount], Costs [amount], Result [profit/loss]
Year 3: Revenue [amount], Costs [amount], Result [profit/loss]

KEY RISKS & MITIGATION
(4 risks with specific mitigation strategies)

FIRST 90 DAYS ACTION PLAN
(5 concrete steps to launch)

Make all numbers specific and realistic for the ${country} market.`
    try {
      const text = await callAI(prompt, 1000)
      setResult(text)
      logActivity('Business Plan', 'Business', text)
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
            <span style={{ fontSize: '28px' }}>📋</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Business Plan Generator</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Full business plan with market analysis, financials, and 90-day action plan.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Business</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Business Idea</label>
                  <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. A mobile app that connects freelance nurses with clinics for short-term shifts in rural areas" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Target Market</label>
                  <input value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g. Small clinics, rural hospitals, healthcare staffing agencies" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Country / Region</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Nigeria, Southeast Asia, United Kingdom" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Building Plan…' : 'Generate Business Plan →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Business Plan</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Building your business plan…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Describe your idea to get a full investor-ready business plan with financials.</p>
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
