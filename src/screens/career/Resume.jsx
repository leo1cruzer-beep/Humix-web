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

export default function Resume() {
  const [title, setTitle] = useState('')
  const [skills, setSkills] = useState('')
  const [years, setYears] = useState('3')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const canGenerate = title.trim() && skills.trim() && country.trim()

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    setResult('')
    const prompt = `Write a complete, professional resume for a ${title} with ${years} year(s) of experience targeting the ${country} job market.

Skills provided: ${skills}

Format with these exact sections:

PROFESSIONAL SUMMARY
(2-3 compelling sentences emphasizing their unique value and impact)

CORE SKILLS
(Bulleted list organized by category — technical, tools, soft skills)

WORK EXPERIENCE
(2 realistic roles with placeholder company names, dates, and 3-4 achievement-focused bullet points each — use specific metrics like percentages and numbers)

EDUCATION
(Most relevant degree/qualification for this role)

CERTIFICATIONS & PROFESSIONAL DEVELOPMENT
(3-4 relevant certifications for this role in ${country})

Make language strong and achievement-focused. Every bullet should start with an action verb.`
    try {
      setResult(await callAI(prompt, 900))
    } catch {
      setResult('Unable to generate resume. Please try again.')
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
            <span style={{ fontSize: '28px' }}>📄</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AI Resume Builder</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Enter your details — get a complete, tailored resume in seconds.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={card}>
              <div style={sectionLabel}>Your Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Job Title / Role</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" style={inputStyle} onFocus={e => e.target.style.borderColor='#1B4FD8'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Skills (comma-separated)</label>
                  <textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Python, team leadership, agile" rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, paddingTop: '10px' }} onFocus={e => e.target.style.borderColor='#1B4FD8'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <select value={years} onChange={e => setYears(e.target.value)} style={inputStyle}>
                    {['0','1','2','3','4','5','6','7','8','10','12','15','20+'].map(y => <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Target Country / Market</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. United States, Pakistan, UAE" style={inputStyle} onFocus={e => e.target.style.borderColor='#1B4FD8'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                </div>
                <button className="btn btn-blue" onClick={generate} disabled={!canGenerate || loading} style={{ padding: '13px', fontSize: '15px', opacity: !canGenerate ? 0.6 : 1 }}>
                  {loading ? 'Building Resume…' : 'Build My Resume →'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Generated Resume</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>DeepSeek</span>
                </div>
                {result && !loading && <CopyButton text={result} />}
              </div>
              {loading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '40px 0' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Building your resume…</span>
                </div>
              ) : result ? (
                <pre style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', margin: 0 }}>{result}</pre>
              ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fill in your details and click "Build My Resume" to get a tailored resume.</p>
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
