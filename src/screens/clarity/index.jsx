import { useState, useEffect } from 'react'
import DebtFreedom from './DebtFreedom'
import WealthBuilder from './WealthBuilder'
import Budget from './Budget'
import Remittance from './Remittance'
import Markets from './Markets'

const COLOR = '#059669'
const BG = '#ECFDF5'

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

function ClarityHome({ onNav }) {
  const netWorth = useCountUp(47250)

  const MODULES = [
    {
      id: 'debt',
      label: 'Debt Freedom',
      icon: '🔴',
      desc: 'Calculate your freedom date',
      stat: 'Dec 2027',
      color: '#ef4444',
      bg: '#FEF2F2',
    },
    {
      id: 'wealth',
      label: 'Wealth Builder',
      icon: '📈',
      desc: 'Compound interest projections',
      stat: '$47,250',
      color: COLOR,
      bg: BG,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: '📊',
      desc: 'Track income vs expenses',
      stat: '$2,215 saved',
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      id: 'remittance',
      label: 'Remittance',
      icon: '💸',
      desc: 'Best USD rates to PKR/INR/BDT',
      stat: 'Live rates',
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      id: 'markets',
      label: 'Markets',
      icon: '₿',
      desc: 'Crypto prices & fear index',
      stat: 'BTC $97,450',
      color: '#f97316',
      bg: '#FFF7ED',
    },
  ]

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', background: `linear-gradient(135deg, ${COLOR}, #34d399)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 22, color: '#fff' }}>◈</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>CLARITY</span>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 8px', borderRadius: 99, fontWeight: 600, marginLeft: 4 }}>
            Finance
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Net Worth</div>
        <div style={{ fontSize: 46, fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
          ${netWorth.toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
          ▲ +$247 today · +2.3% this month
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Monthly Free', val: '$1,500', color: COLOR },
            { label: 'Total Debt', val: '$23.5K', color: '#ef4444' },
            { label: 'Savings Rate', val: '28%', color: '#2563EB' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
              padding: '12px 10px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Module grid */}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Finance Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => onNav(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.18s ease', width: '100%'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.boxShadow = `0 2px 12px ${m.color}20` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, background: m.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0
              }}>
                {m.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{m.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.stat}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>→</div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: 20, padding: '14px 16px', background: BG, borderRadius: 14,
          border: `1px solid ${COLOR}30`, display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: COLOR }}>Financial tip</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Following the 50/30/20 rule: 50% needs, 30% wants, 20% savings &amp; debt repayment builds long-term wealth.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Clarity() {
  const [screen, setScreen] = useState('home')

  const goBack = () => setScreen('home')

  switch (screen) {
    case 'debt':       return <DebtFreedom onBack={goBack} />
    case 'wealth':     return <WealthBuilder onBack={goBack} />
    case 'budget':     return <Budget onBack={goBack} />
    case 'remittance': return <Remittance onBack={goBack} />
    case 'markets':    return <Markets onBack={goBack} />
    default:           return <ClarityHome onNav={setScreen} />
  }
}
