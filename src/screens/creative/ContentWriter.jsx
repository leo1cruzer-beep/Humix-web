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

const PLATFORM_SPECS = {
  'LinkedIn': 'Professional tone, 150-250 words, personal insight or story angle, end with an engagement question, 3-5 hashtags',
  'Twitter/X': '1-3 tweets max 280 chars each, strong hook in first line, conversational, 2-3 hashtags, possibly a thread',
  'Instagram': 'Engaging caption 100-150 words, strong first line (shown before "more"), 10-15 mix of niche and broad hashtags, clear CTA',
  'Blog': 'SEO-optimized article: compelling H1 title + 350-450 words with 3-4 subheadings, practical takeaways, conversational but authoritative',
  'Facebook': 'Conversational and community-focused, 80-120 words, question or poll to drive comments, minimal hashtags',
}

export default function ContentWriter() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('LinkedIn')
  const [tone, setTone] = useState('professional')
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
    if (!topic.trim()) return
    if (checkGate('creative')) return
    recordUse('creative')
    setLoading(true)
    setResult('')
    const prompt = `Write ${platform} content about: "${topic}"

Tone: ${tone}
Platform requirements: ${PLATFORM_SPECS[platform]}

Critical rules:
- Make it immediately engaging — first line must stop the scroll
- Sound like a real, thoughtful human — not AI-generated corporate speak
- Be specific with examples, not vague generalities
- Match the tone exactly: ${tone === 'professional' ? 'authoritative but warm, credible' : tone === 'casual' ? 'conversational, relatable, like talking to a friend' : 'witty, playful, uses humor that lands — not forced jokes'}
- Make it 100% ready to post — no [brackets], no placeholders, no instructions

Output ONLY the finished content. Nothing else.`
    try {
      const text = await callAI(prompt, 600)
      setResult(text)
      logActivity('Content Writer', 'Creative', text)
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
            <Link to="/creative" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Creative Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>✍️</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AI Content Writer</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Platform-ready content — LinkedIn, Twitter, Instagram, Blog, Facebook.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Content Setup</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>What's the content about?</label>
                  <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. 3 lessons I learned from my first startup failure, or Why remote work is changing hiring in 2025" rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.24)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Platform</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} style={inputStyle}>
                    {Object.keys(PLATFORM_SPECS).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} style={inputStyle}>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="funny">Funny / Witty</option>
                  </select>
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!topic.trim() || loading} style={{ padding: '13px', fontSize: '15px', opacity: !topic.trim() ? 0.6 : 1 }}>
                  {loading ? 'Writing…' : `Write ${platform} Post →`}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Ready to Post</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Writing your content…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✍️</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Choose your platform, set the tone, and get ready-to-post content.</p>
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
