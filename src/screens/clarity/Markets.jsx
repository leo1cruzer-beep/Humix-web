import { useState, useEffect, useRef } from 'react'

const INITIAL = {
  BTC: { price: 97450, name: 'Bitcoin', symbol: '₿', color: '#f97316', mktCap: '1.92T', vol24h: '38.2B', circ: '19.7M BTC' },
  ETH: { price: 1756, name: 'Ethereum', symbol: 'Ξ', color: '#6366f1', mktCap: '211B', vol24h: '12.8B', circ: '120.3M ETH' },
  SOL: { price: 142, name: 'Solana', symbol: '◎', color: '#8b5cf6', mktCap: '65.3B', vol24h: '4.1B', circ: '460M SOL' },
  BNB: { price: 605, name: 'BNB', symbol: '⬡', color: '#f59e0b', mktCap: '87.4B', vol24h: '2.3B', circ: '144.4M BNB' },
}

const HISTORY_LEN = 20

function Sparkline({ data, color, up }) {
  if (!data || data.length < 2) return null
  const w = 80, h = 36
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`
  )
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={36} style={{ display: 'block' }}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={up ? '#22c55e' : '#ef4444'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FearGreedGauge({ value }) {
  const angle = (value / 100) * 180 - 90
  const label = value < 25 ? 'Extreme Fear' : value < 45 ? 'Fear' : value < 55 ? 'Neutral' : value < 75 ? 'Greed' : 'Extreme Greed'
  const color = value < 25 ? '#ef4444' : value < 45 ? '#f97316' : value < 55 ? '#eab308' : value < 75 ? '#22c55e' : '#059669'

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ position: 'relative', width: 160, margin: '0 auto' }}>
        <svg viewBox="0 0 160 90" width={160} height={90}>
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path d="M10,80 A70,70 0 0,1 150,80" stroke="var(--border)" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* Color arc */}
          <path d="M10,80 A70,70 0 0,1 150,80" stroke="url(#gaugeGrad)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.4" />
          {/* Needle */}
          <line
            x1="80" y1="80"
            x2={80 + 55 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={80 + 55 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={color} strokeWidth="3" strokeLinecap="round"
            style={{ transition: 'all 2s cubic-bezier(0.4,0,0.2,1)' }}
          />
          <circle cx="80" cy="80" r="5" fill={color} />
          {/* Labels */}
          <text x="8" y="90" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">Fear</text>
          <text x="152" y="90" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">Greed</text>
        </svg>
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Fear & Greed Index</div>
    </div>
  )
}

function useSimulatedPrices() {
  const [coins, setCoins] = useState(() =>
    Object.fromEntries(Object.entries(INITIAL).map(([k, v]) => [k, {
      ...v,
      history: Array(HISTORY_LEN).fill(v.price).map((p, i) => p * (1 + (Math.random() - 0.5) * 0.015)),
      change24h: (Math.random() - 0.4) * 6,
    }]))
  )
  const [fearGreed, setFearGreed] = useState(62)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCoins(prev => {
        const next = {}
        for (const [k, c] of Object.entries(prev)) {
          const pct = (Math.random() - 0.5) * 0.01
          const newPrice = Math.round(c.price * (1 + pct) * 100) / 100
          next[k] = {
            ...c,
            price: newPrice,
            history: [...c.history.slice(1), newPrice],
            change24h: c.change24h + (Math.random() - 0.5) * 0.2,
          }
        }
        return next
      })
      setFearGreed(prev => Math.min(100, Math.max(0, Math.round(prev + (Math.random() - 0.5) * 4))))
      setTick(t => t + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  return { coins, fearGreed, tick }
}

function Countdown({ tick }) {
  const [secs, setSecs] = useState(30)
  useEffect(() => {
    setSecs(30)
    const id = setInterval(() => setSecs(s => s <= 1 ? 30 : s - 1), 1000)
    return () => clearInterval(id)
  }, [tick])
  return <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>Updates in {secs}s</span>
}

export default function Markets({ onBack }) {
  const { coins, fearGreed, tick } = useSimulatedPrices()
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [animPrices, setAnimPrices] = useState(() =>
    Object.fromEntries(Object.entries(INITIAL).map(([k, v]) => [k, v.price]))
  )

  useEffect(() => {
    setAnimPrices(Object.fromEntries(Object.entries(coins).map(([k, v]) => [k, v.price])))
  }, [coins])

  const coin = selectedCoin ? coins[selectedCoin] : null

  if (coin) {
    const isUp = coin.change24h >= 0
    return (
      <div style={{ paddingBottom: 32 }}>
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSelectedCoin(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12
          }}>
            ← Markets
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 24, background: coin.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: coin.color, fontWeight: 700
            }}>
              {coin.symbol}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{coin.name}</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedCoin} · Cryptocurrency</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            background: isUp ? '#DCFCE7' : '#FEF2F2',
            borderRadius: 20, padding: '20px', marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: isUp ? '#059669' : '#ef4444' }}>
              ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: isUp ? '#059669' : '#ef4444', marginTop: 4 }}>
              {isUp ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}% (24h)
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Price History (last 20 updates)</div>
            <svg viewBox={`0 0 300 100`} width="100%" height={100} style={{ display: 'block' }}>
              {(() => {
                const data = coin.history
                const w = 300, h = 100
                const min = Math.min(...data), max = Math.max(...data)
                const range = max - min || 1
                const pts = data.map((v, i) =>
                  `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 12) - 6}`
                ).join(' ')
                const areaEnd = `${w},${h} 0,${h}`
                return (
                  <>
                    <defs>
                      <linearGradient id={`${selectedCoin}Grad`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`${pts} ${areaEnd}`} fill={`url(#${selectedCoin}Grad)`} />
                    <polyline points={pts} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )
              })()}
            </svg>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Market Cap', val: `$${coin.mktCap}` },
              { label: '24h Volume', val: `$${coin.vol24h}` },
              { label: 'Circulating', val: coin.circ },
              { label: '24h Change', val: `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(2)}%`, color: isUp ? '#059669' : '#ef4444' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', padding: '12px 14px'
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color || 'var(--text-primary)' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Markets</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Live crypto · simulated prices</p>
          </div>
          <Countdown tick={tick} />
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Fear & Greed */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 16 }}>
          <FearGreedGauge value={fearGreed} />
        </div>

        {/* Coin list */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Crypto Prices</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>±0.5% every 30s</span>
          </div>
          {Object.entries(coins).map(([sym, c], i, arr) => {
            const isUp = c.change24h >= 0
            return (
              <button key={sym} onClick={() => setSelectedCoin(sym)} style={{
                display: 'flex', alignItems: 'center', width: '100%', padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 20, background: c.color + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: c.color, fontWeight: 700, flexShrink: 0
                }}>
                  {c.symbol}
                </div>
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{sym} · ${c.mktCap} cap</div>
                </div>
                <div style={{ marginRight: 12 }}>
                  <Sparkline data={c.history} color={c.color} up={isUp} />
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    ${animPrices[sym]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isUp ? '#22c55e' : '#ef4444', marginTop: 2 }}>
                    {isUp ? '▲' : '▼'} {Math.abs(c.change24h).toFixed(2)}%
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Market stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total Market Cap', val: '$2.41T', sub: '▲ 1.2% today', color: '#22c55e' },
            { label: '24h Volume', val: '$89.4B', sub: 'All assets', color: 'var(--text-secondary)' },
            { label: 'BTC Dominance', val: '52.8%', sub: 'Of total market', color: '#f97316' },
            { label: 'Active Cryptos', val: '22,900+', sub: 'Tracked assets', color: 'var(--text-secondary)' },
          ].map(({ label, val, sub, color }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', padding: '14px 14px'
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{val}</div>
              <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 500 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
