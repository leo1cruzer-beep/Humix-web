import { useState, useEffect, useRef } from 'react'

const COLOR = '#ef4444'
const GREEN = '#059669'

function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * e))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

function AnimatedBar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div style={{
        height: '100%', background: color, borderRadius: 99,
        width: `${width}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)'
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
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
      {[
        { val: timeLeft.years, label: 'Years' },
        { val: timeLeft.months, label: 'Months' },
        { val: timeLeft.days, label: 'Days' },
      ].map(({ val, label }) => (
        <div key={label} style={{
          flex: 1, textAlign: 'center', background: 'var(--bg-page)',
          borderRadius: 12, padding: '14px 8px', border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#7C3AED', fontVariantNumeric: 'tabular-nums' }}>
            {val ?? '--'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

function calcFreedomDate(totalDebt, monthlyPayment) {
  if (!totalDebt || !monthlyPayment || monthlyPayment <= 0) return null
  const months = Math.ceil(totalDebt / monthlyPayment)
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d
}

function calcProgress(totalDebt, originalDebt) {
  if (!originalDebt || originalDebt <= 0) return 0
  const paid = originalDebt - totalDebt
  return Math.min(Math.max((paid / originalDebt) * 100, 0), 100)
}

export default function DebtFreedom({ onBack }) {
  const [salary, setSalary] = useState('5000')
  const [expenses, setExpenses] = useState('3500')
  const [totalDebt, setTotalDebt] = useState('23500')
  const [debts, setDebts] = useState([
    { id: 1, name: 'Credit Card', amount: '8500', interest: '18', color: '#ef4444' },
    { id: 2, name: 'Student Loan', amount: '12000', interest: '5', color: '#f97316' },
    { id: 3, name: 'Personal Loan', amount: '3000', interest: '12', color: '#eab308' },
  ])
  const [newDebt, setNewDebt] = useState({ name: '', amount: '', interest: '' })
  const [showAdd, setShowAdd] = useState(false)

  const salaryNum = parseFloat(salary) || 0
  const expensesNum = parseFloat(expenses) || 0
  const monthlyFree = Math.max(salaryNum - expensesNum, 0)
  const debtTotal = debts.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0)
  const freedomDate = calcFreedomDate(debtTotal, monthlyFree)
  const originalDebt = parseFloat(totalDebt) || debtTotal
  const progress = calcProgress(debtTotal, originalDebt)
  const animDebt = useCountUp(debtTotal)

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#2563EB', '#7C3AED', '#059669']

  function addDebt() {
    if (!newDebt.name || !newDebt.amount) return
    const color = COLORS[debts.length % COLORS.length]
    setDebts(prev => [...prev, { id: Date.now(), ...newDebt, color }])
    setNewDebt({ name: '', amount: '', interest: '' })
    setShowAdd(false)
  }

  function removeDebt(id) {
    setDebts(prev => prev.filter(d => d.id !== id))
  }

  const monthlyBreakdown = debts.map(d => {
    const a = parseFloat(d.amount) || 0
    const r = (parseFloat(d.interest) || 0) / 100 / 12
    if (r === 0 || monthlyFree <= 0 || debtTotal <= 0) {
      return { ...d, monthlyPay: ((a / debtTotal) * monthlyFree).toFixed(0), months: Math.ceil(a / Math.max(monthlyFree, 1)) }
    }
    const share = (a / debtTotal) * monthlyFree
    const months = Math.ceil(Math.log(share / (share - a * r)) / Math.log(1 + r))
    return { ...d, monthlyPay: share.toFixed(0), months: isNaN(months) ? '∞' : months }
  })

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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Debt Freedom Plan</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Real calculations · your path to zero debt</p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Inputs */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Your Numbers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Monthly Salary (USD)', val: salary, set: setSalary, icon: '💵' },
              { label: 'Monthly Expenses (USD)', val: expenses, set: setExpenses, icon: '🏠' },
              { label: 'Original Total Debt (USD)', val: totalDebt, set: setTotalDebt, icon: '💳' },
            ].map(({ label, val, set, icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-page)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>{label}</div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Result Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>Monthly Free</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: monthlyFree > 0 ? GREEN : COLOR }}>
              ${monthlyFree.toLocaleString()}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>Total Debt</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLOR }}>
              ${animDebt.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Freedom Date */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Debt Freedom Date</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#7C3AED', marginTop: 4 }}>
              {freedomDate
                ? freedomDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : monthlyFree <= 0 ? 'Increase your savings' : 'Enter your debts'}
            </div>
          </div>
          {freedomDate && <Countdown targetDate={freedomDate} />}
        </div>

        {/* Progress */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Progress to Zero</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>{progress.toFixed(1)}%</span>
          </div>
          <AnimatedBar pct={progress} color={GREEN} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span>Started</span>
            <span>{freedomDate?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) ?? 'Freedom'}</span>
          </div>
        </div>

        {/* Debt List */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Debt Breakdown
            </div>
            <button onClick={() => setShowAdd(v => !v)} style={{
              background: '#EEF2FF', color: '#1B4FD8', border: 'none', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
              {showAdd ? 'Cancel' : '+ Add Debt'}
            </button>
          </div>

          {showAdd && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Debt Name', key: 'name', type: 'text', placeholder: 'e.g. Car Loan' },
                  { label: 'Amount ($)', key: 'amount', type: 'decimal', placeholder: '5000' },
                  { label: 'Interest Rate (%)', key: 'interest', type: 'decimal', placeholder: '8.5' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                    <input
                      value={newDebt[key]}
                      onChange={e => setNewDebt(prev => ({ ...prev, [key]: e.target.value }))}
                      inputMode={type}
                      placeholder={placeholder}
                      style={{
                        width: '100%', background: 'var(--bg-page)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none'
                      }}
                    />
                  </div>
                ))}
                <button onClick={addDebt} style={{
                  background: '#059669', color: '#fff', border: 'none', borderRadius: 10,
                  padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4
                }}>
                  Add Debt
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {debts.map((d, i) => {
              const amt = parseFloat(d.amount) || 0
              const breakdown = monthlyBreakdown[i]
              const pct = debtTotal > 0 ? (amt / debtTotal) * 100 : 0
              return (
                <div key={d.id} style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {parseFloat(d.interest) || 0}% APR · ${breakdown?.monthlyPay}/mo · {breakdown?.months} months
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontWeight: 700, color: d.color, fontVariantNumeric: 'tabular-nums' }}>
                        ${amt.toLocaleString()}
                      </div>
                      <button onClick={() => removeDebt(d.id)} style={{
                        background: '#FEF2F2', border: 'none', borderRadius: 6, width: 24, height: 24,
                        cursor: 'pointer', color: '#ef4444', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>×</button>
                    </div>
                  </div>
                  <AnimatedBar pct={pct} color={d.color} delay={i * 120} />
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, textAlign: 'right' }}>
                    {pct.toFixed(0)}% of total
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Savings Breakdown */}
        {monthlyFree > 0 && debtTotal > 0 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Monthly Payment Plan
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total monthly allocation</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>${monthlyFree.toLocaleString()}</span>
            </div>
            {monthlyBreakdown.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: d.color }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: d.color }}>${d.monthlyPay}/mo</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
