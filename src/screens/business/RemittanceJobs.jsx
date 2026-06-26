import { useState } from 'react'
import { Link } from 'react-router-dom'
import { callAI } from '../../utils/ai'

const JOBS = [
  {
    id: 'va',
    title: 'Virtual Assistant',
    pay: '$3–8/hour',
    icon: '🗂️',
    desc: 'Help businesses with email, scheduling, research, and admin tasks.',
    skills: 'English, organization, computer basics',
    demand: 'Very High',
    demandColor: 'var(--success)',
  },
  {
    id: 'data',
    title: 'Data Entry',
    pay: '$2–5/hour',
    icon: '⌨️',
    desc: 'Type information into spreadsheets, databases, and online forms.',
    skills: 'Fast typing, attention to detail',
    demand: 'High',
    demandColor: '#10B981',
  },
  {
    id: 'social',
    title: 'Social Media Manager',
    pay: '$5–15/hour',
    icon: '📱',
    desc: 'Create posts, reply to comments, grow followers for small businesses.',
    skills: 'Social media, basic writing, creativity',
    demand: 'Very High',
    demandColor: 'var(--success)',
  },
  {
    id: 'cs',
    title: 'Customer Service (English)',
    pay: '$4–10/hour',
    icon: '🎧',
    desc: 'Answer customer questions via chat or email for international companies.',
    skills: 'Good English, patience, problem-solving',
    demand: 'High',
    demandColor: '#10B981',
  },
  {
    id: 'writing',
    title: 'Content Writing',
    pay: '$5–20/hour',
    icon: '✍️',
    desc: 'Write blog posts, product descriptions, and marketing content.',
    skills: 'Strong English writing, research, creativity',
    demand: 'High',
    demandColor: '#10B981',
  },
]

function JobCard({ job, onLearn }) {
  const [hov, setHov] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-card)', border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '16px', overflow: 'hidden', transition: 'all 0.18s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? 'var(--shadow-hover)' : 'none',
      }}
    >
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>{job.icon}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>{job.pay}</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: job.demandColor, background: `${job.demandColor}18`, padding: '4px 10px', borderRadius: '50px', flexShrink: 0, border: `1px solid ${job.demandColor}40` }}>
            {job.demand} demand
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>{job.desc}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Skills needed:</strong> {job.skills}
        </p>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-blue" onClick={() => onLearn(job)} style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
          Get 30-Day Plan
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setExpanded(e => !e)}
          style={{ padding: '10px 14px', fontSize: '13px' }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      {expanded && (
        <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Best platforms', val: job.id === 'va' ? 'Belay, Time Etc, Upwork' : job.id === 'data' ? 'Amazon Mechanical Turk, Clickworker' : job.id === 'social' ? 'Fiverr, PeoplePerHour, LinkedIn' : job.id === 'cs' ? 'LiveWorld, Arise, Working Solutions' : 'Textbroker, iWriter, Upwork' },
              { label: 'English level', val: job.id === 'data' ? 'Basic (read/write)' : job.id === 'va' || job.id === 'cs' ? 'Good (speak + write)' : 'Strong (write fluently)' },
              { label: 'Start earning', val: '2–4 weeks after setup' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{row.label}:</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlanModal({ job, onClose }) {
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const prompt = `Create a realistic 30-day learning plan for someone in a developing country who wants to get their first paying client as a "${job.title}" earning ${job.pay} in USD.

They may have basic English and a phone/laptop. Keep each day's task to 1-2 hours maximum.

Format:
WEEK 1 — Foundation (Days 1-7)
Day 1: [specific task]
Day 2: [specific task]
...

WEEK 2 — Skills (Days 8-14)
...

WEEK 3 — Setup (Days 15-21)
...

WEEK 4 — Launch (Days 22-30)
...

GOAL: By Day 30, you should have [specific outcome].

Be specific, practical, and motivating. Focus on free resources only.`
      const res = await callAI(prompt, 900)
      setPlan(res)
      setGenerated(true)
    } catch {
      setPlan(`30-Day Plan for ${job.title}\n\nWeek 1: Learn the basics through free YouTube tutorials.\nWeek 2: Practice with sample projects.\nWeek 3: Set up your profile on freelance platforms.\nWeek 4: Apply for your first 10 jobs.\n\nGoal: Land your first paid client by day 30.`)
      setGenerated(true)
    } finally {
      setLoading(false)
    }
  }

  function copy() { navigator.clipboard.writeText(plan) }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111111', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{job.icon} {job.title}</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>30-Day Job-Ready Plan</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
        </div>

        {!generated ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              AI will create your personal 30-day learning plan to become job-ready as a {job.title}.
            </p>
            <button className="btn btn-blue" onClick={generate} disabled={loading} style={{ padding: '13px 28px' }}>
              {loading ? 'Creating your plan…' : 'Generate My 30-Day Plan'}
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: 'var(--icon-bg)', borderRadius: '12px', padding: '16px', maxHeight: '50vh', overflowY: 'auto' }}>
              <pre style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontFamily: 'inherit' }}>{plan}</pre>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-blue" onClick={copy} style={{ flex: 1, padding: '12px' }}>📋 Copy Plan</button>
              <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, padding: '12px' }}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function RemittanceJobs() {
  const [activePlan, setActivePlan] = useState(null)

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '80px' }}>
      {activePlan && <PlanModal job={activePlan} onClose={() => setActivePlan(null)} />}

      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px', marginBottom: '32px' }}>
        <div style={container}>
          <Link to="/business" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            ← Business Tools
          </Link>
          <span className="badge badge-blue" style={{ display: 'inline-flex', marginBottom: '12px' }}>Hard Currency Income</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Jobs That Pay in USD/EUR</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
            Remote jobs you can do from anywhere. Get paid in strong currency — protect yourself from local inflation.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            {[['🌍', 'Work from anywhere'], ['💵', 'Paid in USD/EUR'], ['📱', 'Phone or laptop']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={container}>
        {/* Jobs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {JOBS.map(job => (
            <JobCard key={job.id} job={job} onLearn={setActivePlan} />
          ))}
        </div>

        {/* Quick comparison table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Quick Comparison</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--icon-bg)' }}>
                  {['Job', 'Pay/Hour', 'English Needed', 'Start Earning'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOBS.map((j, i) => (
                  <tr key={j.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{j.icon} {j.title}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>{j.pay}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {j.id === 'data' ? 'Basic' : j.id === 'social' ? 'Good' : j.id === 'writing' ? 'Strong' : 'Good'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>2–4 weeks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip box */}
        <div style={{ padding: '18px 20px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>💡 Pro Tip</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Start with the job that matches your current skills most closely — not the highest paying one. Getting your first 5 positive reviews is more important than the hourly rate. Once you have reviews, you can raise your prices quickly.
          </p>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
