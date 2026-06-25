import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useActivityLogger } from '../../hooks/useActivityLogger'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

async function callAI(prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324',
      max_tokens: 200,
      messages: [
        { role: 'system', content: 'Respond in English only. Be concise. 2-3 sentences max.' },
        { role: 'user', content: prompt },
      ],
    }),
  })
  const data = await response.json()
  return data.choices[0].message.content
}

function fmt(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px' }}>
      <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Year {label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function WealthBuilder() {
  const [monthly, setMonthly] = useState('500')
  const [initial, setInitial] = useState('1000')
  const [rate, setRate] = useState('8')
  const [years, setYears] = useState(10)
  const [aiAdvice, setAiAdvice] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [calculated, setCalculated] = useState(false)
  const { logActivity } = useActivityLogger()

  const monthlyNum = parseFloat(monthly) || 0
  const initialNum = parseFloat(initial) || 0
  const rateNum = parseFloat(rate) || 0
  const r = rateNum / 100 / 12

  const data = useMemo(() => {
    const out = []
    let balance = initialNum
    let contributed = initialNum
    for (let y = 0; y <= years; y++) {
      out.push({ year: y, 'With Returns': Math.round(balance), 'Contributions': Math.round(contributed) })
      if (y < years) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + monthlyNum
          contributed += monthlyNum
        }
      }
    }
    return out
  }, [monthlyNum, initialNum, r, years])

  const finalVal = data[data.length - 1]?.['With Returns'] ?? 0
  const totalContrib = data[data.length - 1]?.['Contributions'] ?? 0
  const gains = finalVal - totalContrib

  const snapshots = [1, 3, 5, 10].map(y => {
    const row = data[Math.min(y, data.length - 1)]
    return { year: y, value: row?.['With Returns'] ?? 0, contrib: row?.['Contributions'] ?? 0 }
  })

  async function calculate() {
    setCalculated(true)
    setAiAdvice('')
    setAiLoading(true)
    const prompt = `I can invest ${monthlyNum} per month for ${years} years at ${rateNum}% return. Give me wealth building advice in 3-4 sentences.`
    try {
      const advice = await callAI(prompt)
      setAiAdvice(advice)
      logActivity('Wealth Builder', 'Finance', advice)
    } catch {
      setAiAdvice('AI advice temporarily unavailable')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <main className="page-enter" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div className="finance-container" style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/finance" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Finance</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>📈</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Wealth Builder</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Compound interest calculator with AI-personalized advice.
          </p>
        </div>
      </div>

      <div className="finance-container" style={container}>
        <div className="finance-two-col" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={card}>
              <div style={sectionLabel}>Investment Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Monthly Investment', val: monthly, set: setMonthly, prefix: '$', hint: 'How much you invest each month' },
                  { label: 'Initial Investment', val: initial, set: setInitial, prefix: '$', hint: 'Starting lump sum (can be 0)' },
                  { label: 'Expected Annual Return', val: rate, set: setRate, prefix: '%', suffix: true, hint: 'S&P 500 average ≈ 10%' },
                ].map(({ label, val, set, prefix, suffix, hint }) => (
                  <div key={label}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      {!suffix && <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{prefix}</span>}
                      <input
                        value={val}
                        onChange={e => set(e.target.value.replace(/[^0-9.]/g, ''))}
                        inputMode="decimal"
                        style={{
                          width: '100%', height: '42px',
                          paddingLeft: suffix ? '12px' : '28px',
                          paddingRight: suffix ? '28px' : '12px',
                          border: '1px solid var(--border)', borderRadius: '8px',
                          fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)',
                          background: 'var(--input-bg)', fontFamily: 'Inter, sans-serif',
                        }}
                        onFocus={e => e.target.style.borderColor = '#6366F1'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                      {suffix && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{prefix}</span>}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{hint}</p>
                  </div>
                ))}

                {/* Years slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Time Horizon</label>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{years} years</span>
                  </div>
                  <input
                    type="range" min="1" max="40" value={years}
                    onChange={e => setYears(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#6366F1' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>1 yr</span><span>10</span><span>20</span><span>40 yrs</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-blue" onClick={calculate} style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '15px' }}>
                Calculate
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hero */}
            <div className="finance-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: `In ${years} years`, val: fmt(finalVal), color: 'var(--accent)', big: true },
                { label: 'You invest', val: fmt(totalContrib), color: 'var(--text-primary)' },
                { label: 'Compound gains', val: `+${fmt(gains)}`, color: '#16A34A' },
              ].map(({ label, val, color, big }) => (
                <div key={label} style={{ ...card, textAlign: 'center', padding: '20px 16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</div>
                  <div style={{ fontSize: big ? '28px' : '22px', fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Year snapshots */}
            <div style={card}>
              <div style={sectionLabel}>Projections</div>
              <div className="finance-snap-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {snapshots.map(({ year, value, contrib }) => (
                  <div key={year} style={{ textAlign: 'center', padding: '14px 8px', background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Year {year}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>{fmt(value)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{fmt(contrib)} in</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={card}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{years}-Year Growth Chart</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Investments vs compound returns</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={v => `Yr ${v}`} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`} axisLine={false} tickLine={false} width={52} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Contributions" stroke="#16A34A" fill="url(#wGrad2)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="With Returns" stroke="#6366F1" fill="url(#wGrad1)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Advice */}
            {calculated && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Advice</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px', marginLeft: 'auto' }}>DeepSeek</span>
                </div>
                {aiLoading ? (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Analyzing your plan…</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{aiAdvice}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }
const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }
