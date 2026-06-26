import { useState, useEffect } from 'react';
import { X, Mail, Unlock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EmailGateModal({ isOpen, onClose }) {
  const [email, setEmail]       = useState('');
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (isOpen) { setEmail(''); setSent(false); setError(''); }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: 'https://havro.app' },
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.modal} role="dialog" aria-modal="true" aria-labelledby="gate-title">
        <button style={s.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} color="#64748B" strokeWidth={2} />
        </button>

        <div style={s.iconWrap}>
          {sent
            ? <Mail size={28} color="#00C48C" strokeWidth={1.5} />
            : <Unlock size={28} color="#00C48C" strokeWidth={1.5} />
          }
        </div>

        <h2 id="gate-title" style={s.title}>
          {sent ? 'Magic link sent!' : 'Unlock Unlimited Access'}
        </h2>
        <p style={s.subtitle}>
          {sent
            ? 'Check your inbox and click the link to unlock unlimited access — free to get started.'
            : "You've used your free quota. Add your email to continue — it takes 10 seconds."}
        </p>

        {!sent && (
          <form onSubmit={handleSubmit} style={s.form}>
            <input
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={s.input}
            />
            {error && <p style={s.errorMsg}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={s.submitBtn}
            >
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {sent && (
          <div style={s.sentBox}>
            <p style={s.sentText}>
              Didn't get it?{' '}
              <button style={s.resendBtn} onClick={() => setSent(false)}>Try again</button>
            </p>
          </div>
        )}

        <p style={s.disclaimer}>No password needed. One click and you're in.</p>
      </div>
    </>
  );
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 500,
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 501,
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '48px 36px 36px',
    width: 'calc(100% - 32px)',
    maxWidth: '420px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute', top: '18px', right: '18px',
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  iconWrap: {
    width: '60px', height: '60px', borderRadius: '16px',
    background: 'rgba(0,196,140,0.10)',
    border: '1px solid rgba(0,196,140,0.20)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '22px',
    letterSpacing: '-0.04em', color: '#F8FAFC', marginBottom: '8px',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px',
    color: '#64748B', lineHeight: 1.6, marginBottom: '28px',
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  input: {
    width: '100%', height: '48px', padding: '0 16px',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    color: '#F8FAFC', background: 'rgba(255,255,255,0.05)',
    boxSizing: 'border-box', outline: 'none', textAlign: 'center',
  },
  errorMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#FCA5A5',
  },
  submitBtn: {
    width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600,
    color: '#000', background: '#00C48C', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    transition: 'background 0.15s ease',
  },
  sentBox: { marginTop: '4px' },
  sentText: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#64748B',
  },
  resendBtn: {
    background: 'none', border: 'none', color: '#00C48C',
    fontFamily: "'Inter', sans-serif", fontSize: '13px',
    fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
  },
  disclaimer: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px',
    color: '#334155', marginTop: '20px',
  },
};
