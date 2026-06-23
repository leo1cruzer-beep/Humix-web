import { useState, useEffect } from 'react'

const CURRENCIES = {
  QAR: { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  PKR: { code: 'PKR', symbol: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
}

const COLOR = '#ef4444'
const GREEN = '#059669'
const PURPLE = '#7C3AED'

function useCountUp(target, duration = 900) {
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

function AnimatedBar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(pct, 100)), delay + 100)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div style={{
        height: '100%', background: color, borderRadius: 99,
        width: `${width}%`, transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)'
      }} />
    </div>
  )
}

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ years: 0, months: 0, days: 0 })
      const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000))
      const months = Math.floor((diff % (365.25 * 24 * 3600 * 1000)) / (30.44 * 24 * 3600 * 1000))
      const days = Math.floor((diff % (30.44 * 24 * 3600 * 1000)) / (24 * 3600 * 1000))
      setTimeLeft({ years, months, days })
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [targetDate])
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
      {[
        { val: timeLeft.years, label: 'Years' },
        { val: timeLeft.months, label: 'Months' },
        { val: timeLeft.days, label: 'Days' },
      ].map(({ val, label }) => (
        <div key={label} style={{
          flex: 1, textAlign: 'center',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 12, padding: '12px 6px',
          border: '1px solid rgba(255,255,255,0.25)'
        }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
            {val ?? '--'}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

function calcFajr(salary, expenses, extraIncome, debt) {
  const savings = salary - expenses + extraIncome
  if (savings <= 0 || debt <= 0) return null
  const months = Math.ceil(debt / savings)
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return { date: d, months, savings }
}

export default function DebtFreedom({ onBack }) {
  const [currency, setCurrency] = useState('USD')
  const [salary, setSalary] = useState('5000')
  const [expenses, setExpenses] = useState('3500')
  const [extraIncome, setExtraIncome] = useState('0')
  const [debt, setDebt] = useState('23500')

  const cur = CURRENCIES[currency]
  const salaryNum = parseFloat(salary) || 0
  const expensesNum = parseFloat(expenses) || 0
  const extraNum = parseFloat(extraIncome) || 0
  const debtNum = parseFloat(debt) || 0

  const result = calcFajr(salaryNum, expensesNum, extraNum, debtNum)
  const monthlySavings = result?.savings ?? Math.max(salaryNum - expensesNum + extraNum, 0)
  const expensesExceed = salaryNum > 0 && (salaryNum - expensesNum + extraNum) <= 0

  const freedomDateStr = result?.date
    ? result.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  const animSavings = useCountUp(monthlySavings)
  const animDebt = useCountUp(debtNum)

  const sym = cur.symbol

  function fmt(n) {
    return sym === '$'
      ? `$${n.toLocaleString()}`
      : `${sym} ${n.toLocaleString()}`
  }

  const whatIfExtra = 500
  const whatIfMonths = result
    ? Math.ceil(debtNum / (monthlySavings + whatIfExtra))
    : null
  const monthsSaved = result && whatIfMonths ? result.months - whatIfMonths : null

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12
        }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Debt Freedom</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
          Find your Fajr date — the day you become free
        </p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Currency selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
          {Object.values(CURRENCIES).map(c => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              style={{
                padding: '6px 14px', borderRadius: 99, flexShrink: 0,
                border: `1.5px solid ${currency === c.code ? COLOR : 'var(--border)'}`,
                background: currency === c.code ? '#FEF2F2' : 'var(--bg-card)',
                color: currency === c.code ? COLOR : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.15s'
              }}
            >
              {c.flag} {c.code}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
          padding: 16, marginBottom: 16
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12
          }}>
            Your Numbers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: `Monthly Salary`, val: salary, set: setSalary, icon: '💼', hint: `in ${cur.name}` },
              { label: `Monthly Expenses`, val: expenses, set: setExpenses, icon: '🏠', hint: 'rent + food + bills + remittance' },
              { label: `Extra Income`, val: extraIncome, set: setExtraIncome, icon: '✨', hint: 'freelance / side gigs — enter 0 if none' },
              { label: `Total Debt`, val: debt, set: setDebt, icon: '💳', hint: 'all loans + credit cards combined' },
            ].map(({ label, val, set, icon, hint }) => (
              <div key={label} style={{
                background: 'var(--bg-page)', borderRadius: 10, padding: '10px 12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{sym}</span>
                      <input
                        value={val}
                        onChange={e => set(e.target.value.replace(/[^0-9.]/g, ''))}
                        inputMode="decimal"
                        style={{
                          border: 'none', background: 'transparent', fontSize: 20, fontWeight: 700,
                          color: 'var(--text-primary)', width: '100%', outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{hint}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {expensesExceed && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: 14,
            padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: COLOR, fontSize: 14 }}>Expenses exceed income</div>
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 3 }}>
                Your expenses ({fmt(expensesNum)}) are greater than salary + extra income ({fmt(salaryNum + extraNum)}).
                Cut expenses or add extra income before we can calculate your freedom date.
              </div>
            </div>
          </div>
        )}

        {/* Freedom Date Hero */}
        {freedomDateStr ? (
          <div style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, #a855f7 100%)`,
            borderRadius: 20, padding: '24px 20px', marginBottom: 16
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, textAlign: 'center' }}>
              Your debt-free date is
            </div>
            <div style={{
              fontSize: 34, fontWeight: 900, color: '#fff',
              textAlign: 'center', margin: '6px 0', letterSpacing: '-0.5px', lineHeight: 1.1
            }}>
              {freedomDateStr}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 2 }}>
              {result.months} months · saving {fmt(monthlySavings)}/mo
            </div>
            <Countdown targetDate={result.date} />
          </div>
        ) : !expensesExceed && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '28px 20px', marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36 }}>🌙</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>
              Every dawn begins in darkness
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Enter your numbers to find your freedom date
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
            padding: '14px 12px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Monthly Savings
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: monthlySavings > 0 ? GREEN : COLOR }}>
              {fmt(animSavings)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>salary − expenses + extra</div>
          </div>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
            padding: '14px 12px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Total Debt
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COLOR }}>
              {fmt(animDebt)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
              {result ? `${result.months} months to zero` : 'all loans combined'}
            </div>
          </div>
        </div>

        {/* Progress */}
        {debtNum > 0 && !expensesExceed && (
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
            padding: 16, marginBottom: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Progress to Zero</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>0%</span>
            </div>
            <AnimatedBar pct={0} color={PURPLE} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
              <span>Today</span>
              <span>{freedomDateStr ?? '—'}</span>
            </div>
          </div>
        )}

        {/* What-if scenario */}
        {result && monthsSaved !== null && monthsSaved > 0 && (
          <div style={{
            background: '#EFF6FF', border: '1px solid #bfdbfe', borderRadius: 14,
            padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, color: '#2563EB', fontSize: 13 }}>What if scenario</div>
              <div style={{ fontSize: 12, color: '#1d4ed8', marginTop: 3 }}>
                Save {fmt(whatIfExtra)} more per month → free{' '}
                <strong>{monthsSaved} months earlier</strong> in{' '}
                {new Date(new Date().setMonth(new Date().getMonth() + whatIfMonths))
                  .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
              </div>
            </div>
          </div>
        )}

        {/* Motivational tip */}
        <div style={{
          padding: '14px 16px', background: '#F5F3FF', borderRadius: 14,
          border: `1px solid ${PURPLE}30`, display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: 16 }}>🌙</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: PURPLE }}>Fajr principle</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Every sunrise begins with Fajr. Every debt-free life begins with this number.
              Keep going — every payment brings your freedom closer.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
