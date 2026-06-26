import { useState, useEffect } from 'react'
import { IDENTITIES, COUNTRIES, LANGUAGES } from '../data'

const STEPS = ['splash', 'welcome', 'identity', 'country', 'language', 'ready']

const SYSTEMS = [
  { name: 'FLOW', icon: '⚡', color: '#2563EB', bg: '#EFF6FF', desc: 'AI automations & connections' },
  { name: 'CLARITY', icon: '◈', color: '#059669', bg: '#ECFDF5', desc: 'Finances & wealth building' },
  { name: 'SOUL', icon: '◉', color: '#7C3AED', bg: '#F5F3FF', desc: 'Memory, emotions & growth' },
  { name: 'VOICE', icon: '◎', color: '#EA580C', bg: '#FFF7ED', desc: 'Knowledge for real life' },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [identity, setIdentity] = useState(null)
  const [country, setCountry] = useState(null)
  const [language, setLanguage] = useState(null)
  const [countryQuery, setCountryQuery] = useState('')

  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 2200)
      return () => clearTimeout(t)
    }
  }, [step])

  const next = () => setStep(s => s + 1)

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  )

  if (step === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: '#1A1916', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24, background: '#FAFAF8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.6s ease'
        }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#1A1916' }}>H</span>
        </div>
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease 0.3s both' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#FAFAF8', letterSpacing: -1 }}>
            HAVRO
          </h1>
          <p style={{ color: '#9B9890', fontSize: 16, marginTop: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Every life. One place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 48, animation: 'fadeIn 0.4s ease 1s both' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: 3,
              background: i === 0 ? '#FAFAF8' : '#444',
              animation: `pulse 1.2s ease ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="onboard-screen">
        <div style={{ width: '100%', paddingTop: 52 }}>
          <Progress step={step} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
            Welcome to Havro
          </h1>
          <p style={{ color: '#6B6860', fontSize: 15, marginBottom: 28 }}>
            Your complete human operating system — 4 powerful systems working together.
          </p>
          <div className="grid-2" style={{ marginBottom: 28 }}>
            {SYSTEMS.map(s => (
              <div key={s.name} className="card fade-up" style={{ background: s.bg, boxShadow: 'none', border: `1.5px solid ${s.color}22` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: s.color }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#6B6860', marginTop: 3, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={next}>Get Started →</button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="onboard-screen">
        <div style={{ width: '100%', paddingTop: 52 }}>
          <Progress step={step} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Who are you?</h1>
          <p style={{ color: '#6B6860', fontSize: 15, marginBottom: 24 }}>This helps Havro personalize your experience.</p>
          <div className="identity-grid" style={{ marginBottom: 28 }}>
            {IDENTITIES.map(id => (
              <div key={id.id} className={`identity-card ${identity === id.id ? 'selected' : ''}`} onClick={() => setIdentity(id.id)}>
                <div className="identity-icon">{id.icon}</div>
                <div className="identity-label">{id.label}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={next} disabled={!identity} style={{ opacity: identity ? 1 : 0.5 }}>
            Continue →
          </button>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="onboard-screen">
        <div style={{ width: '100%', paddingTop: 52 }}>
          <Progress step={step} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Where are you?</h1>
          <p style={{ color: '#6B6860', fontSize: 15, marginBottom: 16 }}>Your country helps us show relevant rates and services.</p>
          <div className="search-wrap" style={{ marginBottom: 12 }}>
            <input
              className="search-input"
              placeholder="Search country..."
              value={countryQuery}
              onChange={e => setCountryQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="country-list" style={{ maxHeight: 340, overflowY: 'auto', marginBottom: 20 }}>
            {filteredCountries.map(c => (
              <div
                key={c.code}
                className={`country-item ${country?.code === c.code ? 'selected' : ''}`}
                onClick={() => setCountry(c)}
              >
                <span style={{ fontSize: 24 }}>{c.flag}</span>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                {country?.code === c.code && <span style={{ marginLeft: 'auto', color: '#2563EB' }}>✓</span>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={next} disabled={!country} style={{ opacity: country ? 1 : 0.5 }}>
            Continue →
          </button>
        </div>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="onboard-screen">
        <div style={{ width: '100%', paddingTop: 52 }}>
          <Progress step={step} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Your language</h1>
          <p style={{ color: '#6B6860', fontSize: 15, marginBottom: 20 }}>Havro speaks your language — literally.</p>
          <div className="lang-grid" style={{ marginBottom: 28 }}>
            {LANGUAGES.map(l => (
              <div key={l.code} className={`lang-card ${language?.code === l.code ? 'selected' : ''}`} onClick={() => setLanguage(l)}>
                <div className="lang-native">{l.native}</div>
                <div className="lang-en">{l.name}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={next} disabled={!language} style={{ opacity: language ? 1 : 0.5 }}>
            Continue →
          </button>
        </div>
      </div>
    )
  }

  if (step === 5) {
    const identityData = IDENTITIES.find(i => i.id === identity)
    const greeting = getGreeting()
    return (
      <div className="onboard-screen" style={{ justifyContent: 'center', minHeight: '100vh', textAlign: 'center', gap: 20 }}>
        <div style={{ animation: 'fadeUp 0.5s ease', paddingTop: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{identityData?.icon}</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
            {greeting}
          </h1>
          <p style={{ color: '#6B6860', fontSize: 15, lineHeight: 1.6, maxWidth: 300, margin: '0 auto 8px' }}>
            A {identityData?.label} in {country?.flag} {country?.name}. Havro is ready for you.
          </p>
          <p style={{ color: '#9B9890', fontSize: 13, marginBottom: 36 }}>
            15.2M people are already improving their lives here.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320, margin: '0 auto' }}>
            {SYSTEMS.map((s, i) => (
              <div key={s.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', animation: `fadeUp 0.4s ease ${i * 0.1 + 0.2}s both` }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#6B6860' }}>{s.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 18 }}>✓</span>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 28, maxWidth: 320, animation: 'fadeUp 0.4s ease 0.7s both' }}
            onClick={() => onComplete({ identity, country: country || { name: 'Pakistan', flag: '🇵🇰' }, language: language || { code: 'en', native: 'English', dir: 'ltr' } })}
          >
            Enter Havro ✦
          </button>
        </div>
      </div>
    )
  }

  return null
}

function Progress({ step }) {
  return (
    <div className="onboard-progress" style={{ justifyContent: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <div
          key={i}
          className={`onboard-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}
          style={{ width: i === step ? 24 : 8 }}
        />
      ))}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning! ☀️'
  if (h < 17) return 'Good afternoon! 🌤️'
  return 'Good evening! 🌙'
}
