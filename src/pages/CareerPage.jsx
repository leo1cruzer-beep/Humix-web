import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOOLS = [
  {
    id: 'resume',
    title: 'AI Resume Builder',
    desc: 'Enter your job title, skills, experience, and target country — get a complete professional resume with tailored sections in seconds.',
    icon: '📄',
    badge: 'Most popular',
    badgeClass: 'badge-blue',
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    desc: 'Company-specific cover letters that hook hiring managers. Enter the job title, company name, and your background.',
    icon: '✉️',
    badge: 'AI-powered',
    badgeClass: 'badge-green',
  },
  {
    id: 'interview',
    title: 'Interview Prep',
    desc: 'Get the top 10 most likely interview questions for any role with strong sample answers using the STAR method.',
    icon: '🎯',
    badge: 'Walk in ready',
    badgeClass: 'badge-amber',
  },
  {
    id: 'salary',
    title: 'Salary Insights',
    desc: 'Realistic salary ranges by level, top-paying companies, and negotiation scripts tailored to your role and country.',
    icon: '💰',
    badge: 'Negotiate better',
    badgeClass: 'badge-blue',
  },
]

export default function CareerPage() {
  const navigate = useNavigate()
  const [hov, setHov] = useState(null)

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px', marginBottom: '48px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-blue">Career</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: '10px' }}>Career Tools</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            AI tools for every stage of your job search — resume, cover letter, interview prep, and salary negotiation.
          </p>
        </div>
      </div>

      <div style={container}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '20px' }}>
          4 tools available
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/career/${t.id}`)}
              onMouseEnter={() => setHov(t.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${hov === t.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '16px', padding: '24px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.18s ease',
                boxShadow: hov === t.id ? 'var(--shadow-hover)' : 'none',
                transform: hov === t.id ? 'translateY(-2px)' : 'none',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  {t.icon}
                </div>
                <span className={`badge ${t.badgeClass}`} style={{ fontSize: '11px', flexShrink: 0 }}>{t.badge}</span>
              </div>
              <div>
                <div className="card-title" style={{ marginBottom: '6px' }}>{t.title}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{t.desc}</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>Open tool →</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '48px', padding: '20px 24px', background: 'var(--accent-light)', borderRadius: '12px', border: '1px solid rgba(27,79,216,0.12)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--accent)', marginBottom: '4px' }}>Powered by DeepSeek AI</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every tool generates role-specific, personalized output — not generic templates. Your data stays in your browser session only.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
