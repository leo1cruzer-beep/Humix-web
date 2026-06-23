import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DebtFreedom from '../screens/clarity/DebtFreedom.jsx'
import WealthBuilder from '../screens/clarity/WealthBuilder.jsx'
import Budget from '../screens/clarity/Budget.jsx'
import RemittanceOptimizer from '../screens/clarity/RemittanceOptimizer.jsx'
import Markets from '../screens/clarity/Markets.jsx'

const TOOLS = [
  {
    id: 'debt',
    title: 'Debt Freedom Calculator',
    desc: 'Enter your salary, expenses, and total debt. Get your exact freedom date and a personalized payoff plan from AI.',
    icon: '🎯',
    badge: 'Most popular',
    badgeClass: 'badge-blue',
  },
  {
    id: 'wealth',
    title: 'Wealth Builder',
    desc: 'Compound interest projections for your monthly investment. See Year 1, 3, 5, 10 values with AI-personalized advice.',
    icon: '📈',
    badge: 'AI-powered',
    badgeClass: 'badge-green',
  },
  {
    id: 'budget',
    title: 'Budget Tracker',
    desc: 'Add income sources and expense categories. Get your monthly surplus/deficit and AI optimization tips.',
    icon: '📊',
    badge: 'Interactive',
    badgeClass: 'badge-amber',
  },
  {
    id: 'remittance',
    title: 'Remittance Optimizer',
    desc: 'Compare Western Union, Wise, Remitly and more with live rates. AI picks the best service and shows exact savings.',
    icon: '💸',
    badge: 'Live rates',
    badgeClass: 'badge-blue',
  },
  {
    id: 'markets',
    title: 'Live Markets',
    desc: 'Simulated BTC, ETH, SOL, BNB prices updating every 30s. Daily AI market summary on load.',
    icon: '₿',
    badge: 'Live data',
    badgeClass: 'badge-green',
  },
]

function FinanceHome() {
  const navigate = useNavigate()
  const [hov, setHov] = useState(null)

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 0 40px',
        marginBottom: '48px',
      }}>
        <div className="finance-container" style={container}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-blue">Finance</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: '10px' }}>Finance</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '520px' }}>
            Tools for financial freedom — debt payoff, wealth building, budgeting, remittance, and markets.
          </p>
        </div>
      </div>

      <div className="finance-container" style={container}>
        {/* Section label */}
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '20px' }}>
          5 tools available
        </p>

        {/* Tool cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => navigate(`/finance/${tool.id}`)}
              onMouseEnter={() => setHov(tool.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${hov === tool.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
                boxShadow: hov === tool.id ? 'var(--shadow-hover)' : 'none',
                transform: hov === tool.id ? 'translateY(-2px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>
                  {tool.icon}
                </div>
                <span className={`badge ${tool.badgeClass}`} style={{ fontSize: '11px', flexShrink: 0 }}>
                  {tool.badge}
                </span>
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

        {/* Bottom note */}
        <div style={{
          marginTop: '48px',
          padding: '20px 24px',
          background: 'var(--accent-light)',
          borderRadius: '12px',
          border: '1px solid rgba(27,79,216,0.12)',
          display: 'flex', gap: '14px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--accent)', marginBottom: '4px' }}>
              AI-powered financial guidance
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Each tool sends your numbers to DeepSeek AI for personalized, contextual advice — not generic tips.
              Your data stays in your browser session only.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function FinancePage() {
  const { tool } = useParams()

  switch (tool) {
    case 'debt':       return <DebtFreedom />
    case 'wealth':     return <WealthBuilder />
    case 'budget':     return <Budget />
    case 'remittance': return <RemittanceOptimizer />
    case 'markets':    return <Markets />
    default:           return <FinanceHome />
  }
}

const container = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  boxSizing: 'border-box',
}
