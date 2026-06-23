import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BusinessPlan from '../screens/business/BusinessPlan.jsx'
import PitchDeck from '../screens/business/PitchDeck.jsx'
import NameGenerator from '../screens/business/NameGenerator.jsx'
import MarketResearch from '../screens/business/MarketResearch.jsx'

const TOOLS = [
  {
    id: 'plan',
    title: 'Business Plan Generator',
    desc: 'Full business plan with executive summary, market analysis, revenue model, 3-year financials, and a 90-day launch roadmap.',
    icon: '📋',
    badge: 'Investor-ready',
    badgeClass: 'badge-blue',
  },
  {
    id: 'pitch',
    title: 'Pitch Deck Outline',
    desc: '10-slide pitch deck with specific content suggestions for every slide, plus the 5 hardest investor questions with answers.',
    icon: '🎨',
    badge: 'Fundraising',
    badgeClass: 'badge-green',
  },
  {
    id: 'name',
    title: 'Business Name Generator',
    desc: '10 unique name ideas with domain availability assessment, trademark risk, and a top recommendation from the AI.',
    icon: '💡',
    badge: 'Branding',
    badgeClass: 'badge-amber',
  },
  {
    id: 'research',
    title: 'Market Research Assistant',
    desc: 'Market size, top competitors, customer segments, key opportunities, and a tailored entry strategy for any industry and country.',
    icon: '🔍',
    badge: 'Data-driven',
    badgeClass: 'badge-blue',
  },
]

function BusinessHome() {
  const navigate = useNavigate()
  const [hov, setHov] = useState(null)

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px', marginBottom: '48px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-blue">Business</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: '10px' }}>Business Tools</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            From idea to investor pitch — AI tools for business planning, naming, market research, and fundraising.
          </p>
        </div>
      </div>

      <div style={container}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '20px' }}>
          4 tools available
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => navigate(`/business/${tool.id}`)}
              onMouseEnter={() => setHov(tool.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${hov === tool.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '16px', padding: '24px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.18s ease',
                boxShadow: hov === tool.id ? 'var(--shadow-hover)' : 'none',
                transform: hov === tool.id ? 'translateY(-2px)' : 'none',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <span className={`badge ${tool.badgeClass}`} style={{ fontSize: '11px', flexShrink: 0 }}>{tool.badge}</span>
              </div>
              <div>
                <div className="card-title" style={{ marginBottom: '6px' }}>{tool.title}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{tool.desc}</p>
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
              All outputs are specific to your business, market, and country — not generic templates. Great starting point for real planning.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function BusinessPage() {
  const { tool } = useParams()
  switch (tool) {
    case 'plan':     return <BusinessPlan />
    case 'pitch':    return <PitchDeck />
    case 'name':     return <NameGenerator />
    case 'research': return <MarketResearch />
    default:         return <BusinessHome />
  }
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
