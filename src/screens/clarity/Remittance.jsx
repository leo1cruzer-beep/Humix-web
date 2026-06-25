import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useActivityLogger } from '../../hooks/useActivityLogger'

const BASE_RATES = {
  PKR: { flag: '🇵🇰', name: 'Pakistani Rupee',   country: 'Pakistan',     fallback: 278.50 },
  INR: { flag: '🇮🇳', name: 'Indian Rupee',       country: 'India',        fallback: 83.25  },
  BDT: { flag: '🇧🇩', name: 'Bangladeshi Taka',   country: 'Bangladesh',   fallback: 110.15 },
  NGN: { flag: '🇳🇬', name: 'Nigerian Naira',     country: 'Nigeria',      fallback: 1582   },
  PHP: { flag: '🇵🇭', name: 'Philippine Peso',    country: 'Philippines',  fallback: 56.20  },
  EGP: { flag: '🇪🇬', name: 'Egyptian Pound',     country: 'Egypt',        fallback: 50.90  },
  LKR: { flag: '🇱🇰', name: 'Sri Lankan Rupee',   country: 'Sri Lanka',    fallback: 302.00 },
}

const KEYS = ['PKR', 'INR', 'BDT', 'NGN', 'PHP', 'EGP', 'LKR']

async function fetchRates() {
  const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
  const data = await res.json()
  return Object.fromEntries(KEYS.map(k => [k, data.rates[k]]))
}

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

function timeAgo(ts) {
  if (!ts) return null
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export default function Remittance() {
  const [rates, setRates] = useState(() =>
    Object.fromEntries(KEYS.map(k => [k, { ...BASE_RATES[k], currentRate: BASE_RATES[k].fallback }]))
  )
  const [lastUpdated, setLastUpdated] = useState(null)
  const [stale, setStale] = useState(false)
  const [, tick] = useState(0)

  const [amount, setAmount] = useState('200')
  const [selected, setSelected] = useState('PKR')
  const [aiTip, setAiTip] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [tipLoaded, setTipLoaded] = useState(false)
  const { logActivity } = useActivityLogger()

  useEffect(() => {
    async function load() {
      try {
        const fresh = await fetchRates()
        setRates(prev =>
          Object.fromEntries(KEYS.map(k => [k, { ...prev[k], currentRate: fresh[k] }]))
        )
        setLastUpdated(Date.now())
        setStale(false)
      } catch {
        setStale(true)
      }
    }
    load()
    const apiId = setInterval(load, 60 * 60 * 1000)
    const clockId = setInterval(() => tick(n => n + 1), 60000)
    return () => { clearInterval(apiId); clearInterval(clockId) }
  }, [])

  const amountNum = parseFloat(amount) || 0
  const cur = rates[selected]

  async function getAiTip() {
    if (tipLoaded) return
    setTipLoaded(true)
    setAiLoading(true)
    const rate = cur?.currentRate?.toFixed(selected === 'NGN' ? 0 : 2)
    const prompt = `I want to send money home. Current USD/${selected} rate is ${rate}. Give me remittance timing advice in 2-3 sentences.`
    try {
      const tip = await callAI(prompt)
      setAiTip(tip)
      logActivity('Remittance', 'Finance', tip)
    } catch {
      setAiTip('AI advice temporarily unavailable')
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>💸</span>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Remittance Calculator</h1>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Live USD rates to PKR, INR, BDT, NGN, PHP, EGP, LKR — from ExchangeRate-API.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {lastUpdated
                ? <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Updated {timeAgo(lastUpdated)}</div>
                : <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading rates…</div>}
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ExchangeRate-API</div>
            </div>
          </div>
        </div>
      </div>

      <div className="finance-container" style={container}>
        {stale && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '10px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <span style={{ fontSize: '13px', color: '#92400E', fontWeight: 500 }}>Rates may be outdated — could not reach ExchangeRate-API. Showing last known rates.</span>
          </div>
        )}

        <div className="finance-two-col" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left: Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={card}>
              <div style={sectionLabel}>You Send (USD)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px' }}>🇺🇸</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>$</span>
                  <input
                    value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    inputMode="decimal"
                    style={{
                      width: '100%', height: '52px', paddingLeft: '32px',
                      border: '1px solid var(--border)', borderRadius: '10px',
                      fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)',
                      background: 'var(--input-bg)', fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[50, 100, 200, 500].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className={amount === String(v) ? 'filter-pill active' : 'filter-pill'}
                    style={{ flex: 1, fontSize: '13px' }}
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency selector */}
            <div style={card}>
              <div style={sectionLabel}>Send to</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {Object.entries(rates).map(([code, info]) => {
                  const received = (amountNum * info.currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  const isSelected = selected === code
                  return (
                    <button
                      key={code}
                      onClick={() => { setSelected(code); setTipLoaded(false); setAiTip('') }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: isSelected ? 'var(--accent-light)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{info.flag}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{code}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{info.country}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{received}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {info.currentRate.toFixed(code === 'NGN' ? 0 : 2)} / USD
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Result + table + AI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hero result */}
            <div style={{ ...card, background: 'var(--accent-light)', border: '1px solid rgba(27,79,216,0.15)', textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Recipient gets
              </div>
              <div style={{ fontSize: '52px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>
                {(amountNum * (cur?.currentRate ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {rates[selected]?.flag} {selected} · {rates[selected]?.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                1 USD = {cur?.currentRate?.toFixed(selected === 'NGN' ? 0 : 4)} {selected}
              </div>
            </div>

            {/* All rates table */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>All Currencies · ${amountNum} USD</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : 'Loading…'}
                </span>
              </div>
              {Object.entries(rates).map(([code, info], i, arr) => {
                const received = (amountNum * info.currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })
                return (
                  <div
                    key={code}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '14px 20px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      background: selected === code ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '20px', marginRight: '12px', flexShrink: 0 }}>{info.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {code} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>· {info.name}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        1 USD = {info.currentRate.toFixed(code === 'NGN' ? 0 : 4)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{received}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{code}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* AI Tip */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>🤖</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Tip</span>
                <span className="badge badge-blue" style={{ fontSize: '10px', marginLeft: 'auto' }}>DeepSeek</span>
              </div>
              {!tipLoaded ? (
                <button className="btn btn-ghost" onClick={getAiTip} style={{ padding: '10px 16px', fontSize: '13px' }}>
                  Get AI timing advice →
                </button>
              ) : aiLoading ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Checking rates…</span>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{aiTip}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }
const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }
