import { useState } from 'react'
import { useActivityLogger } from '../../hooks/useActivityLogger'
import { useEmailGate } from '../../hooks/useEmailGate'
import { Link } from 'react-router-dom'

const REMITTANCE_API = 'http://localhost:3003'

const SOURCE_CURRENCIES = {
  USD: { flag: '🇺🇸', name: 'US Dollar',    symbol: '$'   },
  QAR: { flag: '🇶🇦', name: 'Qatari Riyal', symbol: 'QR'  },
  AED: { flag: '🇦🇪', name: 'UAE Dirham',   symbol: 'AED' },
  SAR: { flag: '🇸🇦', name: 'Saudi Riyal',  symbol: 'SAR' },
  GBP: { flag: '🇬🇧', name: 'British Pound', symbol: '£'  },
}

const DEST_CURRENCIES = {
  PKR: { flag: '🇵🇰', name: 'Pakistani Rupee',  country: 'Pakistan',     fallback: 278.50 },
  INR: { flag: '🇮🇳', name: 'Indian Rupee',      country: 'India',        fallback: 83.25  },
  PHP: { flag: '🇵🇭', name: 'Philippine Peso',   country: 'Philippines',  fallback: 56.20  },
  BDT: { flag: '🇧🇩', name: 'Bangladeshi Taka',  country: 'Bangladesh',   fallback: 110.15 },
  NGN: { flag: '🇳🇬', name: 'Nigerian Naira',    country: 'Nigeria',      fallback: 1582   },
  EGP: { flag: '🇪🇬', name: 'Egyptian Pound',    country: 'Egypt',        fallback: 50.90  },
  LKR: { flag: '🇱🇰', name: 'Sri Lankan Rupee',  country: 'Sri Lanka',    fallback: 302.00 },
}

const EXCHANGE_NAMES = {
  cbq:          'CBQ Bank',
  alFardan:     'Al Fardan Exchange',
  alAnsari:     'Al Ansari (Qatar)',
  alAnsariUAE:  'Al Ansari (UAE)',
  alMuzaini:    'Al Muzaini',
  alRajhi:      'Al Rajhi Bank',
  alRostamani:  'Al Rostamani',
  bfc:          'BFC Exchange',
  luluExchange: 'Lulu Exchange',
  sharaf:       'Sharaf Exchange',
  westernUnionSA: 'Western Union',
}

const EXCHANGE_LOGOS = {
  cbq:          '🏦',
  alFardan:     '🟡',
  alAnsari:     '🟠',
  alAnsariUAE:  '🟠',
  alMuzaini:    '🔵',
  alRajhi:      '🟢',
  alRostamani:  '💚',
  bfc:          '🔴',
  luluExchange: '🟣',
  sharaf:       '⭐',
  westernUnionSA: '🟡',
}

// Fallback static services when API corridor not available
const STATIC_SERVICES = [
  { id: 'wu',       name: 'Western Union',      feePct: 0.035, rateDeg: 0.012, time: 'Instant',    logo: '🟡' },
  { id: 'wise',     name: 'Wise',               feePct: 0.006, rateDeg: 0.001, time: '1–2 days',   logo: '🟢' },
  { id: 'remitly',  name: 'Remitly',            feePct: 0.029, rateDeg: 0.008, time: 'Instant',    logo: '🔵' },
  { id: 'alansari', name: 'Al Ansari Exchange', feePct: 0.020, rateDeg: 0.015, time: '1–2 hours',  logo: '🟠' },
  { id: 'bank',     name: 'Bank Transfer',      feePct: 0.040, rateDeg: 0.020, time: '3–5 days',   logo: '🏦' },
]
const FALLBACK_SOURCE_RATES = { USD: 1, QAR: 3.64, AED: 3.67, SAR: 3.75, GBP: 0.79 }

async function fetchCorridorRates(fromCurrency, toCurrency) {
  const res = await fetch(`${REMITTANCE_API}/api/rates/${fromCurrency}/${toCurrency}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

async function callAI(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324',
      max_tokens: 150,
      messages: [
        { role: 'system', content: 'You are a friendly remittance advisor. Be warm, personal, concise. Always mention the specific savings amount.' },
        { role: 'user', content: prompt },
      ],
    }),
  })
  const data = await res.json()
  return data.choices[0].message.content
}

function buildComparisons(sendAmount, apiData) {
  return apiData.corridor.map(entry => {
    const feeInSource = entry.fee ?? 0
    const netAmount = Math.max(0, sendAmount - feeInSource)
    const recipientGets = netAmount * (entry.rate ?? 0)
    return {
      id: entry.exchange,
      name: EXCHANGE_NAMES[entry.exchange] ?? entry.exchange,
      logo: EXCHANGE_LOGOS[entry.exchange] ?? '💱',
      time: entry.time ?? 'Unknown',
      feeInSource,
      effectiveRate: entry.rate ?? 0,
      recipientGets,
      available: entry.available ?? false,
      fallback: entry.fallback ?? false,
    }
  })
}

function buildFallbackComparisons(sendAmount, fromCurrency, toCurrency) {
  const sourceRate = FALLBACK_SOURCE_RATES[fromCurrency] ?? 1
  const marketRate = DEST_CURRENCIES[toCurrency]?.fallback ?? 1
  const amountUSD = sendAmount / sourceRate
  return STATIC_SERVICES.map(svc => {
    const feeInSource = sendAmount * svc.feePct
    const netUSD = amountUSD - feeInSource / sourceRate
    const effectiveRate = marketRate * (1 - svc.rateDeg)
    const recipientGets = netUSD * effectiveRate
    return { ...svc, feeInSource, effectiveRate, recipientGets, available: false, fallback: true }
  }).sort((a, b) => b.recipientGets - a.recipientGets)
}

function fmt(n, decimals = 0) {
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals })
}

export default function RemittanceOptimizer() {
  const [sendAmount, setSendAmount] = useState('500')
  const [fromCurrency, setFromCurrency] = useState('QAR')
  const [toCurrency, setToCurrency] = useState('PKR')

  const [loading, setLoading] = useState(false)
  const [comparisons, setComparisons] = useState([])
  const [hasCompared, setHasCompared] = useState(false)
  const [usedTo, setUsedTo] = useState('PKR')
  const [dataSource, setDataSource] = useState(null) // { lastUpdated, isLive }

  const [aiTip, setAiTip] = useState('')
  const { logActivity } = useActivityLogger()
  const { checkGate, recordUse } = useEmailGate()
  const [aiLoading, setAiLoading] = useState(false)

  const [alertCurrency, setAlertCurrency] = useState('USD/PKR')
  const [alertTarget, setAlertTarget] = useState('')
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('humix_rate_alerts') || '[]') } catch { return [] }
  })
  const [alertSaved, setAlertSaved] = useState(false)

  const [compareCount, setCompareCount] = useState(() => {
    try { return parseInt(localStorage.getItem('humix_compare_count') || '0', 10) } catch { return 0 }
  })

  async function handleCompare() {
    const amount = parseFloat(sendAmount)
    if (!amount || amount <= 0) return
    if (checkGate('finance')) return
    recordUse('finance')
    setLoading(true)
    setAiTip('')
    setHasCompared(false)

    let results
    let source = null

    try {
      const apiData = await fetchCorridorRates(fromCurrency, toCurrency)
      results = buildComparisons(amount, apiData)
      source = { lastUpdated: apiData.lastUpdated, isLive: results.some(r => r.available && !r.fallback) }
    } catch {
      results = buildFallbackComparisons(amount, fromCurrency, toCurrency)
      source = { lastUpdated: null, isLive: false }
    }

    setComparisons(results)
    setUsedTo(toCurrency)
    setDataSource(source)
    setHasCompared(true)

    const newCount = compareCount + 1
    setCompareCount(newCount)
    localStorage.setItem('humix_compare_count', String(newCount))

    runAI(results, amount)
    setLoading(false)
  }

  async function runAI(results, amount) {
    if (!results.length) return
    const best = results[0]
    const worst = results[results.length - 1]
    const savings = fmt(best.recipientGets - worst.recipientGets)
    const dest = DEST_CURRENCIES[toCurrency]
    const prompt = `User wants to send ${amount} ${fromCurrency} to ${dest?.country}. Best service is ${best.name} saving ${savings} ${toCurrency} vs worst option. Give a 2 sentence personal recommendation mentioning the actual savings amount and what that money means (groceries, school fees etc). Be warm and human.`
    setAiLoading(true)
    try {
      const tip = await callAI(prompt)
      setAiTip(tip)
      logActivity('Remittance Optimizer', 'Finance', tip)
    } catch {
      setAiTip(`Based on our comparison, ${best.name} gives your family the most — choose it and they receive ${savings} extra ${toCurrency}.`)
    } finally {
      setAiLoading(false)
    }
  }

  function saveAlert() {
    if (!alertTarget) return
    const updated = [...alerts, { pair: alertCurrency, target: alertTarget, ts: Date.now() }]
    setAlerts(updated)
    localStorage.setItem('humix_rate_alerts', JSON.stringify(updated))
    setAlertTarget('')
    setAlertSaved(true)
    setTimeout(() => setAlertSaved(false), 3000)
  }

  function removeAlert(idx) {
    const updated = alerts.filter((_, i) => i !== idx)
    setAlerts(updated)
    localStorage.setItem('humix_rate_alerts', JSON.stringify(updated))
  }

  const fromInfo = SOURCE_CURRENCIES[fromCurrency]
  const destInfo = DEST_CURRENCIES[usedTo]
  const bestSaving = comparisons.length >= 2
    ? comparisons[0].recipientGets - comparisons[comparisons.length - 1].recipientGets
    : 0

  return (
    <main className="page-enter" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/finance" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Finance</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '30px' }}>💸</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Remittance Optimizer
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Compare real transfer services with live rates — find who gives your family the most money.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>

        {/* ── Step 1: Input ── */}
        <div style={card}>
          <div style={sectionLabel}>Step 1 — How much to send?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Send Amount</label>
              <input
                type="number"
                value={sendAmount}
                onChange={e => setSendAmount(e.target.value)}
                placeholder="500"
                min="1"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Send From</label>
              <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} style={inputStyle}>
                {Object.entries(SOURCE_CURRENCIES).map(([code, info]) => (
                  <option key={code} value={code}>{info.flag} {code} — {info.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Send To</label>
              <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} style={inputStyle}>
                {Object.entries(DEST_CURRENCIES).map(([code, info]) => (
                  <option key={code} value={code}>{info.flag} {code} — {info.country}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCompare}
            disabled={loading || !sendAmount || parseFloat(sendAmount) <= 0}
            className="btn btn-blue"
            style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Fetching live rates…' : 'Compare Now →'}
          </button>
        </div>

        {/* ── Step 2: Comparison Cards ── */}
        {hasCompared && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={sectionLabel}>
                Step 2 — Comparison · {fromInfo?.flag} {sendAmount} {fromCurrency} → {destInfo?.flag} {usedTo}
              </div>
              {dataSource && (
                <div style={{ fontSize: '11px', color: dataSource.isLive ? '#16A34A' : 'var(--text-muted)', fontWeight: 600 }}>
                  {dataSource.isLive
                    ? '● Live rates'
                    : dataSource.lastUpdated
                      ? `Scraped ${new Date(dataSource.lastUpdated).toLocaleDateString()}`
                      : 'Estimated rates'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comparisons.map((svc, idx) => {
                const isBest = idx === 0
                const isWorst = idx === comparisons.length - 1
                return (
                  <div
                    key={svc.id}
                    style={{
                      ...card,
                      border: `1px solid ${isBest ? '#6366F1' : 'var(--border)'}`,
                      padding: '20px 24px',
                      position: 'relative',
                      opacity: isWorst && !isBest ? 0.75 : 1,
                    }}
                  >
                    {isBest && (
                      <span style={{
                        position: 'absolute', top: '-12px', left: '20px',
                        background: '#6366F1', color: '#fff',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
                        padding: '3px 12px', borderRadius: '20px',
                      }}>BEST VALUE</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Service name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '155px' }}>
                        <span style={{ fontSize: '26px' }}>{svc.logo}</span>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{svc.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⏱ {svc.time}</div>
                        </div>
                      </div>
                      {/* Recipient gets */}
                      <div style={{ flex: 1, minWidth: '130px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Recipient gets</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: isBest ? '#16A34A' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                          {fmt(svc.recipientGets)}
                          <span style={{ fontSize: '13px', fontWeight: 600, marginLeft: '5px', color: 'var(--text-secondary)' }}>{usedTo}</span>
                        </div>
                      </div>
                      {/* Fee */}
                      <div style={{ minWidth: '120px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Your fee</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {svc.feeInSource === 0
                            ? <span style={{ color: '#16A34A' }}>No fee</span>
                            : `${fromInfo?.symbol}${svc.feeInSource.toFixed(2)}`}
                        </div>
                      </div>
                      {/* Rate */}
                      <div style={{ minWidth: '140px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Exchange rate</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          1 {fromCurrency} = {svc.effectiveRate.toFixed(usedTo === 'NGN' ? 0 : 2)} {usedTo}
                          {svc.fallback && <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>est.</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Savings callout */}
            {bestSaving > 0 && (
              <div style={{ marginTop: '12px', ...card, background: 'var(--accent-light)', border: '1px solid rgba(27,79,216,0.12)', padding: '16px 20px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Choose <strong style={{ color: 'var(--accent)' }}>{comparisons[0].name}</strong> over{' '}
                  <strong>{comparisons[comparisons.length - 1].name}</strong> and your family receives{' '}
                  <strong style={{ color: '#16A34A' }}>{fmt(bestSaving)} extra {usedTo}</strong> — that's real money in their hands.
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: AI Recommendation ── */}
        {hasCompared && (
          <div style={{ ...card, marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>AI Recommendation</span>
              <span className="badge badge-blue" style={{ fontSize: '10px', marginLeft: 'auto' }}>DeepSeek</span>
            </div>
            {aiLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px' }}>Analyzing your transfer…</span>
              </div>
            ) : aiTip ? (
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{aiTip}</p>
            ) : null}
          </div>
        )}

        {/* ── Step 4: Rate Alert ── */}
        <div style={{ ...card, marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔔</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Rate Alert</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Set a target exchange rate — we'll save it here and connect to Kael for real Telegram alerts soon.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={labelStyle}>Currency Pair</label>
              <select value={alertCurrency} onChange={e => setAlertCurrency(e.target.value)} style={{ ...inputStyle, width: '150px' }}>
                {Object.keys(DEST_CURRENCIES).map(code => (
                  <option key={code} value={`USD/${code}`}>USD/{code}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Target Rate</label>
              <input
                type="number"
                value={alertTarget}
                onChange={e => setAlertTarget(e.target.value)}
                placeholder="e.g. 285"
                style={{ ...inputStyle, width: '140px' }}
              />
            </div>
            <button
              onClick={saveAlert}
              disabled={!alertTarget}
              className="btn btn-blue"
              style={{ padding: '12px 20px', fontSize: '14px', opacity: !alertTarget ? 0.5 : 1 }}
            >
              Set Alert
            </button>
          </div>
          {alertSaved && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              ✓ Alert saved — we'll notify you when {alertCurrency} reaches your target.
            </div>
          )}
          {alerts.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Active Alerts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {alerts.map((a, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-page)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      Alert me when <strong>{a.pair}</strong> reaches <strong>{a.target}</strong>
                    </span>
                    <button onClick={() => removeAlert(idx)} style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1, padding: '0 4px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Step 5: Savings Tracker ── */}
        <div style={{ ...card, marginTop: '24px', background: 'var(--accent-light)', border: '1px solid rgba(27,79,216,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Your Humix Stats</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {compareCount === 0
                  ? 'Hit Compare Now to see your first service comparison.'
                  : <>
                      Using Humix you've compared{' '}
                      <strong style={{ color: 'var(--accent)' }}>{compareCount} transfer{compareCount !== 1 ? 's' : ''}</strong>.
                      {bestSaving > 0 && (
                        <> Your last comparison found{' '}
                          <strong style={{ color: '#16A34A' }}>{fmt(bestSaving)} {usedTo}</strong>{' '}
                          in potential savings vs the worst option.
                        </>
                      )}
                    </>
                }
              </div>
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
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }
const inputStyle = {
  width: '100%', height: '48px', padding: '0 14px',
  border: '1px solid var(--border)', borderRadius: '10px',
  fontSize: '16px', color: 'var(--text-primary)',
  background: 'var(--input-bg)', fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
}
