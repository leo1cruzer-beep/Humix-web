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

export default function SocialMediaPack() {
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('awareness')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!description.trim()) return
    setLoading(true)
    setResult('')
    const goalMap = {
      awareness: 'build brand awareness and reach new audiences',
      engagement: 'maximize likes, comments, and shares',
      sales: 'drive conversions and sales',
      community: 'build community and loyalty',
    }
    const prompt = `Create a complete social media content pack for:

"${description}"

Goal: ${goalMap[goal]}

Generate 5 unique, ready-to-post pieces — one per platform. Each must be unique in angle, not just reformatted:

---TWITTER/X---
[2-3 punchy tweets, each under 280 chars. Hook in first line. Include thread option if topic is complex. 2-3 hashtags.]

---LINKEDIN---
[Professional post, 200-250 words. Start with a bold insight or counterintuitive statement. Story or data to back it up. End with question to drive comments. 4-5 hashtags.]

---INSTAGRAM---
[Caption 120-160 words. Open with a line that stops the scroll. Conversational but aspirational. 12-15 targeted hashtags on a new line.]

---FACEBOOK---
[90-130 words. Community-focused. Conversational. Ask a question or invite participation. No hashtags needed.]

---TIKTOK / REELS SCRIPT (15 seconds)---
[Exact spoken words for a 15-second hook video. Format: "Hook (0-3s): [what to say] / Build (3-12s): [what to say] / CTA (12-15s): [what to say]"]

Make each piece feel native to its platform. No placeholders.`
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
            <Link to="/creative" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Creative Tools</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>📱</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Social Media Pack</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            5 platform-ready posts in one shot — Twitter, LinkedIn, Instagram, Facebook, TikTok.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Content</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>What are you promoting?</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Our new AI-powered meal planning app that generates weekly recipes based on your budget and nutrition goals — launching next week" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#6366F1'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Campaign Goal</label>
                  <select value={goal} onChange={e => setGoal(e.target.value)} style={inputStyle}>
                    <option value="awareness">Brand Awareness</option>
                    <option value="engagement">Engagement & Reach</option>
                    <option value="sales">Drive Sales / Sign-ups</option>
                    <option value="community">Build Community</option>
                  </select>
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!description.trim() || loading} style={{ padding: '13px', fontSize: '15px', opacity: !description.trim() ? 0.6 : 1 }}>
                  {loading ? 'Creating Pack…' : 'Generate 5-Platform Pack →'}
                </button>
              </div>
              <div style={{ marginTop: '20px', padding: '14px 16px', background: 'var(--accent-light)', borderRadius: '10px', border: '1px solid rgba(27,79,216,0.12)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>📅 Pro tip</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Schedule posts at different times across the week. Don't post all 5 on the same day — spread them for maximum reach.</p>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>5-Platform Content Pack</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Creating your content pack…</span>
                </div>
              ) : result ? (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{result}</div>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Describe what you're promoting to get 5 unique posts ready for every platform.</p>
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
