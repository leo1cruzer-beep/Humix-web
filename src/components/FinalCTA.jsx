import { useState, useRef, useEffect } from 'react';

export default function FinalCTA() {
  const [email, setEmail]       = useState('');
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');
  const ref                     = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Enter a valid email.'); return; }
    setError('');
    setDone(true);
  };

  return (
    <section style={s.section}>
      <div style={s.glow} />
      <div className="container">
        <div ref={ref} className="reveal" style={s.inner}>
          <p style={s.eyebrow}>Get started</p>
          <h2 style={s.headline}>Ready to change your life?</h2>
          <p style={s.body}>
            Free forever. No credit card required.
            <br />
            Available in 12 languages across 47 countries.
          </p>

          {done ? (
            <div style={s.success}>
              <span style={s.tick}>✓</span>
              Check your inbox — you're in.
            </div>
          ) : (
            <form onSubmit={submit} style={s.form}>
              <div style={s.inputWrap}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  style={{ ...s.input, borderColor: error ? '#EF4444' : 'rgba(255,255,255,0.12)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                  onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                {error && <p style={s.error}>{error}</p>}
              </div>
              <button
                type="submit"
                style={s.submitBtn}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E4E7'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
              >
                Get Started Free
              </button>
            </form>
          )}

          <p style={s.note}>No spam · Unsubscribe anytime · All data stays private</p>

          <div style={s.bottomMeta}>
            {['Pakistan', 'Nigeria', 'Kenya', 'Qatar', 'Egypt', 'Ghana', 'Nepal', 'Bangladesh'].map(c => (
              <span key={c} style={s.pill}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const s = {
  section: {
    background: '#0A0A0A', padding: '120px 0',
    position: 'relative', overflow: 'hidden',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  glow: {
    position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 800, height: 500,
    background: 'radial-gradient(ellipse, rgba(37,99,235,0.14) 0%, transparent 70%)',
    pointerEvents: 'none', filter: 'blur(50px)',
    animation: 'glow-pulse 8s ease-in-out infinite',
  },
  inner: { maxWidth: 540, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 },
  eyebrow: { fontSize: 12, fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700,
    letterSpacing: 'clamp(-1.5px, -0.028em, -2.5px)', lineHeight: 1.1,
    color: '#fff', marginBottom: 18,
  },
  body: { fontSize: 17, color: '#52525B', lineHeight: 1.65, marginBottom: 40 },
  form: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' },
  inputWrap: { flex: 1, minWidth: 220, position: 'relative' },
  input: {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.055)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 8, fontSize: 14, color: '#fff',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    padding: '13px 24px', background: '#fff', color: '#0A0A0A',
    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif',",
    transition: 'background 0.15s, transform 0.18s var(--ease)',
    flexShrink: 0,
  },
  error: { fontSize: 12, color: '#EF4444', marginTop: 6, textAlign: 'left' },
  success: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 24px',
    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 10, color: '#4ADE80', fontSize: 15, fontWeight: 500,
  },
  tick: { fontSize: 18, fontWeight: 800 },
  note: { fontSize: 12, color: '#3F3F46', marginTop: 14 },
  bottomMeta: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 48, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' },
  pill: { fontSize: 11, fontWeight: 500, color: '#3F3F46', padding: '3px 10px', borderRadius: 99, border: '1px solid #27272A' },
};
