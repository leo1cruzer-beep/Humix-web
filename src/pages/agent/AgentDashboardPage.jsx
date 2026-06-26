import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const SERVICES = ['Health', 'Legal', 'Agriculture', 'Education', 'Income']
const LANGUAGES = ['English', 'Urdu', 'Arabic', 'Hausa', 'Swahili', 'Hindi', 'Bengali', 'French', 'Tagalog', 'Other']

function StatCard({ label, value, sub, color = 'var(--accent)' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
      border: '1px solid var(--border)', borderRadius: '16px',
      padding: '20px 24px', flex: 1, minWidth: '140px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <button
      onClick={copy}
      className="btn btn-ghost"
      style={{ padding: '8px 16px', fontSize: '13px', flexShrink: 0 }}
    >
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}

function LogModal({ agentId, onClose, onLogged }) {
  const [service, setService] = useState('Health')
  const [userInfo, setUserInfo] = useState('')
  const [language, setLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [focus, setFocus] = useState(null)

  const inp = {
    width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border)',
    borderRadius: '10px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '15px',
  }

  async function submit(e) {
    e.preventDefault()
    if (!userInfo.trim() || loading) return
    setLoading(true)
    try {
      await supabase.from('agent_consultations').insert([{
        agent_id: agentId, service, user_info: userInfo.trim(), language, earnings: 0.10,
      }])
      await supabase.rpc('increment_agent_consultation', { p_agent_id: agentId })
      setDone(true)
      setTimeout(() => { onLogged(); onClose() }, 1500)
    } catch {
      await supabase
        .from('agents')
        .update({
          consultations_done: supabase.sql`consultations_done + 1`,
          total_earnings: supabase.sql`total_earnings + 0.10`,
        })
        .eq('id', agentId)
      setDone(true)
      setTimeout(() => { onLogged(); onClose() }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111111', border: '1px solid var(--border)', borderRadius: '20px',
        padding: '32px', width: '100%', maxWidth: '440px',
      }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Consultation Logged!</div>
            <div style={{ fontSize: '14px', color: 'var(--success)', marginTop: '6px' }}>+$0.10 added to your earnings</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Log a Consultation</h2>
              <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Service Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SERVICES.map(s => (
                    <button key={s} type="button" onClick={() => setService(s)}
                      style={{
                        padding: '7px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                        background: service === s ? 'var(--accent)' : 'var(--icon-bg)',
                        color: service === s ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid ' + (service === s ? 'var(--accent)' : 'var(--border)'),
                        cursor: 'pointer',
                      }}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>User Phone or Name</label>
                <input
                  style={{ ...inp, borderColor: focus === 'ui' ? 'var(--accent)' : 'var(--border)' }}
                  placeholder="e.g. +92 300 1234567 or Ahmed"
                  value={userInfo}
                  onChange={e => setUserInfo(e.target.value)}
                  onFocus={() => setFocus('ui')}
                  onBlur={() => setFocus(null)}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Language Used</label>
                <select
                  style={{ ...inp, borderColor: focus === 'lang' ? 'var(--accent)' : 'var(--border)' }}
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  onFocus={() => setFocus('lang')}
                  onBlur={() => setFocus(null)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-blue"
                disabled={!userInfo.trim() || loading}
                style={{ padding: '14px', opacity: !userInfo.trim() || loading ? 0.5 : 1, cursor: !userInfo.trim() || loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Logging…' : 'Submit — Earn $0.10'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function AgentDashboardPage() {
  const navigate = useNavigate()
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLog, setShowLog] = useState(false)
  const [showPayout, setShowPayout] = useState(false)
  const [notification, setNotification] = useState(null)

  const agentId = localStorage.getItem('humix_agent_id')

  const fetchAgent = useCallback(async () => {
    if (!agentId) { setLoading(false); return }
    const { data } = await supabase.from('agents').select('*').eq('id', agentId).single()
    setAgent(data)
    setLoading(false)
  }, [agentId])

  useEffect(() => { fetchAgent() }, [fetchAgent])

  // Check for referral conversion (when app loads with ?ref= param and user "registers")
  useEffect(() => {
    const pending = localStorage.getItem('humix_pending_referral')
    if (pending && agent && pending === agent.referral_code) {
      setNotification('New user registered through your link! +$0.25')
      localStorage.removeItem('humix_pending_referral')
    }
  }, [agent])

  function onLogged() {
    fetchAgent()
  }

  const referralLink = agent ? `humix.app?ref=${agent.referral_code}` : ''
  const thisMonthEarnings = (agent?.total_earnings || 0).toFixed(2)

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading…</div>
      </main>
    )
  }

  if (!agentId || !agent) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>No Agent Profile Found</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Register to become a Humix Agent and start earning.</p>
          <Link to="/agent/register" className="btn btn-blue" style={{ padding: '14px 28px' }}>Register Now →</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '80px' }}>
      {showLog && <LogModal agentId={agentId} onClose={() => setShowLog(false)} onLogged={onLogged} />}

      {/* Payout Modal */}
      {showPayout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowPayout(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111111', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Request Payout</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Minimum payout is <strong style={{ color: 'var(--text-primary)' }}>$10.00</strong>. Your current balance is <strong style={{ color: agent.total_earnings >= 10 ? 'var(--success)' : 'var(--warning)' }}>${Number(agent.total_earnings || 0).toFixed(2)}</strong>.
            </p>
            {agent.total_earnings < 10 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 16px', background: 'var(--icon-bg)', borderRadius: '10px' }}>
                You need ${(10 - agent.total_earnings).toFixed(2)} more to reach the minimum. Keep registering users and logging consultations!
              </p>
            ) : (
              <button className="btn btn-blue" style={{ padding: '14px 28px', width: '100%' }}>Request Payout via Mobile Money</button>
            )}
            <button onClick={() => setShowPayout(false)} style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Notification banner */}
      {notification && (
        <div style={{ background: 'var(--success)', color: '#fff', padding: '12px 24px', textAlign: 'center', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setNotification(null)}>
          🎉 {notification} — tap to dismiss
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '32px 0 28px', marginBottom: '32px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Agent Portal</div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{agent.name}</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{agent.country}{agent.region ? ` · ${agent.region}` : ''}</p>
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '14px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Your Code</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.12em' }}>{agent.referral_code}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <StatCard label="Total Earnings" value={`$${Number(agent.total_earnings || 0).toFixed(2)}`} color="var(--success)" />
          <StatCard label="Users Registered" value={agent.users_registered || 0} />
          <StatCard label="Consultations" value={agent.consultations_done || 0} />
          <StatCard label="This Month" value={`$${thisMonthEarnings}`} sub="Approx." color="var(--warning)" />
        </div>

        {/* Referral link */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Your Referral Link</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: 'var(--icon-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', fontFamily: 'monospace', fontSize: '14px', color: 'var(--accent-text)', wordBreak: 'break-all' }}>
              {referralLink}
            </div>
            <CopyButton text={`https://${referralLink}`} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Share this link — earn $0.25 for every person who registers.</p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button className="btn btn-blue" onClick={() => setShowLog(true)} style={{ padding: '12px 24px' }}>
            + Log a Consultation
          </button>
          <button className="btn btn-ghost" onClick={() => setShowPayout(true)} style={{ padding: '12px 24px' }}>
            💰 Request Payout
          </button>
          <Link to="/agent/leaderboard" className="btn btn-ghost" style={{ padding: '12px 24px' }}>
            🏆 Leaderboard
          </Link>
        </div>

        {/* How to earn */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>How to Earn</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '👤', action: 'Register a new user', earn: '$0.25', desc: 'Share your link — they register, you earn' },
              { icon: '💬', action: 'Help with a consultation', earn: '$0.10', desc: 'Log any service you help a community member with' },
              { icon: '📈', action: 'Your user earns income', earn: '5%', desc: 'You get 5% of whatever they earn on Humix' },
            ].map(item => (
              <div key={item.action} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--icon-bg)', borderRadius: '12px' }}>
                <div style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.action}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)', flexShrink: 0 }}>{item.earn}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Recent Activity</h3>
          {(agent.consultations_done || 0) === 0 && (agent.users_registered || 0) === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
              <p style={{ fontSize: '14px' }}>No activity yet. Start by sharing your referral link or logging a consultation.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: Math.min(agent.consultations_done || 0, 5) }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--icon-bg)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>💬</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Consultation logged</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Community member</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)' }}>+$0.10</span>
                </div>
              ))}
              {Array.from({ length: Math.min(agent.users_registered || 0, 5) }).map((_, i) => (
                <div key={`u${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--icon-bg)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>👤</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>New user registered</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Via your referral link</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)' }}>+$0.25</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
