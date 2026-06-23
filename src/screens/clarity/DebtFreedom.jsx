import { useState } from 'react'
import { Link } from 'react-router-dom'

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$',   name: 'US Dollar',        flag: '🇺🇸' },
  QAR: { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal',     flag: '🇶🇦' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham',        flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal',       flag: '🇸🇦' },
  PKR: { code: 'PKR', symbol: 'PKR', name: 'Pakistani Rupee',   flag: '🇵🇰' },
}

async function callAI(content) {
  const sessionId = `finance-debt-${Date.now()}`
  const res = await fetch('/api/proxy/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, content }),
  })
  const data = await res.json()
  return data?.message || data?.content || data?.response || JSON.stringify(data)
}

function fmt(sym, n) {
  const num = Math.round(n).toLocaleString()
  return sym === '$' ? `$${num}` : `${sym} ${num}`
}

function freeDate(months) {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function ProgressBar({ pct }) {
  return (
    <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%', borderRadius: 99,
        background: 'var(--accent)',
        width: `${Math.min(pct, 100)}%`,
        transition: 'width 0.8s ease',
      }} />
    </div>
  )
}

export default function DebtFreedom() {
  const [currency, setCurrency] = useState('USD')
  const [salary, setSalary] = useState('')
  const [expenses, setExpenses] = useState('')
  const [debt, setDebt] = useState('')
  const [result, setResult] = useState(null)
  const [aiAdvice, setAiAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')

  const cur = CURRENCIES[currency]

  async function calculate() {
    setError('')
    const s = parseFloat(salary) || 0
    const e = parseFloat(expenses) || 0
    const d = parseFloat(debt) || 0

    if (!s || !d) { setError('Please enter salary and total debt.'); return }
    if (s <= e) { setError('Salary must be greater than expenses.'); return }

    const monthlySavings = s - e
    const months = Math.ceil(d / monthlySavings)
    const freedomDate = freeDate(months)
    const pct = Math.min((monthlySavings / d) * 100 * 12, 100)

    setResult({ s, e, d, monthlySavings, months, freedomDate, pct })
    setAiAdvice('')
    setLoading(false)

    // AI call
    setAiLoading(true)
    const prompt = `I earn ${cur.symbol} ${s.toLocaleString()} per month. My monthly expenses are ${cur.symbol} ${e.toLocaleString()}. My total debt is ${cur.symbol} ${d.toLocaleString()}. My monthly savings are ${cur.symbol} ${monthlySavings.toLocaleString()}. At this rate I will be debt free in ${months} months (${freedomDate}). Give me 3 specific, actionable tips to become debt-free faster. Be concise and practical. Currency: ${currency}.`

    try {
      const advice = await callAI(prompt)
      setAiAdvice(advice)
    } catch {
      setAiAdvice('Could not load AI advice. Your calculation above is still accurate.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Page header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/finance" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← Finance
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Debt Freedom Calculator
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Enter your numbers to find your exact debt-free date and get AI-powered advice.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left: Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Currency */}
            <div style={card}>
              <div style={sectionLabel}>Currency</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.values(CURRENCIES).map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={currency === c.code ? 'filter-pill active' : 'filter-pill'}
                    style={{ fontSize: '13px' }}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={card}>
              <div style={sectionLabel}>Your Numbers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Monthly Salary', val: salary, set: setSalary, placeholder: '5,000', hint: 'Take-home pay after tax' },
                  { label: 'Monthly Expenses', val: expenses, set: setExpenses, placeholder: '3,500', hint: 'Rent, food, bills, transport' },
                  { label: 'Total Debt', val: debt, set: setDebt, placeholder: '23,500', hint: 'All loans + credit cards combined' },
                ].map(({ label, val, set, placeholder, hint }) => (
                  <div key={label}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                      {label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)',
                      }}>
                        {cur.symbol}
                      </span>
                      <input
                        value={val}
                        onChange={e => set(e.target.value.replace(/[^0-9.]/g, ''))}
                        inputMode="decimal"
                        placeholder={placeholder}
                        style={{
                          width: '100%', height: '44px',
                          paddingLeft: cur.symbol === '$' ? '28px' : '52px',
                          paddingRight: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '16px', fontWeight: 600,
                          color: 'var(--text-primary)',
                          background: 'var(--input-bg)',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'border-color 0.18s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#1B4FD8'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{hint}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <button
                className="btn btn-blue"
                onClick={calculate}
                style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '15px' }}
              >
                Calculate my freedom date
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result ? (
              <>
                {/* Freedom date hero */}
                <div style={{
                  ...card,
                  border: '1px solid var(--accent)',
                  background: 'var(--accent-light)',
                  textAlign: 'center',
                  padding: '32px 24px',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Your Fajr Date
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
                    {result.freedomDate}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {result.months} months from today
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Monthly Savings', val: fmt(cur.symbol, result.monthlySavings), color: '#16A34A' },
                    { label: 'Total Debt', val: fmt(cur.symbol, result.d), color: '#DC2626' },
                    { label: 'Months Remaining', val: result.months, color: 'var(--accent)' },
                    { label: 'Annual Payoff', val: fmt(cur.symbol, result.monthlySavings * 12), color: 'var(--text-primary)' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ ...card, textAlign: 'center', padding: '16px 12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Payoff Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>0% → 100%</span>
                  </div>
                  <ProgressBar pct={0} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Today · {fmt(cur.symbol, result.d)} owed</span>
                    <span>{result.freedomDate} · debt free</span>
                  </div>
                </div>

                {/* AI Advice */}
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '16px' }}>🤖</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Advice</span>
                    <span className="badge badge-blue" style={{ fontSize: '10px', marginLeft: 'auto' }}>DeepSeek</span>
                  </div>
                  {aiLoading ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 0' }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Analyzing your finances…</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                      {aiAdvice}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ ...card, padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎯</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Your results will appear here
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Fill in your numbers and click "Calculate" to see your debt-free date and AI advice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }
const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }
const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }
