import { useState, useEffect } from 'react';
import { X, Fingerprint, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignupModal({ isOpen, onClose, onFaceId }) {
  const [email, setEmail]       = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (isOpen) { setEmail(''); setEmailSent(false); setError(''); }
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: 'https://humix.app' },
      });
      if (err) throw err;
      setEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.modal} role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <button style={s.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} color="#64748B" strokeWidth={1.5} />
        </button>

        <h2 id="signup-title" style={s.title}>Join Humix — It's Free</h2>
        <p style={s.subtitle}>You've used 2 free tools. Sign up to continue — it's free.</p>

        <div style={s.cards}>
          {/* Face ID / Fingerprint */}
          <div style={s.card}>
            <div style={s.iconWrap}>
              <Fingerprint size={34} color="#00C48C" strokeWidth={1.3} />
            </div>
            <p style={s.cardTitle}>Face ID / Fingerprint</p>
            <p style={s.cardSub}>Scan to Enter</p>
            <button style={s.primaryBtn} onClick={onFaceId}>
              Use Face ID
            </button>
          </div>

          {/* Email magic link */}
          <div style={s.card}>
            <div style={s.iconWrap}>
              <Mail size={34} color="#00C48C" strokeWidth={1.3} />
            </div>
            <p style={s.cardTitle}>Email</p>
            <p style={s.cardSub}>Magic link sent to email</p>
            {emailSent ? (
              <div style={s.successBox}>Check your inbox ✓</div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={s.emailForm}>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={s.emailInput}
                />
                {error && <p style={s.errorMsg}>{error}</p>}
                <button type="submit" disabled={loading} style={s.primaryBtn}>
                  {loading ? '…' : 'Send Link'}
                </button>
              </form>
            )}
          </div>

          {/* Phone — Coming Soon */}
          <div style={{ ...s.card, ...s.cardMuted }}>
            <div style={{ ...s.iconWrap, background: 'rgba(255,255,255,0.03)' }}>
              <Phone size={34} color="#475569" strokeWidth={1.3} />
            </div>
            <p style={{ ...s.cardTitle, color: '#475569' }}>Phone Number</p>
            <p style={s.cardSub}>SMS OTP</p>
            <div style={s.comingSoonBadge}>Coming Soon</div>
          </div>
        </div>
      </div>
    </>
  );
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.78)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 400,
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 401,
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '52px 40px 44px',
    width: 'calc(100% - 32px)',
    maxWidth: '700px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.65)',
  },
  closeBtn: {
    position: 'absolute', top: '20px', right: '20px',
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '26px',
    letterSpacing: '-0.04em', color: '#F8FAFC',
    textAlign: 'center', marginBottom: '8px',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#64748B',
    textAlign: 'center', marginBottom: '36px',
  },
  cards: {
    display: 'flex', gap: '14px', flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 160px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '28px 20px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  cardMuted: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  iconWrap: {
    width: '68px', height: '68px', borderRadius: '16px',
    background: 'rgba(0,196,140,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px',
    color: '#F8FAFC', textAlign: 'center', marginBottom: '4px',
  },
  cardSub: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px',
    color: '#64748B', textAlign: 'center',
  },
  primaryBtn: {
    marginTop: '18px', padding: '11px 20px', fontSize: '14px', fontWeight: 600,
    color: '#000', background: '#00C48C', border: 'none', borderRadius: '8px',
    cursor: 'pointer', width: '100%', fontFamily: "'Inter', sans-serif",
    transition: 'background 0.15s ease',
  },
  emailForm: {
    width: '100%', marginTop: '14px', display: 'flex', flexDirection: 'column',
  },
  emailInput: {
    width: '100%', height: '42px', padding: '0 12px',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', fontSize: '14px', fontFamily: "'Inter', sans-serif",
    color: '#F8FAFC', background: 'rgba(255,255,255,0.05)',
    boxSizing: 'border-box', marginBottom: '10px', outline: 'none',
  },
  errorMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#FCA5A5',
    marginBottom: '8px',
  },
  successBox: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6EE7B7',
    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '12px', padding: '10px 14px', marginTop: '18px', textAlign: 'center',
    width: '100%', boxSizing: 'border-box',
  },
  comingSoonBadge: {
    marginTop: '18px', padding: '7px 16px', fontSize: '11px', fontWeight: 700,
    color: '#475569', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '50px', letterSpacing: '0.06em', textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif",
  },
};
