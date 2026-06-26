import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOOLS = [
  {
    id: 'content',
    title: 'AI Content Writer',
    desc: 'Write for LinkedIn, Twitter, Instagram, Blog, or Facebook. Set your topic and tone — get platform-ready copy instantly.',
    icon: '✍️',
    badge: 'Most popular',
    badgeClass: 'badge-blue',
  },
  {
    id: 'social',
    title: 'Social Media Pack',
    desc: 'One product, 5 platforms. Get a complete content pack for Twitter, LinkedIn, Instagram, Facebook, and TikTok in one shot.',
    icon: '📱',
    badge: '5 platforms',
    badgeClass: 'badge-green',
  },
  {
    id: 'email',
    title: 'Email Campaign Writer',
    desc: 'A/B subject lines, preview text, full email body, CTA, P.S. line, and a sending strategy — everything you need to send.',
    icon: '📧',
    badge: 'High-converting',
    badgeClass: 'badge-amber',
  },
  {
    id: 'brand',
    title: 'Brand Voice Creator',
    desc: "Personality traits, taglines, vocabulary guide, and messaging do's and don'ts. Give your brand a consistent voice.",
    icon: '🎙️',
    badge: 'Branding',
    badgeClass: 'badge-blue',
  },
]

export default function CreativePage() {
  const navigate = useNavigate()
  const [hov, setHov] = useState(null)

  return (
    <main className="page-enter page-transition" style={{ paddingBottom: '80px' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px', marginBottom: '48px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-blue">Creative</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: '10px' }}>Creative Tools</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            Content, campaigns, and brand voice — AI tools for creators, marketers, and founders who need to show up consistently.
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
              onClick={() => navigate(`/creative/${t.id}`)}
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

        <div style={{ marginTop: '48px', padding: '20px 24px', background: 'rgba(191,90,242,0.08)', borderRadius: '12px', border: '1px solid rgba(191,90,242,0.18)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#BF5AF2', marginBottom: '4px' }}>Powered by DeepSeek AI</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All content is generated fresh for your specific topic, product, or brand — not recycled templates. Copy, paste, post.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
