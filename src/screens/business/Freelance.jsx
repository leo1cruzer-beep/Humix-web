import { useState } from 'react'
import { Link } from 'react-router-dom'
import { callAI } from '../../utils/ai'

const STEPS = [
  { n: 1, label: 'Skill Assessment', icon: '🎯' },
  { n: 2, label: 'Profile Builder', icon: '📝' },
  { n: 3, label: 'Platform Guide', icon: '🌐' },
  { n: 4, label: 'First Gig', icon: '💼' },
  { n: 5, label: 'Pricing Guide', icon: '💰' },
]

const SKILL_QUESTIONS = [
  'What work have you done before? (even small jobs, helping family, school projects)',
  'What do people in your life ask for your help with?',
  'What languages do you speak and write well?',
  'Do you have a phone, laptop, or computer? How fast is your internet?',
  'How many hours per day can you work online?',
]

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', flexWrap: 'wrap' }}>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, flexShrink: 0,
            background: s.n < current ? 'var(--success)' : s.n === current ? 'var(--accent)' : 'var(--icon-bg)',
            color: s.n <= current ? '#fff' : 'var(--text-muted)',
            border: '1.5px solid ' + (s.n === current ? 'var(--accent)' : 'transparent'),
          }}>
            {s.n < current ? '✓' : s.n}
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: '20px', height: '2px', background: s.n < current ? 'var(--success)' : 'var(--border)', flexShrink: 0 }} />
          )}
        </div>
      ))}
      <span style={{ marginLeft: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Step {current} — {STEPS[current - 1]?.label}
      </span>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '12px', flexShrink: 0 }}>
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}

export default function Freelance() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(['', '', '', '', ''])
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  function setAnswer(i, v) { setAnswers(a => { const n = [...a]; n[i] = v; return n }) }

  async function runStep1() {
    if (answers.some(a => !a.trim())) return
    setLoading(true)
    try {
      const prompt = `Based on these answers from someone in a developing country who wants to freelance online, identify their #1 strongest marketable skill:

Q1 (past work): ${answers[0]}
Q2 (what people ask help with): ${answers[1]}
Q3 (languages): ${answers[2]}
Q4 (devices/internet): ${answers[3]}
Q5 (hours available): ${answers[4]}

Respond in this exact format:
SKILL: [one skill name, e.g. "Data Entry" or "Social Media Management"]
REASON: [1 sentence why this is their best option]
POTENTIAL: [monthly earning range in USD for a beginner, e.g. "$100-300/month"]`
      const res = await callAI(prompt, 200)
      setResults(r => ({ ...r, step1: res }))
      setStep(2)
    } finally { setLoading(false) }
  }

  async function runStep2() {
    setLoading(true)
    try {
      const skillLine = results.step1?.match(/SKILL: (.+)/)?.[1] || 'Freelancing'
      const prompt = `Write a short, professional freelance profile bio for someone with this skill: ${skillLine}

Their background:
- ${answers[0]}
- Speaks: ${answers[2]}
- Available ${answers[4]} per day

Write their profile in English, 3-4 sentences. Professional but warm. Emphasize reliability, communication, and what makes them trustworthy. This is for Fiverr/Upwork.`
      const res = await callAI(prompt, 300)
      setResults(r => ({ ...r, step2: res }))
      setStep(3)
    } finally { setLoading(false) }
  }

  async function runStep3() {
    setLoading(true)
    try {
      const skillLine = results.step1?.match(/SKILL: (.+)/)?.[1] || 'freelancing'
      const prompt = `Which freelance platform is best for someone just starting with "${skillLine}"?

Choose from: Fiverr, Upwork, PeoplePerHour, Freelancer.com

Answer in this format:
PLATFORM: [name]
WHY: [2 sentences — specific reason for this person]
SIGN UP LINK: [just say "Search '[platform name]' in Google to sign up"]
FIRST STEP: [one specific action to take today]`
      const res = await callAI(prompt, 250)
      setResults(r => ({ ...r, step3: res }))
      setStep(4)
    } finally { setLoading(false) }
  }

  async function runStep4() {
    setLoading(true)
    try {
      const skill = results.step1?.match(/SKILL: (.+)/)?.[1] || 'freelancing'
      const platform = results.step3?.match(/PLATFORM: (.+)/)?.[1] || 'Fiverr'
      const prompt = `Write a complete first service listing (gig) for a beginner freelancer offering "${skill}" on ${platform}.

Include:
TITLE: [catchy gig title, under 80 characters]
DESCRIPTION: [3-4 sentences selling the service, mention reliability and fast delivery]
WHAT YOU GET: [3-4 bullet points of deliverables]
DELIVERY TIME: [realistic for a beginner]
REVISION: [number of revisions included]

Keep language simple and professional. Focus on what the client gains.`
      const res = await callAI(prompt, 400)
      setResults(r => ({ ...r, step4: res }))
      setStep(5)
    } finally { setLoading(false) }
  }

  async function runStep5() {
    setLoading(true)
    try {
      const skill = results.step1?.match(/SKILL: (.+)/)?.[1] || 'freelancing'
      const hours = answers[4]
      const prompt = `Create a pricing guide for a beginner freelancer in a developing country offering "${skill}", available ${hours} hours per day.

Include:
STARTER PRICE: [in USD, what to charge for first 5 clients to get reviews]
AFTER 5 REVIEWS: [what to charge next]
AFTER 20 REVIEWS: [what to charge once established]
EARNINGS GOAL: [realistic monthly earnings after 3 months]
TIP: [one specific tip to get the first client faster]`
      const res = await callAI(prompt, 250)
      setResults(r => ({ ...r, step5: res }))
    } finally { setLoading(false) }
  }

  const ResultBox = ({ text, label }) => (
    <div style={{ background: 'var(--icon-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <CopyButton text={text} />
      </div>
      <pre style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontFamily: 'inherit' }}>{text}</pre>
    </div>
  )

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', maxWidth: '640px' }
  const ta = {
    width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border)',
    borderRadius: '10px', padding: '12px', color: 'var(--text-primary)',
    fontSize: '14px', resize: 'vertical', minHeight: '70px', fontFamily: 'inherit',
  }

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px', marginBottom: '32px' }}>
        <div style={container}>
          <Link to="/business" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            ← Business Tools
          </Link>
          <span className="badge badge-blue" style={{ display: 'inline-flex', marginBottom: '12px' }}>Start Freelancing</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Freelancing in 5 Steps</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
            AI finds your best skill, writes your profile, picks your platform, and creates your first gig — ready to copy and paste.
          </p>
        </div>
      </div>

      <div style={container}>
        <StepIndicator current={step} />

        {/* Step 1 — Skill Assessment */}
        {step === 1 && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🎯 Find Your Best Skill</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Answer 5 quick questions. AI identifies your strongest marketable skill.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SKILL_QUESTIONS.map((q, i) => (
                <div key={i}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {i + 1}. {q}
                  </label>
                  <textarea
                    style={ta}
                    placeholder="Your answer…"
                    value={answers[i]}
                    onChange={e => setAnswer(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-blue"
              onClick={runStep1}
              disabled={loading || answers.some(a => !a.trim())}
              style={{ marginTop: '20px', padding: '13px 28px', opacity: loading || answers.some(a => !a.trim()) ? 0.5 : 1 }}
            >
              {loading ? 'Analyzing…' : 'Find My Best Skill →'}
            </button>
          </div>
        )}

        {/* Step 2 — Profile */}
        {step === 2 && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>📝 Your Freelance Profile</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>AI is writing your profile bio based on your skill.</p>
            {results.step1 && <ResultBox text={results.step1} label="Your Best Skill" />}
            {results.step2 ? (
              <>
                <ResultBox text={results.step2} label="Your Profile Bio — copy this to your freelance account" />
                <button className="btn btn-blue" onClick={() => setStep(3)} style={{ marginTop: '20px', padding: '13px 28px' }}>
                  Next: Choose Platform →
                </button>
              </>
            ) : (
              <button className="btn btn-blue" onClick={runStep2} disabled={loading} style={{ marginTop: '16px', padding: '13px 28px', opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Writing profile…' : 'Write My Profile →'}
              </button>
            )}
          </div>
        )}

        {/* Step 3 — Platform */}
        {step === 3 && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🌐 Best Platform for You</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>AI picks the exact platform based on your skill.</p>
            {results.step3 ? (
              <>
                <ResultBox text={results.step3} label="Your Platform Recommendation" />
                <button className="btn btn-blue" onClick={() => setStep(4)} style={{ marginTop: '20px', padding: '13px 28px' }}>
                  Next: Write My First Gig →
                </button>
              </>
            ) : (
              <button className="btn btn-blue" onClick={runStep3} disabled={loading} style={{ padding: '13px 28px', opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Choosing platform…' : 'Pick My Platform →'}
              </button>
            )}
          </div>
        )}

        {/* Step 4 — First Gig */}
        {step === 4 && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>💼 Your First Gig</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>A complete service listing, ready to copy-paste into your account.</p>
            {results.step4 ? (
              <>
                <ResultBox text={results.step4} label="First Gig — copy this to your freelance profile" />
                <button className="btn btn-blue" onClick={() => setStep(5)} style={{ marginTop: '20px', padding: '13px 28px' }}>
                  Next: Set My Prices →
                </button>
              </>
            ) : (
              <button className="btn btn-blue" onClick={runStep4} disabled={loading} style={{ padding: '13px 28px', opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Writing gig…' : 'Write My First Gig →'}
              </button>
            )}
          </div>
        )}

        {/* Step 5 — Pricing */}
        {step === 5 && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>💰 What to Charge</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Pricing guide based on your skill and location.</p>
            {results.step5 ? (
              <>
                <ResultBox text={results.step5} label="Your Pricing Guide" />
                <div style={{ marginTop: '24px', padding: '16px 20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', marginBottom: '6px' }}>🎉 You're ready to start!</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>You now have everything you need: your skill, profile, platform, first gig, and pricing. The only step left is signing up and posting your gig.</p>
                </div>
                <button className="btn btn-ghost" onClick={() => { setStep(1); setAnswers(['', '', '', '', '']); setResults({}) }} style={{ marginTop: '16px', padding: '12px 24px', width: '100%' }}>
                  Start Over with Different Answers
                </button>
              </>
            ) : (
              <button className="btn btn-blue" onClick={runStep5} disabled={loading} style={{ padding: '13px 28px', opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Building pricing guide…' : 'Get Pricing Guide →'}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
