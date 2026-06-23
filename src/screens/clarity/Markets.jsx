import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const INITIAL = {
  BTC: { price: 97450, name: 'Bitcoin',  symbol: '₿', color: '#F97316', mktCap: '$1.92T', vol24h: '$38.2B' },
  ETH: { price: 1756,  name: 'Ethereum', symbol: 'Ξ', color: '#6366F1', mktCap: '$211B',  vol24h: '$12.8B' },
  SOL: { price: 142,   name: 'Solana',   symbol: '◎', color: '#8B5CF6', mktCap: '$65.3B', vol24h: '$4.1B' },
  BNB: { price: 605,   name: 'BNB',      symbol: '⬡', color: '#F59E0B', mktCap: '$87.4B', vol24h: '$2.3B' },
}

const HISTORY_LEN = 20

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

function Sparkline({ data, up }) {
  if (!data || data.length < 2) return null
  const w = 80, h = 36
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={36} style={{ display: 'block' }}>
      <polyline points={pts.join(' ')} fill="none" stroke={up ? '#16A34A' : '#DC2626'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Countdown({ tick }) {
  const [secs, setSecs] = useState(30)
  useEffect(() => {
    setSecs(30)
    const id = setInterval(() => setSecs(s => s <= 1 ? 30 : s - 1), 1000)
    return () => clearInterval(id)
  }, [tick])
  return <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>Updates in {secs}s</span>
}

export default function Markets() {
  const [coins, setCoins] = useState(() =>
    Object.fromEntries(Object.entries(INITIAL).map(([k, v]) => [k, {
      ...v,
      history: Array(HISTORY_LEN).fill(v.price).map(p => p * (1 + (Math.random() - 0.5) * 0.015)),
      pctChange: 0,
    }]))
  )
  const [tick, setTick] = useState(0)
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiLoaded, setAiLoaded] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const id = setInterval(() => {
      setCoins(prev => {
        const next = {}
        for (const [k, c] of Object.entries(prev)) {
          const pct = (Math.random() - 0.5) * 0.01
          const newPrice = +(c.price * (1 + pct)).toFixed(2)
          next[k] = { ...c, price: newPrice, history: [...c.history.slice(1), newPrice], pctChange: +(pct * 100).toFixed(3) }
        }
        return next
      })
      setTick(t => t + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  async function getAiInsight() {
    setAiLoaded(true)
    setAiLoading(true)
    setAiSummary('')
    const btc = coins.BTC.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const eth = coins.ETH.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const sol = coins.SOL.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    const content = `BTC is $${btc}, ETH is $${eth}, SOL is $${sol}. Give me a brief market outlook in 2-3 sentences.`
    try {
      const s = await callAI(content)
      setAiSummary(s)
    } catch {
      setAiSummary('AI advice temporarily unavailable')
    } finally {
      setAiLoading(false)
    }
  }

  if (selected) {
    const coin = coins[selected]
    const isUp = coin.pctChange >= 0
    return (
      <main className="page-enter" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
          <div className="finance-container" style={container}>
            <div style={{ marginBottom: '10px' }}>
              <button onClick={() => setSelected(null)} style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Markets</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: coin.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: coin.color, fontWeight: 700 }}>
                {coin.symbol}
              </div>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{coin.name}</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{selected} · Cryptocurrency</p>
              </div>
            </div>
          </div>
        </div>
        <div className="finance-container" style={container}>
          <div className="finance-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ ...card, textAlign: 'center', padding: '32px 24px', background: isUp ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${isUp ? '#bbf7d0' : '#fecaca'}` }}>
                <div style={{ fontSize: '42px', fontWeight: 900, color: isUp ? '#16A34A' : '#DC2626', letterSpacing: '-0.02em' }}>
                  ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: isUp ? '#16A34A' : '#DC2626', marginTop: '6px' }}>
                  {isUp ? '↑' : '↓'} {Math.abs(coin.pctChange).toFixed(3)}%
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Market Cap', val: coin.mktCap },
                  { label: '24h Volume', val: coin.vol24h },
                ].map(({ label, val }) => (
                  <div key={label} style={{ ...card, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Price History</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Last {HISTORY_LEN} updates</div>
              <svg viewBox="0 0 300 100" width="100%" height={100} style={{ display: 'block' }}>
                {(() => {
                  const d = coin.history, w = 300, h = 100
                  const min = Math.min(...d), max = Math.max(...d), range = max - min || 1
                  const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${h - ((v - min) / range) * (h - 12) - 6}`).join(' ')
                  const areaEnd = `${w},${h} 0,${h}`
                  const c = isUp ? '#16A34A' : '#DC2626'
                  return (
                    <>
                      <defs>
                        <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={c} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon points={`${pts} ${areaEnd}`} fill="url(#coinGrad)" />
                      <polyline points={pts} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )
                })()}
              </svg>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-enter" style={{ paddingBottom: '80px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '40px' }}>
        <div className="finance-container" style={container}>
          <div style={{ marginBottom: '10px' }}>
            <Link to="/finance" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>← Finance</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>₿</span>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Live Markets</h1>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Simulated crypto prices · AI daily summary · updated every 30s.
              </p>
            </div>
            <Countdown tick={tick} />
          </div>
        </div>
      </div>

      <div className="finance-container" style={container}>
        <div className="finance-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

          {/* Coin list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Crypto Prices</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>±0.5% every 30s</span>
              </div>
              {Object.entries(coins).map(([sym, c], i, arr) => {
                const isUp = c.pctChange >= 0
                return (
                  <button
                    key={sym}
                    onClick={() => setSelected(sym)}
                    style={{
                      display: 'flex', alignItems: 'center', width: '100%', padding: '16px 20px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: c.color, fontWeight: 700, flexShrink: 0 }}>
                      {c.symbol}
                    </div>
                    <div style={{ flex: 1, marginLeft: '14px' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{sym} · {c.mktCap} cap</div>
                    </div>
                    <div style={{ marginRight: '14px' }}>
                      <Sparkline data={c.history} up={isUp} />
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        ${c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: isUp ? '#16A34A' : '#DC2626', marginTop: '2px' }}>
                        {isUp ? '↑' : '↓'} {Math.abs(c.pctChange).toFixed(3)}%
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Market stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { label: 'Total Market Cap', val: '$2.41T', color: '#16A34A' },
                { label: '24h Volume', val: '$89.4B', color: 'var(--text-primary)' },
                { label: 'BTC Dominance', val: '52.8%', color: '#F97316' },
                { label: 'Active Cryptos', val: '22,900+', color: 'var(--text-secondary)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ ...card, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI summary */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px' }}>🤖</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Daily Summary</span>
              <span className="badge badge-blue" style={{ fontSize: '10px', marginLeft: 'auto' }}>DeepSeek</span>
            </div>
            {!aiLoaded ? (
              <button className="btn btn-ghost" onClick={getAiInsight} style={{ padding: '10px 16px', fontSize: '13px' }}>
                Get AI Insight →
              </button>
            ) : aiLoading ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 0' }}>
                {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>Loading summary…</span>
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiSummary}</div>
            )}

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Click a coin for details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(coins).map(([sym, c]) => {
                  const isUp = c.pctChange >= 0
                  return (
                    <button key={sym} onClick={() => setSelected(sym)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: '16px', color: c.color }}>{c.symbol}</span>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{sym}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: isUp ? '#16A34A' : '#DC2626' }}>
                        {isUp ? '↑' : '↓'} {Math.abs(c.pctChange).toFixed(3)}%
                      </span>
                    </button>
                  )
                })}
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
