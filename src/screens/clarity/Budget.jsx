import { useState } from 'react'
import { Link } from 'react-router-dom'

async function callAI(content) {
  const sessionId = `finance-budget-${Date.now()}`
  const res = await fetch('/api/proxy/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, content }),
  })
  const data = await res.json()
  return data?.assistantMessage?.content || data?.message || data?.content || data?.response || 'AI advice temporarily unavailable'
}

const DEFAULT_INCOME = [
  { id: 1, label: 'Salary', amount: '5000' },
]
const DEFAULT_EXPENSES = [
  { id: 1, label: 'Rent', amount: '1500' },
  { id: 2, label: 'Food', amount: '600' },
  { id: 3, label: 'Transport', amount: '200' },
  { id: 4, label: 'Utilities', amount: '150' },
]

let nextId = 10

function LineItems({ items, setItems, color, addLabel }) {
  function update(id, field, val) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i))
  }
  function remove(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }
  function add() {
    setItems(prev => [...prev, { id: nextId++, label: '', amount: '' }])
  }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              value={item.label}
              onChange={e => update(item.id, 'label', e.target.value)}
              placeholder="Label"
              style={{ ...inputStyle, flex: 1 }}
            />
            <div style={{ position: 'relative', width: '120px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>$</span>
              <input
                value={item.amount}
                onChange={e => update(item.id, 'amount', e.target.value.replace(/[^0-9.]/g, ''))}
                inputMode="decimal"
                placeholder="0"
                style={{ ...inputStyle, paddingLeft: '24px', width: '100%' }}
              />
            </div>
            <button onClick={() => remove(item.id)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        + Add {addLabel}
      </button>
    </div>
  )
}

export default function Budget() {
  const [income, setIncome] = useState(DEFAULT_INCOME)
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES)
  const [aiAdvice, setAiAdvice] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [calculated, setCalculated] = useState(false)

  const totalIncome = income.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
  const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
  const surplus = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((surplus / totalIncome) * 100).toFixed(1) : 0

  async function getAdvice() {
    setCalculated(true)
    setAiAdvice('')
    setAiLoading(true)

    const prompt = `My monthly income is $${totalIncome.toLocaleString()} and expenses are $${totalExpenses.toLocaleString()}. Surplus/deficit is ${surplus >= 0 ? '+' : ''}$${surplus.toLocaleString()}. Give me budget optimization advice in 3-4 sentences.`

    try {
      const advice = await callAI(prompt)
      setAiAdvice(advice)
    } catch {
      setAiAdvice('AI advice temporarily unavailable')
    } finally {
      setAiLoading(false)
    }
  }

  const surplusColor = surplus >= 0 ? '#16A34A' : '#DC2626'

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/finance" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Finance</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Budget Tracker</h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Track income and expenses, get your surplus/deficit, and ask AI what to optimize.
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Income */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={sectionLabel}>Income Sources</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>${totalIncome.toLocaleString()}</div>
              </div>
              <LineItems items={income} setItems={setIncome} color="#16A34A" addLabel="income source" />
            </div>

            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={sectionLabel}>Expenses</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626' }}>${totalExpenses.toLocaleString()}</div>
              </div>
              <LineItems items={expenses} setItems={setExpenses} color="#DC2626" addLabel="expense" />
            </div>

            <button className="btn btn-blue" onClick={getAdvice} style={{ padding: '13px', fontSize: '15px' }}>
              Get AI advice
            </button>
          </div>

          {/* Summary & AI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Summary */}
            <div style={card}>
              <div style={sectionLabel}>Monthly Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Total Income', val: `$${totalIncome.toLocaleString()}`, color: '#16A34A' },
                  { label: 'Total Expenses', val: `$${totalExpenses.toLocaleString()}`, color: '#DC2626' },
                  { label: 'Savings Rate', val: `${savingsRate}%`, color: parseFloat(savingsRate) >= 20 ? '#16A34A' : '#D97706' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Monthly {surplus >= 0 ? 'Surplus' : 'Deficit'}
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: surplusColor }}>
                    {surplus >= 0 ? '+' : ''}${surplus.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget bar */}
            {totalIncome > 0 && (
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Budget Used</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: surplusColor }}>
                    {Math.min(Math.round((totalExpenses / totalIncome) * 100), 999)}%
                  </span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 99, height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: totalExpenses > totalIncome ? '#DC2626' : '#1B4FD8',
                    width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>$0</span>
                  <span>${totalIncome.toLocaleString()} income</span>
                </div>
              </div>
            )}

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
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Analyzing your budget…</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{aiAdvice}</div>
                )}
              </div>
            )}

            {!calculated && (
              <div style={{ ...card, padding: '40px 24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🤖</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>AI budget advice</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Fill in your income and expenses, then click "Get AI advice" for personalized optimization tips.
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
const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0' }
const inputStyle = {
  height: '38px', padding: '0 10px',
  border: '1px solid var(--border)', borderRadius: '8px',
  fontSize: '14px', color: 'var(--text-primary)',
  background: 'var(--input-bg)', fontFamily: 'Inter, sans-serif',
  outline: 'none',
}
