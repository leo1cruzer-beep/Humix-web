import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setEmail('');
      setPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setSuccess('Check your email to confirm your account.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.modal} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button style={s.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} color="#737373" strokeWidth={1.5} />
        </button>

        <h2 id="auth-title" style={s.title}>
          {tab === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={s.subtitle}>
          {tab === 'login'
            ? 'Sign in to your Humix account'
            : 'Join Humix and start exploring services'}
        </p>

        {/* Tab switcher */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tabBtn, ...(tab === 'login' ? s.tabActive : {}) }}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
          >
            Log In
          </button>
          <button
            style={{ ...s.tabBtn, ...(tab === 'signup' ? s.tabActive : {}) }}
            onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label} htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={s.input}
            />
          </div>

          {error && <p style={s.errorMsg}>{error}</p>}
          {success && <p style={s.successMsg}>{success}</p>}

          <button
            type="submit"
            className="btn btn-blue"
            disabled={loading}
            style={{ width: '100%', padding: '13px 16px', fontSize: '15px', marginTop: '4px' }}
          >
            {loading ? 'Please wait…' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p style={s.switchText}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={s.switchLink}
            onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
          >
            {tab === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </>
  );
}

const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 300,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 301,
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--shadow-modal)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--icon-bg)',
    border: 'none',
    cursor: 'pointer',
  },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '22px',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--icon-bg)',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
  },
  tabBtn: {
    flex: 1,
    padding: '8px 0',
    borderRadius: '8px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabActive: {
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  input: {
    height: '44px',
    padding: '0 14px',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    color: 'var(--text-primary)',
    background: 'var(--input-bg)',
    transition: 'border-color 0.15s ease',
  },
  errorMsg: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#FCA5A5',
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
  },
  successMsg: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#6EE7B7',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
  },
  switchText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#737373',
    textAlign: 'center',
    marginTop: '20px',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#818CF8',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    padding: 0,
    textDecoration: 'underline',
  },
};
