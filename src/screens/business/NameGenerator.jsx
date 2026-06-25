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

export default function NameGenerator() {
  const [description, setDescription] = useState('')
  const [style, setStyle] = useState('any')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!description.trim()) return
    setLoading(true)
    setResult('')
    const styleGuide = {
      any: 'Mix of all styles',
      modern: 'Modern, tech-forward (coined words, portmanteaus)',
      classic: 'Classic, trustworthy (descriptive, traditional)',
      creative: 'Creative, memorable (metaphors, unexpected combinations)',
      minimal: 'Minimal, one-word (short, punchy, easy to spell)',
    }
    const prompt = `Generate 10 unique business name ideas for this business:

"${description}"

Preferred style: ${styleGuide[style]}

For each name provide:

NAME: [the name]
CONCEPT: [what inspired it — 1 sentence]
APPEAL: [why customers will remember/trust it]
.COM STATUS: [likely available / likely taken / try .io or .co]
TRADEMARK RISK: [Low / Medium — brief reason]

Requirements:
- NO generic suffixes like "solutions", "tech", "global", "pro", "hub"
- All names must be easy to spell when heard aloud
- Maximum 3 syllables preferred
- No names that could have negative meanings in other languages
- At least 3 names that are very likely to have available .com domains
- Include at least 1 coined word (made-up word)
- Names should feel distinct from each other

After the 10 names, add:
TOP PICK: [your recommendation and why]`
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
            <Link to="/business" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Business Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>💡</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Business Name Generator</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            10 unique name ideas with domain availability and trademark risk assessment.
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
                  <label style={labelStyle}>Describe Your Business</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. An online marketplace where African artisans sell handmade crafts directly to global buyers, with no middlemen" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Name Style Preference</label>
                  <select value={style} onChange={e => setStyle(e.target.value)} style={inputStyle}>
                    <option value="any">Any style (mix)</option>
                    <option value="modern">Modern & tech-forward</option>
                    <option value="classic">Classic & trustworthy</option>
                    <option value="creative">Creative & unexpected</option>
                    <option value="minimal">Minimal & one-word</option>
                  </select>
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!description.trim() || loading} style={{ padding: '13px', fontSize: '15px', opacity: !description.trim() ? 0.6 : 1 }}>
                  {loading ? 'Generating Names…' : 'Generate 10 Names →'}
                </button>
              </div>
              <div style={{ marginTop: '20px', padding: '14px 16px', background: 'var(--accent-light)', borderRadius: '10px', border: '1px solid rgba(27,79,216,0.12)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>💡 After choosing a name</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Check trademark availability on your country's IP office website and verify the domain on Namecheap or GoDaddy before committing.</p>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Name Ideas</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Generating name ideas…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>💡</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Describe your business to get 10 unique name ideas with domain and trademark notes.</p>
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
