import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const COLOR = '#059669'
const ACCENT = '#7C3AED'

function fmt(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', fontSize: 13
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>Year {label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: p.color }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setVal(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

export default function WealthBuilder({ onBack }) {
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('8')
  const [initial, setInitial] = useState('1000')
  const [years, setYears] = useState(10)

  const monthlyNum = parseFloat(monthly) || 0
  const rateNum = parseFloat(rate) || 0
  const initialNum = parseFloat(initial) || 0
  const r = rateNum / 100 / 12

  const data = useMemo(() => {
    const out = []
    let balance = initialNum
    let contributed = initialNum
    for (let y = 0; y <= years; y++) {
      out.push({
        year: y,
        'With Returns': Math.round(balance),
        'Contributions': Math.round(contributed),
      })
      if (y < years) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + monthlyNum
          contributed += monthlyNum
        }
      }
    }
    return out
  }, [monthlyNum, r, initialNum, years])

  const finalVal = data[data.length - 1]?.['With Returns'] ?? 0
  const totalContrib = data[data.length - 1]?.['Contributions'] ?? 0
  const gains = finalVal - totalContrib
  const multiplier = totalContrib > 0 ? (finalVal / totalContrib).toFixed(2) : '—'

  const animFinal = useCountUp(finalVal)

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12
        }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Wealth Builder</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Compound interest calculator · {years}-year projection</p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Hero number */}
        <div style={{
          background: `linear-gradient(135deg, ${COLOR}, #34d399)`,
          borderRadius: 20, padding: '24px 20px', marginBottom: 16, textAlign: 'center'
        }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            In {years} years your portfolio will be
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', margin: '8px 0', letterSpacing: '-1px' }}>
            {fmt(animFinal)}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            {multiplier}× your money · +{fmt(gains)} from compound growth
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'You Invest', val: fmt(totalContrib), color: ACCENT },
            { label: 'Interest Earned', val: fmt(gains), color: COLOR },
            { label: 'Total Value', val: fmt(finalVal), color: '#2563EB' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
              padding: '12px 8px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Adjust Your Plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Monthly Investment ($)', val: monthly, set: setMonthly, icon: '💰', hint: `$${(monthlyNum * 12).toLocaleString()}/year` },
              { label: 'Initial Investment ($)', val: initial, set: setInitial, icon: '🏦', hint: 'Starting balance' },
              { label: 'Expected Annual Return (%)', val: rate, set: setRate, icon: '📈', hint: 'S&P500 avg ≈ 10%' },
            ].map(({ label, val, set, icon, hint }) => (
              <div key={label} style={{
                background: 'var(--bg-page)', borderRadius: 12, padding: '10px 14px',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10
              }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
                  <input
                    value={val}
                    onChange={e => set(e.target.value.replace(/[^0-9.]/g, ''))}
                    inputMode="decimal"
                    style={{
                      border: 'none', background: 'transparent', fontSize: 18, fontWeight: 700,
                      color: 'var(--text-primary)', width: '100%', outline: 'none'
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{hint}</span>
              </div>
            ))}

            {/* Years slider */}
            <div style={{ background: 'var(--bg-page)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Time Horizon</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLOR }}>{years} years</span>
              </div>
              <input
                type="range" min="1" max="40" value={years}
                onChange={e => setYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: COLOR }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                <span>1 yr</span><span>10 yrs</span><span>20 yrs</span><span>40 yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            {years}-Year Growth Projection
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Investment vs compound returns over time
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wbGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLOR} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="wbGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                tickFormatter={v => `Yr ${v}`}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
                axisLine={false} tickLine={false} width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone" dataKey="Contributions"
                stroke={ACCENT} fill="url(#wbGrad2)" strokeWidth={2}
                dot={false} animationDuration={1200}
              />
              <Area
                type="monotone" dataKey="With Returns"
                stroke={COLOR} fill="url(#wbGrad1)" strokeWidth={2.5}
                dot={false} animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Year-by-year table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Year-by-Year Breakdown</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-page)' }}>
                  {['Year', 'Invested', 'Value', 'Gain'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0 || i === data.length - 1).map(row => {
                  const g = row['With Returns'] - row['Contributions']
                  return (
                    <tr key={row.year} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{row.year}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{fmt(row['Contributions'])}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: COLOR }}>{fmt(row['With Returns'])}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: '#22c55e', fontWeight: 600 }}>+{fmt(g)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
