import { useState } from 'react'

const SERVICES_CONNECTED = ['Google', 'WhatsApp', 'Instagram']

export default function Profile({ userProfile }) {
  const [notif, setNotif] = useState(true)
  const [darkPref, setDarkPref] = useState(false)
  const [invited, setInvited] = useState(false)
  const identity = userProfile?.identity || 'professional'
  const country = userProfile?.country || { name: 'Pakistan', flag: '🇵🇰' }
  const lang = userProfile?.language || { native: 'English' }

  const identityEmoji = {
    professional: '💼', parent: '👨‍👩‍👧', farmer: '🌾',
    nomad: '🌍', investor: '📈', student: '🎓'
  }[identity] || '👤'

  return (
    <div>
      <div style={{ padding: '56px 20px 0' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Profile</h1>
      </div>

      {/* Avatar + stats */}
      <div className="section">
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, background: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 12px'
          }}>
            {identityEmoji}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
            Havro User
          </div>
          <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 12 }}>
            {country.flag} {country.name} · {lang.native}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            {[['127', 'Memories'], ['34', 'Promises'], ['8', 'Automations']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected services */}
      <div className="section">
        <div className="section-title">Connected Services</div>
        <div className="card">
          {SERVICES_CONNECTED.map((svc, i) => (
            <div key={svc} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
              borderBottom: i < SERVICES_CONNECTED.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {svc === 'Google' ? '🔵' : svc === 'WhatsApp' ? '🟢' : '🌸'}
              </div>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{svc}</span>
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ Connected</span>
            </div>
          ))}
          <button style={{ width: '100%', padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: 'var(--flow)', textAlign: 'center', fontFamily: 'var(--font-body)', marginTop: 4 }}>
            + Add more
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="section">
        <div className="section-title">Settings</div>
        <div className="card">
          {[
            { label: 'Notifications', val: notif, set: setNotif },
            { label: 'Simplified view', val: darkPref, set: setDarkPref },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</span>
              <div className={`toggle ${item.val ? 'on' : ''}`} style={{ color: '#2563EB' }} onClick={() => item.set(v => !v)} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>Language</span>
            <span style={{ color: 'var(--text2)', fontSize: 14 }}>{lang.native}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>Country</span>
            <span style={{ color: 'var(--text2)', fontSize: 14 }}>{country.flag} {country.name}</span>
          </div>
        </div>
      </div>

      {/* Invite */}
      <div className="section">
        <div className="card" style={{ background: 'var(--text)', color: '#fff', textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎁</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Invite a Friend</div>
          <div style={{ fontSize: 13, color: '#aaa', marginBottom: 14 }}>Give someone the gift of their human OS</div>
          <button
            className="btn btn-full"
            style={{ background: '#fff', color: '#1A1916' }}
            onClick={() => { navigator.share?.({ title: 'Havro', text: 'Check out Havro!', url: window.location.href }); setInvited(true) }}
          >
            {invited ? '✓ Shared!' : 'Share Havro'}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="section" style={{ paddingBottom: 32 }}>
        <div className="card" style={{ textAlign: 'center', color: 'var(--text2)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>HAVRO</div>
          <div style={{ fontSize: 12, marginBottom: 8 }}>The Human Operating System</div>
          <div style={{ fontSize: 11 }}>v1.0.0 · 15.2M users · 47 countries</div>
        </div>
      </div>
    </div>
  )
}
