import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function RankBadge({ rank }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  if (medals[rank]) return <span style={{ fontSize: '20px' }}>{medals[rank]}</span>
  return (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
      {rank}
    </div>
  )
}

export default function AgentLeaderboardPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState('all')
  const [countries, setCountries] = useState([])

  const agentId = localStorage.getItem('humix_agent_id')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let q = supabase
          .from('agents')
          .select('id, name, country, region, total_earnings, users_registered, consultations_done')
          .order('total_earnings', { ascending: false })
          .limit(20)
        if (country !== 'all') q = q.eq('country', country)
        const { data } = await q
        if (data) {
          setAgents(data)
          const unique = [...new Set(data.map(a => a.country))].filter(Boolean)
          setCountries(unique)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [country])

  return (
    <main className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px', marginBottom: '32px' }}>
        <div style={container}>
          <Link to="/agent/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            ← Dashboard
          </Link>
          <span className="badge badge-amber" style={{ display: 'inline-flex', marginBottom: '12px' }}>🏆 Leaderboard</span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Top Agents</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>The most active village agents helping their communities.</p>
        </div>
      </div>

      <div style={container}>
        {/* Country filter */}
        {countries.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              onClick={() => setCountry('all')}
              style={{
                padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                background: country === 'all' ? 'var(--accent)' : 'var(--bg-card)',
                color: country === 'all' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid ' + (country === 'all' ? 'var(--accent)' : 'var(--border)'),
                cursor: 'pointer',
              }}>All Countries</button>
            {countries.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                style={{
                  padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                  background: country === c ? 'var(--accent)' : 'var(--bg-card)',
                  color: country === c ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid ' + (country === c ? 'var(--accent)' : 'var(--border)'),
                  cursor: 'pointer',
                }}>{c}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '14px' }} />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px' }}>No agents yet — be the first!</p>
            <Link to="/agent/register" className="btn btn-blue" style={{ padding: '12px 24px' }}>Register as Agent</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {agents.map((agent, i) => (
              <div
                key={agent.id}
                style={{
                  background: agent.id === agentId ? 'rgba(0,196,140,0.08)' : 'var(--bg-card)',
                  border: `1px solid ${agent.id === agentId ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '14px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
              >
                <RankBadge rank={i + 1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</span>
                    {agent.id === agentId && <span className="badge badge-blue" style={{ fontSize: '10px' }}>You</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {agent.country}{agent.region ? ` · ${agent.region}` : ''} · {agent.users_registered || 0} users · {agent.consultations_done || 0} consultations
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--success)' }}>
                    ${Number(agent.total_earnings || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>earned</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

const container = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }
