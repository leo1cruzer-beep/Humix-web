import { useState, useEffect, useRef } from 'react'
import { REMITTANCE_RATES, INITIAL_PRICES } from '../data'

const COLOR = '#059669'
const BG = '#ECFDF5'

// Sparkline SVG chart
function LineChart({ data, color, height = 80 }) {
  const w = 280, h = height
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 16) - 8}`)
  const path = `M${pts.join(' L')}`
  const area = `M${pts[0]} L${pts.join(' L')} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg" style={{ height }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Pie chart for budget
function PieChart({ segments }) {
  const r = 52, cx = 64, cy = 64
  let angle = -Math.PI / 2
  const paths = segments.map(seg => {
    const a = (seg.pct / 100) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    angle += a
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle)
    const large = a > Math.PI ? 1 : 0
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color: seg.color }
  })
  return (
    <svg viewBox="0 0 128 128" width={128} height={128}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
      <circle cx={64} cy={64} r={30} fill="white" />
    </svg>
  )
}

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return val
}

// ── ClarityHome ───────────────────────────────────────────────────────────
function ClarityHome({ onNav }) {
  const netWorth = useCountUp(47250)
  const [mode, setMode] = useState('wealth')
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>◈</span>
          <h1 style={{ color: COLOR }}>CLARITY</h1>
        </div>
        <p>Your financial intelligence</p>
      </div>

      <div className="section">
        <div className="card" style={{ background: COLOR, color: '#fff', textAlign: 'center', padding: '24px 20px' }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Net Worth</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 42, fontWeight: 700 }}>
            ${netWorth.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>▲ +$247 today · +2.3% this month</div>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', padding: 4, marginBottom: 16 }}>
          {['debt', 'wealth'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, transition: 'all 0.2s ease',
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? COLOR : 'var(--text2)',
              boxShadow: mode === m ? 'var(--shadow)' : 'none',
              fontFamily: 'var(--font-body)'
            }}>
              {m === 'debt' ? '🔴 Debt Mode' : '🟢 Wealth Mode'}
            </button>
          ))}
        </div>
        {mode === 'debt' ? (
          <button className="btn btn-full btn-outline" onClick={() => onNav('debt')} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
            View Debt Freedom Plan →
          </button>
        ) : (
          <button className="btn btn-full" onClick={() => onNav('wealth')} style={{ background: COLOR, color: '#fff' }}>
            View Wealth Builder →
          </button>
        )}
      </div>

      <div className="section">
        <div className="section-title">Quick Access</div>
        <div className="grid-2">
          {[
            { label: 'Budget', icon: '📊', screen: 'budget', desc: 'Daily limit: $52' },
            { label: 'Remittance', icon: '💸', screen: 'remittance', desc: 'Best rates today' },
            { label: 'Markets', icon: '📈', screen: 'markets', desc: 'BTC $97,450' },
            { label: 'Reports', icon: '📋', screen: 'budget', desc: 'June summary' },
          ].map(item => (
            <button key={item.label} className="card" onClick={() => onNav(item.screen)}
              style={{ textAlign: 'left', border: 'none', cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ClarityDebt ───────────────────────────────────────────────────────────
function ClarityDebt({ onBack }) {
  const debt = useCountUp(23500)
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Debt Freedom Plan</h1>
        <p>You're on track to be debt-free</p>
      </div>
      <div className="section">
        <div className="card" style={{ background: '#FEF2F2', borderLeft: '4px solid #ef4444', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 2 }}>Total Debt</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: '#ef4444' }}>
            ${debt.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Across 3 accounts</div>
        </div>
        <div className="stat-row">
          <div className="stat-box"><div className="stat-num" style={{ color: COLOR }}>$850</div><div className="stat-label">Monthly saved</div></div>
          <div className="stat-box"><div className="stat-num" style={{ fontSize: 16, color: '#7C3AED' }}>Dec 2027</div><div className="stat-label">Freedom date</div></div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Progress</span>
            <span style={{ color: COLOR, fontWeight: 700 }}>34%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '34%', background: COLOR }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text2)' }}>
            <span>Started Jan 2024</span>
            <span>Dec 2027</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Debt Breakdown</div>
        {[
          { name: 'Credit Card', amount: 8500, interest: '18%', color: '#ef4444' },
          { name: 'Student Loan', amount: 12000, interest: '5%', color: '#f97316' },
          { name: 'Personal Loan', amount: 3000, interest: '12%', color: '#eab308' },
        ].map(d => (
          <div key={d.name} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Interest: {d.interest}</div>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: d.color }}>
                ${d.amount.toLocaleString()}
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(1 - d.amount / 23500) * 100}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ClarityWealth ─────────────────────────────────────────────────────────
const CHART_DATA = [28000, 31000, 29500, 34000, 38000, 36500, 41000, 44000, 43500, 47250]

function ClarityWealth({ onBack }) {
  const portfolio = useCountUp(47250)
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Wealth Builder</h1>
        <p>Your portfolio at a glance</p>
      </div>
      <div className="section">
        <div className="card" style={{ background: BG }}>
          <div style={{ fontSize: 13, color: COLOR, marginBottom: 2 }}>Portfolio Value</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 38, fontWeight: 700, color: COLOR }}>
            ${portfolio.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>▲ +68.8% over 3 years</div>
          <LineChart data={CHART_DATA} color={COLOR} height={100} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
            <span>2016</span><span>2018</span><span>2020</span><span>2022</span><span>2026</span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Allocation</div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PieChart segments={[
              { pct: 45, color: '#2563EB' },
              { pct: 30, color: '#7C3AED' },
              { pct: 25, color: COLOR },
            ]} />
            <div style={{ flex: 1 }}>
              {[
                { label: 'Stocks', pct: 45, color: '#2563EB', val: '$21,263' },
                { label: 'Crypto', pct: 30, color: '#7C3AED', val: '$14,175' },
                { label: 'Cash', pct: 25, color: COLOR, val: '$11,812' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: item.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item.pct}%</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ClarityBudget ─────────────────────────────────────────────────────────
function ClarityBudget({ onBack }) {
  const CATS = [
    { name: 'Food', icon: '🍔', spent: 620, budget: 700, color: '#f97316' },
    { name: 'Transport', icon: '🚗', spent: 280, budget: 300, color: '#2563EB' },
    { name: 'Rent', icon: '🏠', spent: 1200, budget: 1200, color: '#7C3AED' },
    { name: 'Health', icon: '💊', spent: 150, budget: 250, color: '#059669' },
    { name: 'Entertainment', icon: '🎮', spent: 85, budget: 200, color: '#EA580C' },
    { name: 'Savings', icon: '💰', spent: 850, budget: 850, color: '#22c55e' },
  ]
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Budget</h1>
        <p>June 2026 overview</p>
      </div>
      <div className="section">
        <div className="card" style={{ background: BG, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div><div style={{ fontSize: 12, color: 'var(--text2)' }}>Income</div><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: COLOR }}>$5,400</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 12, color: 'var(--text2)' }}>Expenses</div><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: '#ef4444' }}>$3,185</div></div>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: '59%', background: `linear-gradient(90deg, ${COLOR}, #34d399)` }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: COLOR, marginTop: 8, fontWeight: 600 }}>
            Daily limit: $52 · 9 days left
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CATS.map(c => (
            <div key={c.name} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}>${c.spent} / ${c.budget}</span>
              </div>
              <div className="progress-bar" style={{ height: 5 }}>
                <div className="progress-fill" style={{ width: `${(c.spent / c.budget) * 100}%`, background: c.spent >= c.budget ? '#ef4444' : c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ClarityRemittance ─────────────────────────────────────────────────────
function ClarityRemittance({ onBack }) {
  const [amount, setAmount] = useState('100')
  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Remittance</h1>
        <p>Best rates for sending money home</p>
      </div>
      <div className="section">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>Send amount (USD)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🇺🇸</span>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
              style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, outline: 'none', color: 'var(--text)' }}
              inputMode="numeric"
            />
            <span style={{ color: 'var(--text2)', fontWeight: 600 }}>USD</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {REMITTANCE_RATES.map(r => {
            const received = (parseFloat(amount || '0') * r.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })
            return (
              <div key={r.currency} className="rate-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{r.flag}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.currency}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>via {r.provider}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16 }}>
                    {received} {r.currency}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>1 USD = {r.rate}</div>
                </div>
                {r.best && <span style={{ background: BG, color: COLOR, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, marginLeft: 8 }}>BEST</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── ClarityMarkets ────────────────────────────────────────────────────────
function ClarityMarkets({ onBack }) {
  const [prices, setPrices] = useState(INITIAL_PRICES)
  const [changes, setChanges] = useState({ BTC: 0, ETH: 0, SOL: 0, BNB: 0 })

  useEffect(() => {
    const tick = () => {
      setPrices(p => {
        const next = {}
        const ch = {}
        Object.keys(p).forEach(k => {
          const pct = (Math.random() - 0.5) * 0.01
          next[k] = Math.round(p[k] * (1 + pct) * 100) / 100
          ch[k] = pct * 100
        })
        setChanges(ch)
        return next
      })
    }
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const ICONS = { BTC: '₿', ETH: 'Ξ', SOL: '◎', BNB: '⬡' }
  const COLORS = { BTC: '#f97316', ETH: '#6366f1', SOL: '#8b5cf6', BNB: '#f59e0b' }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Markets</h1>
        <p>Live crypto prices · updates every 30s</p>
      </div>
      <div className="section">
        {Object.entries(prices).map(([coin, price]) => (
          <div key={coin} className="market-row">
            <div style={{ width: 40, height: 40, borderRadius: 20, background: COLORS[coin] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: COLORS[coin], fontWeight: 700 }}>
              {ICONS[coin]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{coin}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Cryptocurrency</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16 }}>
                ${price.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: changes[coin] >= 0 ? '#22c55e' : '#ef4444' }}>
                {changes[coin] >= 0 ? '▲' : '▼'} {Math.abs(changes[coin]).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Clarity (router) ──────────────────────────────────────────────────────
export default function Clarity() {
  const [screen, setScreen] = useState('home')

  if (screen === 'debt') return <ClarityDebt onBack={() => setScreen('home')} />
  if (screen === 'wealth') return <ClarityWealth onBack={() => setScreen('home')} />
  if (screen === 'budget') return <ClarityBudget onBack={() => setScreen('home')} />
  if (screen === 'remittance') return <ClarityRemittance onBack={() => setScreen('home')} />
  if (screen === 'markets') return <ClarityMarkets onBack={() => setScreen('home')} />
  return <ClarityHome onNav={setScreen} />
}
