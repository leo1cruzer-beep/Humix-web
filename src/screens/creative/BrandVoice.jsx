import { useState } from 'react'
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

export default function BrandVoice() {
  const [description, setDescription] = useState('')
  const [audience, setAudience] = useState('')
  const { state } = useLocation()
  const [result, setResult] = useState(state?.previousContent || '')
  const [loading, setLoading] = useState(false)

  const { logActivity } = useActivityLogger()

  async function generate() {
    if (!description.trim()) return
    setLoading(true)
    setResult('')
    const prompt = `Create a complete brand voice guide for:

Business: ${description}
${audience ? `Target audience: ${audience}` : ''}

BRAND PERSONALITY
3 core personality traits (each with a 1-line description that's specific, not generic like "innovative" or "friendly"):
1. [Trait]: [What this actually means in practice]
2. [Trait]: [What this actually means in practice]
3. [Trait]: [What this actually means in practice]

TONE OF VOICE GUIDE
• With customers: [specific tone + example sentence]
• In marketing copy: [specific tone + example sentence]
• On social media: [specific tone + example sentence]
• When handling problems: [specific tone + example sentence]

TAGLINE OPTIONS
1. [Bold, under 5 words]
2. [Descriptive, 6-8 words]
3. [Question format, engaging]

VOCABULARY GUIDE
Words & phrases we USE: [10 words that fit the brand]
Words & phrases we AVOID: [10 words that don't fit — and why]

MESSAGING DO'S (5 rules with examples)
✓ DO: [rule]
Example: "[sample sentence that follows this rule]"

MESSAGING DON'TS (5 rules with examples)
✗ DON'T: [rule]
Example: "[sample sentence that breaks this rule → corrected version]"

BRAND VOICE IN ACTION — BEFORE & AFTER
Generic: "We offer high-quality products and services."
On-brand: [rewritten in this brand's voice]

Generic: "Contact us today to learn more."
On-brand: [rewritten in this brand's voice]`
    try {
      const text = await callAI(prompt, 900)
      setResult(text)
      logActivity('Brand Voice', 'Creative', text)
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
            <span style={{ fontSize: '28px' }}>🎙️</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Brand Voice Creator</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Personality, taglines, vocabulary guide, and messaging do's &amp; don'ts for your brand.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Brand</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Describe Your Business</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. A sustainable clothing brand for young professionals who care about the environment but still want to look sharp at work" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Target Audience (optional)</label>
                  <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Millennial women aged 25-35, career-focused, eco-conscious" style={inputStyle} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!description.trim() || loading} style={{ padding: '13px', fontSize: '15px', opacity: !description.trim() ? 0.6 : 1 }}>
                  {loading ? 'Building Guide…' : 'Create Brand Voice Guide →'}
                </button>
              </div>
              <div style={{ marginTop: '20px', padding: '14px 16px', background: 'var(--accent-light)', borderRadius: '10px', border: '1px solid rgba(27,79,216,0.12)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>🎯 How to use this</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Share this guide with every writer, designer, and social media manager on your team. Consistency is what makes a brand feel professional.</p>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Brand Voice Guide</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Building your brand voice…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎙️</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Describe your business to get a complete brand voice guide with taglines, vocabulary, and do's &amp; don'ts.</p>
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
