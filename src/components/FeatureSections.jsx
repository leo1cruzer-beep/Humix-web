import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function useReveal(deps = []) {
  const refs = useRef([]);
  useEffect(() => {
    const els = refs.current.filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, deps);
  return refs;
}

const SECTIONS = [
  {
    slug: 'automate', label: 'Automate', flip: false,
    bg: 'linear-gradient(180deg, #F0F7FF 0%, #fff 100%)',
    headline: 'Your entire life\non autopilot.',
    body: 'Connect your apps, schedule tasks, and let AI handle the repetitive work. Save 3+ hours every single day.',
    bullets: [
      'Visual drag-and-drop workflow builder',
      'AI Prompts Library — 500+ ready-made prompts',
      'Auto-publish across all social platforms',
      'Trading bots for crypto and forex',
    ],
    accentColor: '#2563EB',
    Mockup: AutomateMockup,
  },
  {
    slug: 'finance', label: 'Finance', flip: true,
    bg: 'linear-gradient(180deg, #F0FDF4 0%, #fff 100%)',
    headline: 'From debt\nto freedom.',
    body: 'Clear debt with a plan you can actually follow. Track every rupee, dirham, and naira. Build wealth — whatever your starting point.',
    bullets: [
      'Step-by-step debt repayment plans',
      'Smart budgeting that adapts to your income',
      'Best remittance rates across 47 countries',
      'Crypto P2P comparison and portfolio tracker',
    ],
    accentColor: '#059669',
    Mockup: FinanceMockup,
  },
  {
    slug: 'companion', label: 'Companion', flip: false,
    bg: 'linear-gradient(180deg, #F5F3FF 0%, #fff 100%)',
    headline: 'An AI that\nnever forgets.',
    body: 'Set goals. Build habits. Have honest conversations with an AI that remembers everything you have shared — and holds you accountable.',
    bullets: [
      'Memory that persists across every session',
      'Daily check-ins and accountability tracking',
      'Language practice in 12 languages',
      'Private, judgment-free safe space',
    ],
    accentColor: '#7C3AED',
    Mockup: CompanionMockup,
  },
  {
    slug: 'life-assistant', label: 'Life Assistant', flip: true,
    bg: 'linear-gradient(180deg, #FFF7ED 0%, #fff 100%)',
    headline: 'Knowledge for\nevery human.',
    body: 'Health emergencies, legal rights, crop diseases, scholarships. Real guidance for the real problems that Silicon Valley ignores.',
    bullets: [
      'Symptom checker and home remedy guide',
      'Legal rights in plain language — no lawyer needed',
      'Crop disease diagnosis and farm advisor',
      'Scholarship and free course finder',
    ],
    accentColor: '#EA580C',
    Mockup: LifeMockup,
  },
];

export default function FeatureSections() {
  return (
    <>
      {SECTIONS.map(sec => <FeatureSection key={sec.slug} {...sec} />)}
    </>
  );
}

function FeatureSection({ slug, label, flip, bg, headline, body, bullets, accentColor, Mockup }) {
  const refs = useReveal([slug]);
  const setRef = (i) => el => { refs.current[i] = el; };

  const text = (
    <div ref={setRef(0)} className="reveal-left reveal feature-text" style={s.text}>
      <p style={{ ...s.eyebrow, color: accentColor }}>{label}</p>
      <h2 style={s.headline}>
        {headline.split('\n').map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
      </h2>
      <p style={s.body}>{body}</p>
      <ul style={s.bullets}>
        {bullets.map((b, i) => (
          <li key={i} style={s.bullet}>
            <Check color={accentColor} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        to={`/service/${slug}`}
        style={{ ...s.cta, color: accentColor }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
      >
        Explore {label} <ArrowRight color={accentColor} />
      </Link>
    </div>
  );

  const visual = (
    <div ref={setRef(1)} className="reveal-right reveal" style={s.visual}>
      <Mockup accentColor={accentColor} />
    </div>
  );

  return (
    <section style={{ ...s.section, background: bg }}>
      <div className="container">
        <div className="feature-row" style={{ ...s.row, flexDirection: flip ? 'row-reverse' : 'row' }}>
          {text}
          {visual}
        </div>
      </div>
    </section>
  );
}

/* ── Mockups ─────────────────────────────────────────────────── */

function AutomateMockup() {
  const nodes = [
    { label: 'Gmail',    color: '#EA4335' },
    { label: 'AI Sort',  color: '#A78BFA' },
    { label: 'Slack',    color: '#4A154B' },
    { label: 'Sheets',   color: '#34A853' },
  ];
  return (
    <div style={mk.card}>
      <div style={mk.cardBar}>
        <div style={{ ...mk.statusDot, background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
        <span style={mk.barText}>Workflow active — 1,247 runs today</span>
        <span style={{ ...mk.badge2, background: '#DCFCE7', color: '#166534' }}>Live</span>
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        <p style={mk.sectionLabel}>Active workflow</p>
        <div style={mk.flowRow}>
          {nodes.map((n, i) => (
            <div key={i} style={mk.flowItem}>
              <div style={{ ...mk.flowNode, borderColor: n.color + '60', background: n.color + '12' }}>
                <span style={{ ...mk.flowDot, background: n.color }} />
                <span style={mk.flowLabel}>{n.label}</span>
              </div>
              {i < nodes.length - 1 && <span style={mk.flowArrow}>→</span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <p style={{ ...mk.sectionLabel, marginTop: 16 }}>Recent runs</p>
        {[
          { name: 'Email digest → Notion',   t: '2m',  ok: true },
          { name: 'Twitter DM → Spreadsheet',t: '11m', ok: true },
          { name: 'Form submit → Slack alert',t: '1h',  ok: true },
        ].map((r, i) => (
          <div key={i} style={mk.runRow}>
            <span style={mk.runCheck}>✓</span>
            <span style={mk.runName}>{r.name}</span>
            <span style={mk.runTime}>{r.t} ago</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceMockup() {
  return (
    <div style={mk.card}>
      <div style={mk.cardBar}>
        <div style={{ ...mk.statusDot, background: '#34D399' }} />
        <span style={mk.barText}>Debt tracker</span>
        <span style={{ ...mk.badge2, background: '#DCFCE7', color: '#166534' }}>On track</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Total cleared</div>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', color: '#0A0A0A', lineHeight: 1 }}>$18,400</div>
        <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 6 }}>+$2,100 this month</div>
        <div style={{ margin: '20px 0 4px', fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Breakdown</div>
        {[
          { label: 'Credit card',  pct: 100, amount: '$4,200', done: true },
          { label: 'Personal loan',pct: 100, amount: '$8,000', done: true },
          { label: 'Car loan',     pct: 76,  amount: '$6,200', done: false },
        ].map((d, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
              <span style={{ fontWeight: 500, color: '#374151' }}>{d.label}</span>
              <span style={{ fontWeight: 600, color: d.done ? '#059669' : '#0A0A0A' }}>{d.done ? 'Cleared' : d.amount}</span>
            </div>
            <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.pct}%`, background: d.done ? '#34D399' : '#60A5FA', borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanionMockup() {
  return (
    <div style={{ ...mk.card, background: '#0F0F1A', border: '1px solid rgba(167,139,250,0.15)' }}>
      <div style={{ ...mk.cardBar, background: '#0A0A14', borderBottomColor: 'rgba(255,255,255,0.06)' }}>
        <div style={{ ...mk.statusDot, background: '#A78BFA', boxShadow: '0 0 6px #A78BFA' }} />
        <span style={{ ...mk.barText, color: 'rgba(255,255,255,0.45)' }}>Companion — remembers 47 things</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {['Goal: debt-free Dec', 'Learning Spanish', '90-day streak', 'Morning runs'].map(tag => (
          <span key={tag} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 99, background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.18)', fontWeight: 500 }}>{tag}</span>
        ))}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { side: 'ai',   text: 'You mentioned your 90-day goal yesterday. Day 34 — how are you feeling?' },
          { side: 'user', text: "Hard. But I haven't given up yet." },
          { side: 'ai',   text: 'On day 1 you wrote: "I want to feel proud of myself." You already are.' },
        ].map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.side === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', background: msg.side === 'user' ? '#2563EB' : 'rgba(255,255,255,0.06)', borderRadius: msg.side === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '10px 13px', fontSize: 12, color: msg.side === 'user' ? '#fff' : 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function LifeMockup() {
  const tiles = [
    { label: 'Health',    sub: 'Symptom checker',  color: '#EA580C', bg: '#FFF7ED' },
    { label: 'Legal',     sub: 'Know your rights',  color: '#CA8A04', bg: '#FEFCE8' },
    { label: 'Farming',   sub: 'Crop advisor',       color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Education', sub: 'Find scholarships',  color: '#2563EB', bg: '#EFF6FF' },
  ];
  return (
    <div style={mk.card}>
      <div style={mk.cardBar}>
        <div style={{ ...mk.statusDot, background: '#FB923C' }} />
        <span style={mk.barText}>Life Assistant — active guide</span>
      </div>
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {tiles.map(t => (
          <div key={t.label} style={{ background: t.bg, borderRadius: 10, padding: '14px', border: `1px solid ${t.color}20` }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, marginBottom: 10 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A', marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: '#71717A' }}>{t.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '0 16px 16px', background: '#F9FAFB', border: '1px solid #E4E4E7', borderRadius: 10, padding: '13px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Active guide</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>Get CNIC without a dalaal — step by step</div>
        <div style={{ fontSize: 11, color: '#71717A', marginTop: 3 }}>Step 3 of 7 · Legal documents · Pakistan</div>
        <div style={{ marginTop: 10, height: 3, background: '#E4E4E7', borderRadius: 2 }}>
          <div style={{ height: '100%', width: '43%', background: '#EA580C', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Small icons ─────────────────────────────────────────────── */
function Check({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="7.5" stroke={color} strokeOpacity="0.25" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRight({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 2l5 5-5 5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  section: { padding: '120px 0' },
  row: {
    display: 'flex', alignItems: 'center', gap: 80,
  },
  text: { flex: '0 0 400px', maxWidth: 400 },
  visual: { flex: 1, minWidth: 0 },
  eyebrow: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(32px, 3.8vw, 48px)',
    fontWeight: 700, lineHeight: 1.12,
    letterSpacing: 'clamp(-1px, -0.028em, -2px)',
    color: '#0A0A0A', marginBottom: 20,
  },
  body: { fontSize: 16, fontWeight: 400, color: '#71717A', lineHeight: 1.7, marginBottom: 24 },
  bullets: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 },
  bullet: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.5 },
  cta: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 14, fontWeight: 600,
    transition: 'gap 0.2s var(--ease)',
  },
};

const mk = {
  card: {
    background: '#fff', border: '1.5px solid #E4E4E7',
    borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  },
  cardBar: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 16px',
    background: '#FAFAFA', borderBottom: '1px solid #F4F4F5',
  },
  statusDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  barText: { fontSize: 11, fontWeight: 500, color: '#71717A', flex: 1 },
  badge2: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.02em' },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 },
  flowRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  flowItem: { display: 'flex', alignItems: 'center', gap: 8 },
  flowNode: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1.5px solid' },
  flowDot: { width: 6, height: 6, borderRadius: '50%' },
  flowLabel: { fontSize: 12, fontWeight: 600, color: '#0A0A0A' },
  flowArrow: { fontSize: 12, color: '#D1D5DB' },
  runRow: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0', borderTop: '1px solid #F9FAFB' },
  runCheck: { fontSize: 12, color: '#22C55E', fontWeight: 700, flexShrink: 0 },
  runName: { fontSize: 12, color: '#52525B', flex: 1 },
  runTime: { fontSize: 11, color: '#9CA3AF', flexShrink: 0 },
};
