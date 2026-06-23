import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const DEFAULT_CATS = [
  { id: 1, name: 'Rent', icon: '🏠', budget: 1200, spent: 1200, color: '#7C3AED' },
  { id: 2, name: 'Food', icon: '🍔', budget: 700, spent: 620, color: '#f97316' },
  { id: 3, name: 'Transport', icon: '🚗', budget: 300, spent: 280, color: '#2563EB' },
  { id: 4, name: 'Health', icon: '💊', budget: 250, spent: 150, color: '#059669' },
  { id: 5, name: 'Entertainment', icon: '🎮', budget: 200, spent: 85, color: '#ea580c' },
  { id: 6, name: 'Savings', icon: '💰', budget: 850, spent: 850, color: '#22c55e' },
]

const PALETTE = ['#7C3AED', '#f97316', '#2563EB', '#059669', '#ea580c', '#22c55e', '#ef4444', '#eab308', '#06b6d4', '#ec4899']

const daysInCurrentMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12
    }}>
      <div style={{ fontWeight: 600, color: d.payload.color }}>{d.name}</div>
      <div style={{ color: 'var(--text-primary)', marginTop: 2 }}>${d.value.toLocaleString()}</div>
      <div style={{ color: 'var(--text-secondary)' }}>{d.payload.pct?.toFixed(1)}%</div>
    </div>
  )
}

function AnimatedBar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(pct, 100)), delay + 80)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, overflow: 'hidden', marginTop: 6 }}>
      <div style={{
        height: '100%', borderRadius: 99, background: pct > 100 ? '#ef4444' : color,
        width: `${width}%`, transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)'
      }} />
    </div>
  )
}

export default function Budget({ onBack }) {
  const [income, setIncome] = useState('5400')
  const [cats, setCats] = useState(DEFAULT_CATS)
  const [newCat, setNewCat] = useState({ name: '', icon: '📦', budget: '', spent: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editSpent, setEditSpent] = useState('')
  const [activeMonth] = useState(() => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

  const incomeNum = parseFloat(income) || 0
  const totalSpent = cats.reduce((s, c) => s + c.spent, 0)
  const totalBudget = cats.reduce((s, c) => s + c.budget, 0)
  const remaining = incomeNum - totalSpent
  const savingsRate = incomeNum > 0 ? ((remaining / incomeNum) * 100).toFixed(1) : 0
  const daysLeft = daysInCurrentMonth() - new Date().getDate()
  const dailyLimit = daysLeft > 0 ? ((incomeNum - totalSpent) / daysLeft).toFixed(0) : 0

  const pieData = cats.map(c => ({
    name: c.name, value: c.spent, color: c.color,
    pct: totalSpent > 0 ? (c.spent / totalSpent) * 100 : 0
  })).filter(d => d.value > 0)

  function addCat() {
    if (!newCat.name) return
    const color = PALETTE[cats.length % PALETTE.length]
    setCats(prev => [...prev, {
      id: Date.now(), ...newCat, color,
      budget: parseFloat(newCat.budget) || 0,
      spent: parseFloat(newCat.spent) || 0,
    }])
    setNewCat({ name: '', icon: '📦', budget: '', spent: '' })
    setShowAdd(false)
  }

  function removeCat(id) {
    setCats(prev => prev.filter(c => c.id !== id))
  }

  function saveEdit(id) {
    setCats(prev => prev.map(c => c.id === id ? { ...c, spent: parseFloat(editSpent) || 0 } : c))
    setEditId(null)
    setEditSpent('')
  }

  const overBudget = cats.filter(c => c.spent > c.budget)

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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Budget Tracker</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{activeMonth}</p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Income Input */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
          padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 20 }}>💵</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Monthly Income</div>
            <input
              value={income}
              onChange={e => setIncome(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              style={{
                border: 'none', background: 'transparent', fontSize: 22, fontWeight: 700,
                color: '#059669', width: '100%', outline: 'none'
              }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Daily limit</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: parseFloat(dailyLimit) > 0 ? '#059669' : '#ef4444' }}>
              ${dailyLimit}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Spent', val: `$${totalSpent.toLocaleString()}`, color: '#ef4444', sub: `of $${totalBudget.toLocaleString()}` },
            { label: 'Remaining', val: `$${remaining.toLocaleString()}`, color: remaining >= 0 ? '#059669' : '#ef4444', sub: `${daysLeft} days left` },
            { label: 'Savings Rate', val: `${savingsRate}%`, color: parseFloat(savingsRate) >= 20 ? '#059669' : '#f97316', sub: 'of income' },
          ].map(({ label, val, color, sub }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', padding: '12px 10px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Progress bar overall */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Budget Used</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: totalSpent > incomeNum ? '#ef4444' : '#059669' }}>
              {incomeNum > 0 ? ((totalSpent / incomeNum) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <AnimatedBar pct={incomeNum > 0 ? (totalSpent / incomeNum) * 100 : 0} color="#059669" />
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Spending Breakdown</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Total spent: ${totalSpent.toLocaleString()}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={2} animationBegin={0} animationDuration={1000}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Overbudget alert */}
        {overBudget.length > 0 && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: 12,
            padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 10
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, color: '#ef4444', fontSize: 13 }}>Over Budget</div>
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 2 }}>
                {overBudget.map(c => c.name).join(', ')} {overBudget.length === 1 ? 'is' : 'are'} over budget
              </div>
            </div>
          </div>
        )}

        {/* Category List */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Categories
            </div>
            <button onClick={() => setShowAdd(v => !v)} style={{
              background: '#EEF2FF', color: '#1B4FD8', border: 'none', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
              {showAdd ? 'Cancel' : '+ Add'}
            </button>
          </div>

          {showAdd && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newCat.icon}
                    onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
                    placeholder="🏷️"
                    style={{
                      width: 48, background: 'var(--bg-page)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px', fontSize: 20, textAlign: 'center', outline: 'none', color: 'var(--text-primary)'
                    }}
                  />
                  <input
                    value={newCat.name}
                    onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                    placeholder="Category name"
                    style={{
                      flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newCat.budget}
                    onChange={e => setNewCat(p => ({ ...p, budget: e.target.value.replace(/[^0-9.]/g, '') }))}
                    placeholder="Budget $"
                    inputMode="decimal"
                    style={{
                      flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                  <input
                    value={newCat.spent}
                    onChange={e => setNewCat(p => ({ ...p, spent: e.target.value.replace(/[^0-9.]/g, '') }))}
                    placeholder="Spent $"
                    inputMode="decimal"
                    style={{
                      flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>
                <button onClick={addCat} style={{
                  background: '#059669', color: '#fff', border: 'none', borderRadius: 10,
                  padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>
                  Add Category
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cats.map((c, i) => {
              const pct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0
              const isOver = c.spent > c.budget
              const isEditing = editId === c.id
              return (
                <div key={c.id} style={{
                  background: 'var(--bg-card)', borderRadius: 14, border: `1px solid ${isOver ? '#fecaca' : 'var(--border)'}`,
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{c.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isOver && <span style={{ fontSize: 10, background: '#FEF2F2', color: '#ef4444', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>OVER</span>}
                          {isEditing ? (
                            <>
                              <input
                                value={editSpent}
                                onChange={e => setEditSpent(e.target.value.replace(/[^0-9.]/g, ''))}
                                inputMode="decimal"
                                autoFocus
                                style={{
                                  width: 72, background: 'var(--bg-page)', border: '1px solid var(--border)',
                                  borderRadius: 6, padding: '4px 8px', fontSize: 13, color: 'var(--text-primary)', outline: 'none'
                                }}
                              />
                              <button onClick={() => saveEdit(c.id)} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>✓</button>
                              <button onClick={() => setEditId(null)} style={{ background: 'var(--bg-page)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>✕</button>
                            </>
                          ) : (
                            <>
                              <span style={{ fontWeight: 700, fontSize: 13, color: isOver ? '#ef4444' : 'var(--text-primary)', cursor: 'pointer' }}
                                onClick={() => { setEditId(c.id); setEditSpent(String(c.spent)) }}>
                                ${c.spent.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>/ ${c.budget.toLocaleString()}</span>
                              <button onClick={() => removeCat(c.id)} style={{
                                background: '#FEF2F2', border: 'none', borderRadius: 6, width: 22, height: 22,
                                cursor: 'pointer', color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>×</button>
                            </>
                          )}
                        </div>
                      </div>
                      <AnimatedBar pct={pct} color={c.color} delay={i * 80} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                        <span>{pct.toFixed(0)}% used</span>
                        <span>${(c.budget - c.spent).toLocaleString()} left</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly savings calculation */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Monthly Summary
          </div>
          {[
            { label: 'Total Income', val: `$${incomeNum.toLocaleString()}`, color: '#059669' },
            { label: 'Total Budgeted', val: `$${totalBudget.toLocaleString()}`, color: 'var(--text-primary)' },
            { label: 'Total Spent', val: `$${totalSpent.toLocaleString()}`, color: '#ef4444' },
            { label: 'Remaining', val: `$${remaining.toLocaleString()}`, color: remaining >= 0 ? '#059669' : '#ef4444' },
            { label: 'Savings Rate', val: `${savingsRate}%`, color: parseFloat(savingsRate) >= 20 ? '#059669' : '#f97316', bold: true },
          ].map(({ label, val, color, bold }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: bold ? 800 : 600, color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
