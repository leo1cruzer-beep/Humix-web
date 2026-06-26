import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const WORDS = ['Every need.', 'Every language.', 'Every human.'];
const COUNTRIES = ['Pakistan', 'Nigeria', 'Kenya', 'Qatar', 'Bangladesh', 'Ghana', 'Egypt', 'Nepal'];

// Deterministic particles — no randomness, same each render
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 13.7 + 3) % 94 + 3}%`,
  top:  `${(i * 9.3 + 7) % 86 + 7}%`,
  size: (i % 3) + 1,
  delay: (i * 0.35) % 5,
  dur:   4 + (i % 4),
  opacity: 0.04 + (i % 5) * 0.015,
}));

export default function Hero() {
  const [wordIdx, setWordIdx]   = useState(0);
  const [phase, setPhase]       = useState('in'); // 'in' | 'out'
  const timerRef = useRef(null);

  useEffect(() => {
    const cycle = () => {
      setPhase('out');
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setPhase('in');
      }, 380);
    };
    timerRef.current = setInterval(cycle, 2600);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section style={s.section}>
      {/* Dot grid */}
      <div style={s.dotGrid} />

      {/* Glow orbs */}
      <div style={{ ...s.orb, ...s.orb1 }} />
      <div style={{ ...s.orb, ...s.orb2 }} />
      <div style={{ ...s.orb, ...s.orb3 }} />

      {/* Particles */}
      <div style={s.particleLayer} aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.left, top: p.top,
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: '#fff',
              opacity: p.opacity,
              animation: `particle-float ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container" style={s.inner}>
        {/* Badge */}
        <div style={s.badge}>
          <span style={s.badgeDot} />
          AI-powered · Voice-first · Built for 4 billion people
        </div>

        {/* Headline */}
        <h1 style={s.h1}>
          <span style={s.line1}>One platform.</span>
          <span style={s.line2}>
            <span
              style={{
                ...s.word,
                opacity: phase === 'in' ? 1 : 0,
                transform: phase === 'in' ? 'translateY(0)' : 'translateY(-18px)',
              }}
            >
              {WORDS[wordIdx]}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p style={s.sub}>
          AI-powered services for health, finance, automation, and life —<br className="hide-on-mobile" />
          for every person on earth.
        </p>

        {/* CTAs */}
        <div style={s.ctas}>
          <Link to="/join" className="btn btn-blue btn-lg">
            Get Started Free
          </Link>
          <Link to="/how-it-works" className="btn btn-ghost-white btn-lg">
            See how it works
            <Arrow />
          </Link>
        </div>

        {/* Trust row */}
        <div style={s.trust}>
          <span style={s.trustText}>Trusted by 15M+ people in 47 countries</span>
          <div style={s.trustDivider} />
          <div style={s.flags}>
            {COUNTRIES.map(c => (
              <span key={c} style={s.flag}>{c}</span>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div style={s.mockupWrap}>
          <AppMockup />
        </div>
      </div>
    </section>
  );
}

/* ── App mockup ─────────────────────────────────────────────── */
function AppMockup() {
  return (
    <div style={m.shell} role="img" aria-label="Havro dashboard preview">
      {/* Window chrome */}
      <div style={m.chrome}>
        <div style={m.chromeDots}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <span key={c} style={{ ...m.chromeDot, background: c }} />
          ))}
        </div>
        <div style={m.chromeTitle}>Havro — Dashboard</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={m.body}>
        {/* Sidebar */}
        <aside style={m.sidebar}>
          {[
            { label: 'Automate',       color: '#60A5FA', active: false },
            { label: 'Finance',        color: '#34D399', active: true  },
            { label: 'Companion',      color: '#A78BFA', active: false },
            { label: 'Life Assistant', color: '#FB923C', active: false },
            { label: 'Career',         color: '#F472B6', active: false },
            { label: 'Community',      color: '#38BDF8', active: false },
          ].map(item => (
            <div key={item.label} style={{ ...m.sideItem, background: item.active ? 'rgba(255,255,255,0.07)' : 'transparent' }}>
              <span style={{ ...m.sideDot, background: item.color }} />
              <span style={{ ...m.sideLabel, opacity: item.active ? 1 : 0.45 }}>{item.label}</span>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main style={m.main}>
          {/* Stats row */}
          <div style={m.statsRow}>
            {[
              { label: 'Automations',    val: '24',    color: '#60A5FA', up: '+3' },
              { label: 'Debt cleared',   val: '$4,200', color: '#34D399', up: 'on track' },
              { label: 'Goals this month', val: '7 / 10', color: '#A78BFA', up: '70%' },
            ].map((st, i) => (
              <div key={i} style={m.statCard}>
                <div style={m.statTop}>
                  <span style={m.statLabel}>{st.label}</span>
                  <span style={{ ...m.statUp, color: st.color }}>{st.up}</span>
                </div>
                <div style={{ ...m.statVal, color: st.color }}>{st.val}</div>
              </div>
            ))}
          </div>

          {/* Feed */}
          <div style={m.feedHead}>Recent activity</div>
          {[
            { t: 'Gmail → Notion workflow completed',        c: '#60A5FA', time: '2m' },
            { t: 'Monthly debt payment logged — $350',       c: '#34D399', time: '18m' },
            { t: 'Companion: morning check-in noted',        c: '#A78BFA', time: '1h' },
            { t: 'Legal guide: passport docs confirmed',     c: '#FB923C', time: '3h' },
          ].map((f, i) => (
            <div key={i} style={m.feedRow}>
              <span style={{ ...m.feedDot2, background: f.c }} />
              <span style={m.feedTxt}>{f.t}</span>
              <span style={m.feedTime}>{f.time}</span>
            </div>
          ))}

          {/* Progress */}
          <div style={m.prog}>
            <div style={m.progTop}>
              <span>Savings goal — December</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>68%</span>
            </div>
            <div style={m.progTrack}>
              <div style={m.progFill} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  section: {
    minHeight: '100vh', background: '#0A0A0A',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 120, paddingBottom: 0,
    position: 'relative', overflow: 'hidden',
  },
  dotGrid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    animation: 'dot-grid-pan 12s linear infinite',
  },
  particleLayer: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  orb: { position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(70px)' },
  orb1: { width: 700, height: 500, top: -120, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 70%)', animation: 'glow-pulse 8s ease-in-out infinite' },
  orb2: { width: 500, height: 400, top: 200, left: -160,  background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', animation: 'glow-pulse 11s ease-in-out infinite 2s' },
  orb3: { width: 500, height: 400, top: 160, right: -120, background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)', animation: 'glow-pulse 13s ease-in-out infinite 5s' },
  inner: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 99, padding: '6px 16px',
    fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.01em', marginBottom: 32,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#34D399',
    display: 'inline-block', boxShadow: '0 0 6px #34D399',
  },
  h1: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800,
    fontSize: 'clamp(44px, 7.5vw, 84px)',
    letterSpacing: 'clamp(-2px, -0.036em, -3.5px)',
    lineHeight: 1.06, color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 4, marginBottom: 28,
  },
  line1: { display: 'block', color: '#fff' },
  line2: { display: 'block', position: 'relative', height: '1.08em', overflow: 'hidden' },
  word: {
    display: 'block', color: 'rgba(255,255,255,0.42)',
    transition: 'opacity 0.32s var(--ease), transform 0.32s var(--ease)',
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    /* center the animated word */
    textAlign: 'center',
    width: 'max-content',
  },
  sub: {
    fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 400,
    color: 'rgba(255,255,255,0.45)', lineHeight: 1.65,
    maxWidth: 560, marginBottom: 40,
  },
  ctas: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 },
  trust: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 72 },
  trustText: { fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 },
  trustDivider: { width: 32, height: 1, background: 'rgba(255,255,255,0.1)' },
  flags: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  flag: {
    fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.28)',
    padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)',
  },
  mockupWrap: { width: '100%', maxWidth: 900, animation: 'floatSlow 8s ease-in-out infinite', willChange: 'transform' },
};

const m = {
  shell: {
    background: '#161616', borderRadius: '16px 16px 0 0',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.9)',
    overflow: 'hidden',
  },
  chrome: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', background: '#1A1A1A',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  chromeDots: { display: 'flex', gap: 6, alignItems: 'center' },
  chromeDot: { width: 10, height: 10, borderRadius: '50%', display: 'inline-block' },
  chromeTitle: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 },
  body: { display: 'flex', height: 320 },
  sidebar: {
    width: 160, background: '#131313', borderRight: '1px solid rgba(255,255,255,0.05)',
    padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 2,
  },
  sideItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6 },
  sideDot:  { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  sideLabel:{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500, transition: 'opacity 0.2s' },
  main: { flex: 1, padding: '16px 18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
  statCard: {
    background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10, padding: '12px 14px',
  },
  statTop:  { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  statLabel:{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500 },
  statUp:   { fontSize: 10, fontWeight: 600 },
  statVal:  { fontSize: 20, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1 },
  feedHead: { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  feedRow:  { display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  feedDot2: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  feedTxt:  { fontSize: 11, color: 'rgba(255,255,255,0.55)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  feedTime: { fontSize: 10, color: 'rgba(255,255,255,0.2)', flexShrink: 0 },
  prog: { marginTop: 'auto' },
  progTop:  { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 },
  progTrack:{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  progFill: { height: '100%', width: '68%', background: 'linear-gradient(90deg,#2563EB,#34D399)', borderRadius: 2 },
};
