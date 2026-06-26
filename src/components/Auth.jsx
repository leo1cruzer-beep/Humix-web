import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter your email address'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: 'https://humix.app' },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />

      <div style={s.card}>
        <div style={s.cardGlow} />

        {/* Logo */}
        <div style={s.logoWrap}>
          <span style={s.logo}>Humix</span>
        </div>

        {!sent ? (
          <>
            <h1 style={s.headline}>Enter Humix</h1>
            <p style={s.sub}>We'll send a secure link to your email</p>

            <form onSubmit={handleSend} style={s.form}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                style={s.input}
                autoFocus
                autoComplete="email"
                disabled={loading}
              />

              {error && (
                <div style={s.errorBox}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending…' : 'Send Access Link'}
              </button>
            </form>

            <p style={s.note}>No password needed. One email = one account.</p>
          </>
        ) : (
          <div style={s.sentState}>
            <div style={s.checkCircle}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="rgba(16,185,129,0.15)" />
                <path d="M9 16l5 5 9-9" stroke="#10B981" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ ...s.headline, fontSize: '20px' }}>Check your email</h2>
            <p style={{ ...s.sub, maxWidth: '260px', textAlign: 'center' }}>
              We sent a magic link to <strong style={{ color: '#F8FAFC' }}>{email}</strong>.<br />
              Link expires in 1 hour.
            </p>
            <button
              style={s.resendBtn}
              onClick={() => { setSent(false); setEmail(''); }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '48px 40px',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 0 80px rgba(99,102,241,0.08), 0 32px 64px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '200px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 900,
    fontSize: '28px',
    letterSpacing: '-0.04em',
    color: '#6366F1',
    textShadow: '0 0 32px rgba(99,102,241,0.5)',
  },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '26px',
    letterSpacing: '-0.03em',
    color: '#F8FAFC',
    marginBottom: '10px',
    textAlign: 'center',
  },
  sub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    color: '#64748B',
    fontWeight: 500,
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#F8FAFC',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  },
  errorBox: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#FCA5A5',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
  },
  btn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    color: '#F8FAFC',
    background: '#6366F1',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 0 24px rgba(99,102,241,0.4)',
    transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
  },
  note: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#334155',
    textAlign: 'center',
    marginTop: '20px',
  },
  sentState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  checkCircle: {
    marginBottom: '8px',
  },
  resendBtn: {
    marginTop: '8px',
    background: 'none',
    border: 'none',
    color: '#6366F1',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
};
