import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INCOME_TOOLS = [
  {
    id: 'microtasks',
    title: 'Earn Money Now',
    desc: 'Micro-tasks that pay real money — image labeling, translation, surveys, audio transcription. Start earning in minutes.',
    icon: '💰',
    badge: 'Start Today',
    badgeClass: 'badge-green',
    highlight: true,
  },
  {
    id: 'freelance',
    title: 'Start Freelancing',
    desc: 'AI finds your skill, writes your profile, picks your platform, and creates your first gig — ready to copy and paste.',
    icon: '🚀',
    badge: 'AI-guided',
    badgeClass: 'badge-blue',
    highlight: true,
  },
  {
    id: 'market-prices',
    title: "Today's Market Prices",
    desc: 'Crop prices for wheat, rice, corn, tomatoes, onions — updated daily with AI insights for farmers and traders.',
    icon: '📊',
    badge: 'Daily',
    badgeClass: 'badge-amber',
    highlight: false,
  },
  {
    id: 'remittance-jobs',
    title: 'Jobs Paying USD/EUR',
    desc: 'Virtual assistant, data entry, social media, content writing — remote jobs in hard currency with 30-day learning plans.',
    icon: '🌍',
    badge: 'Hard Currency',
    badgeClass: 'badge-green',
    highlight: false,
  },
]

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
    id: 'names',
    title: 'Business Name Generator',
    desc: '10 unique name ideas with domain availability assessment, trademark risk, and a top recommendation from the AI.',
    icon: '💡',
    badge: 'Branding',
    badgeClass: 'badge-amber',
  },
  {
    id: 'market',
    title: 'Market Research Assistant',
    desc: 'Market size, top competitors, customer segments, key opportunities, and a tailored entry strategy for any industry and country.',
    icon: '🔍',
    badge: 'Data-driven',
    badgeClass: 'badge-blue',
  },
]

function ToolCard({ tool, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? 'rgba(255,179,64,0.30)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px', padding: '22px', cursor: 'pointer',
        textAlign: 'left', transition: 'all 0.15s ease',
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
        transform: hov ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
          {tool.icon}
        </div>
        <span className={`badge ${tool.badgeClass}`} style={{ fontSize: '11px', flexShrink: 0 }}>{tool.badge}</span>
      </div>
      <div>
        <div className="card-title" style={{ marginBottom: '5px' }}>{tool.title}</div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{tool.desc}</p>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '2px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>Open →</span>
      </div>
    </button>
  )
}

export default function BusinessPage() {
  const navigate = useNavigate()

  return (
    <main className="page-enter page-transition" style={{ paddingBottom: '80px' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px', marginBottom: '48px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-blue">Business</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: '10px' }}>Business & Income Tools</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            Earn money now with micro-tasks, start freelancing, track market prices, and build a business — all powered by AI.
          </p>
        </div>
      </div>

      <div style={container}>
        {/* Income Tools Section */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            Income Tools
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Start Earning Today</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '48px' }}>
          {INCOME_TOOLS.map(t => (
            <ToolCard key={t.id} tool={t} onClick={() => navigate(`/business/${t.id}`)} />
          ))}
        </div>

        {/* Planning Tools Section */}
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            Planning Tools
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Build a Business</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {TOOLS.map(t => (
            <ToolCard key={t.id} tool={t} onClick={() => navigate(`/business/${t.id}`)} />
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '20px 24px', background: 'rgba(255,107,53,0.08)', borderRadius: '12px', border: '1px solid rgba(255,107,53,0.18)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#FF6B35', marginBottom: '4px' }}>Powered by DeepSeek AI</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All outputs are specific to your situation, skill, and country — not generic templates.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
