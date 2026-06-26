import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const COUNTRIES = [
  'Pakistan', 'Nigeria', 'Kenya', 'India', 'Bangladesh', 'Ethiopia',
  'Ghana', 'Tanzania', 'Uganda', 'Indonesia', 'Philippines', 'Egypt',
  'Morocco', 'Senegal', 'Cameroon', 'Zimbabwe', 'Rwanda', 'Other',
]
const LANGUAGES = [
  'English', 'Urdu', 'Arabic', 'Hausa', 'Swahili', 'Hindi',
  'Bengali', 'Tagalog', 'Amharic', 'French', 'Yoruba', 'Other',
]

function genCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase()
}

const inp = {
  width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border)',
  borderRadius: '12px', padding: '14px 16px', color: 'var(--text-primary)',
  fontSize: '15px', transition: 'border-color 0.18s',
}
const label = { fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }

export default function AgentRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', country: '', region: '', phone: '', language: 'English' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focus, setFocus] = useState(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  const valid = form.name.trim() && form.country && form.phone.trim()

  async function register(e) {
    e.preventDefault()
    if (!valid || loading) return
    setLoading(true)
    setError('')
    try {
      const referral_code = genCode()
      const { data, error: err } = await supabase
        .from('agents')
        .insert([{
          name: form.name.trim(),
          country: form.country,
          region: form.region.trim() || null,
          phone: form.phone.trim(),
          preferred_language: form.language,
          referral_code,
        }])
        .select()
        .single()
      if (err) throw err

      // Create profile record and log registration in conversations table
      await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.id, phone: form.phone.trim() }),
      }).catch(() => {})

      await supabase.from('conversations').insert({
        user_id: data.id,
        service: 'agent_registration',
        messages: [{ role: 'system', content: `Agent registered: ${form.name.trim()} from ${form.country}` }],
        preview: `Agent registered: ${form.name.trim()} from ${form.country}`,
        created_at: new Date().toISOString(),
      })

      localStorage.setItem('humix_agent_id', data.id)
      navigate('/agent/dashboard')
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '0 0 80px' }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px', marginBottom: '40px' }}>
        <div style={container}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            ← Back to Humix
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-green">Village Agent Program</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2 }}>
            Become a Humix Agent
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
            Help your community use Humix — earn money for every person you register and every consultation you help with.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[['$0.25', 'Per new user'], ['$0.10', 'Per consultation'], ['5%', 'Of their earnings']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)' }}>{val}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={container}>
        <div style={{ maxWidth: '520px' }}>
          <form onSubmit={register} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name */}
            <div>
              <label style={label}>Your Full Name *</label>
              <input
                style={{ ...inp, borderColor: focus === 'name' ? 'var(--accent)' : 'var(--border)' }}
                placeholder="e.g. Fatima Al-Hassan"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onFocus={() => setFocus('name')}
                onBlur={() => setFocus(null)}
              />
            </div>

            {/* Country */}
            <div>
              <label style={label}>Country *</label>
              <select
                style={{ ...inp, borderColor: focus === 'country' ? 'var(--accent)' : 'var(--border)' }}
                value={form.country}
                onChange={e => set('country', e.target.value)}
                onFocus={() => setFocus('country')}
                onBlur={() => setFocus(null)}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Region/Village */}
            <div>
              <label style={label}>Region / Village <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input
                style={{ ...inp, borderColor: focus === 'region' ? 'var(--accent)' : 'var(--border)' }}
                placeholder="e.g. Lahore, Punjab"
                value={form.region}
                onChange={e => set('region', e.target.value)}
                onFocus={() => setFocus('region')}
                onBlur={() => setFocus(null)}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={label}>Phone Number *</label>
              <input
                style={{ ...inp, borderColor: focus === 'phone' ? 'var(--accent)' : 'var(--border)' }}
                placeholder="+92 300 1234567"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                onFocus={() => setFocus('phone')}
                onBlur={() => setFocus(null)}
              />
            </div>

            {/* Language */}
            <div>
              <label style={label}>Preferred Language</label>
              <select
                style={{ ...inp, borderColor: focus === 'lang' ? 'var(--accent)' : 'var(--border)' }}
                value={form.language}
                onChange={e => set('language', e.target.value)}
                onFocus={() => setFocus('lang')}
                onBlur={() => setFocus(null)}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '13px', color: '#F87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-blue"
              disabled={!valid || loading}
              style={{ padding: '16px 32px', fontSize: '15px', opacity: (!valid || loading) ? 0.5 : 1, cursor: (!valid || loading) ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Registering…' : 'Register as Agent →'}
            </button>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              By registering you agree to represent Humix honestly in your community.
            </p>
          </form>

          {/* Already registered? */}
          <div style={{ marginTop: '32px', padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Already an agent?{' '}
              <Link to="/agent/dashboard" style={{ color: 'var(--accent)', fontWeight: 600 }}>Go to your dashboard →</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
