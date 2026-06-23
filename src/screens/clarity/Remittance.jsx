import { useState, useEffect, useRef, useCallback } from 'react'

const BASE_RATES = {
  PKR: { rate: 278.50, flag: '🇵🇰', name: 'Pakistani Rupee', country: 'Pakistan', providers: ['Western Union', 'Wise', 'Remitly', 'WorldRemit', 'MoneyGram'] },
  INR: { rate: 83.25, flag: '🇮🇳', name: 'Indian Rupee', country: 'India', providers: ['Wise', 'Remitly', 'Western Union', 'MoneyGram', 'Xoom'] },
  BDT: { rate: 110.15, flag: '🇧🇩', name: 'Bangladeshi Taka', country: 'Bangladesh', providers: ['Remitly', 'Western Union', 'WorldRemit', 'Wise', 'Transfast'] },
  NGN: { rate: 1582, flag: '🇳🇬', name: 'Nigerian Naira', country: 'Nigeria', providers: ['WorldRemit', 'Wise', 'Remitly', 'Western Union', 'Chipper'] },
  PHP: { rate: 56.80, flag: '🇵🇭', name: 'Philippine Peso', country: 'Philippines', providers: ['Remitly', 'Wise', 'Western Union', 'Xoom', 'WorldRemit'] },
}

const SPREAD_RANGES = { PKR: 0.015, INR: 0.008, BDT: 0.012, NGN: 0.02, PHP: 0.010 }
const FEE_RANGES = { PKR: [0, 4.99], INR: [0, 3.99], BDT: [1.99, 5.99], NGN: [2.99, 7.99], PHP: [0, 4.99] }

function generateProviderRates(baseRate, spread, fees, providers) {
  return providers.map((name, i) => {
    const rateVariance = (Math.random() - 0.3) * spread * baseRate
    const fee = parseFloat((fees[0] + Math.random() * (fees[1] - fees[0])).toFixed(2))
    const rate = parseFloat((baseRate + rateVariance).toFixed(4))
    return { name, rate, fee }
  }).sort((a, b) => b.rate - a.rate)
}

function useSimulatedRates() {
  const [rates, setRates] = useState(() => {
    const out = {}
    for (const [cur, info] of Object.entries(BASE_RATES)) {
      out[cur] = {
        ...info,
        providers: generateProviderRates(info.rate, SPREAD_RANGES[cur], FEE_RANGES[cur], info.providers),
        lastUpdated: Date.now(),
      }
    }
    return out
  })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRates(prev => {
        const next = {}
        for (const [cur, info] of Object.entries(prev)) {
          const drift = 1 + (Math.random() - 0.5) * 0.002
          const newBase = BASE_RATES[cur].rate * drift
          next[cur] = {
            ...info,
            providers: generateProviderRates(newBase, SPREAD_RANGES[cur], FEE_RANGES[cur], info.providers.map(p => p.name)),
            lastUpdated: Date.now(),
          }
        }
        return next
      })
      setTick(t => t + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  return { rates, tick }
}

function Countdown() {
  const [secs, setSecs] = useState(30)
  useEffect(() => {
    setSecs(30)
    const id = setInterval(() => setSecs(s => s <= 1 ? 30 : s - 1), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
      Updates in {secs}s
    </span>
  )
}

export default function Remittance({ onBack }) {
  const { rates, tick } = useSimulatedRates()
  const [amount, setAmount] = useState('200')
  const [selectedCur, setSelectedCur] = useState('PKR')

  const amountNum = parseFloat(amount) || 0
  const curData = rates[selectedCur]
  const bestProvider = curData?.providers[0]

  const totalSavings = curData ? (() => {
    const best = curData.providers[0]
    const worst = curData.providers[curData.providers.length - 1]
    const diff = (best.rate - worst.rate) * amountNum
    return diff.toFixed(0)
  })() : '0'

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
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Remittance</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Best rates for sending money home</p>
          </div>
          <Countdown key={tick} />
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Amount Input */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>You Send (USD)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🇺🇸</span>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', outline: 'none'
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 16 }}>USD</span>
          </div>
          {/* Quick amount buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[50, 100, 200, 500].map(v => (
              <button key={v} onClick={() => setAmount(String(v))} style={{
                flex: 1, padding: '6px 0', background: amount === String(v) ? '#EEF2FF' : 'var(--bg-page)',
                border: `1px solid ${amount === String(v) ? '#1B4FD8' : 'var(--border)'}`,
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: amount === String(v) ? '#1B4FD8' : 'var(--text-secondary)', cursor: 'pointer'
              }}>
                ${v}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.keys(rates).map(cur => (
            <button key={cur} onClick={() => setSelectedCur(cur)} style={{
              padding: '6px 12px', borderRadius: 99, border: `1px solid ${selectedCur === cur ? '#1B4FD8' : 'var(--border)'}`,
              background: selectedCur === cur ? '#EEF2FF' : 'var(--bg-card)',
              color: selectedCur === cur ? '#1B4FD8' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span>{rates[cur].flag}</span>{cur}
            </button>
          ))}
        </div>

        {/* Best Rate Hero */}
        {bestProvider && (
          <div style={{
            background: 'linear-gradient(135deg, #059669, #34d399)',
            borderRadius: 16, padding: 16, marginBottom: 16
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: 4 }}>
              Best Rate · {bestProvider.name}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>
              {(amountNum * bestProvider.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
              {curData.flag} {curData.name} · 1 USD = {bestProvider.rate.toFixed(2)} {selectedCur}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              Fee: ${bestProvider.fee} · You save vs worst rate: {curData.flag} {parseInt(totalSavings).toLocaleString()}
            </div>
          </div>
        )}

        {/* Provider Comparison */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {curData?.flag} Provider Comparison · {selectedCur}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Live rates</span>
          </div>
          {curData?.providers.map((p, i) => {
            const received = (amountNum * p.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })
            const isFirst = i === 0
            return (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                borderBottom: i < curData.providers.length - 1 ? '1px solid var(--border)' : 'none',
                background: isFirst ? 'rgba(5,150,105,0.04)' : 'transparent'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{p.name}</span>
                    {isFirst && (
                      <span style={{ fontSize: 10, background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                        BEST
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Fee: ${p.fee} · Rate: {p.rate.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: isFirst ? '#059669' : 'var(--text-primary)' }}>
                    {received}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{selectedCur}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* All currencies quick overview */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Quick Compare · All Currencies</span>
          </div>
          {Object.entries(rates).map(([cur, info], i, arr) => {
            const best = info.providers[0]
            const received = (amountNum * best.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })
            return (
              <button key={cur} onClick={() => setSelectedCur(cur)} style={{
                display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                background: selectedCur === cur ? 'rgba(27,79,216,0.04)' : 'transparent',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: 24, marginRight: 12 }}>{info.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{cur}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>via {best.name} · rate {best.rate.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{received}</div>
                  <div style={{ fontSize: 11, color: '#059669' }}>Best rate</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
