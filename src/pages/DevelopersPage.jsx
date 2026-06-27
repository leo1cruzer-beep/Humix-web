import { useState } from 'react';
import { ArrowRight, Code2, Globe, Mic, Cpu, WifiOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AVAILABLE = [
  {
    Icon: Cpu,
    color: '#00C48C',
    title: 'Life Assistant API',
    desc: 'Access Havro\'s multilingual life-guidance layer — health triage, legal Q&A, and daily assistance — via REST. Supports Arabic, Urdu, Swahili, English, and more.',
    tags: ['REST API', 'Multilingual', 'JSON'],
  },
  {
    Icon: Globe,
    color: '#0A84FF',
    title: 'Language Detection',
    desc: 'Automatic dialect-level language identification optimized for low-resource languages. Returns language code, script, and confidence score.',
    tags: ['REST API', '50+ Languages', 'Real-time'],
  },
  {
    Icon: Mic,
    color: '#FFB340',
    title: 'SMS / IVR Integration',
    desc: 'Webhooks and adapters for connecting Havro\'s AI to SMS gateways and IVR telephony systems. Reach users with no internet or smartphone.',
    tags: ['Webhooks', 'IVR', 'SMS'],
  },
];

const COMING_SOON = [
  {
    Icon: Code2,
    color: '#BF5AF2',
    title: 'Agent SDK',
    desc: 'Build autonomous Havro agents that can complete multi-step tasks, earn commissions, and interact with the Havro economy on behalf of users.',
  },
  {
    Icon: WifiOff,
    color: '#FF375F',
    title: 'Offline Sync API',
    desc: 'Bi-directional sync for deploying Havro services to communities with intermittent connectivity — sync when connected, operate offline.',
  },
];

export default function DevelopersPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase
        .from('dev_waitlist')
        .insert({ email: email.trim() });
      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={s.page}>
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true" />
        <div style={s.heroInner}>
          <p style={s.eyebrow}>DEVELOPERS</p>
          <h1 style={s.headline}>Build on Havro</h1>
          <p style={s.subheadline}>
            Open API access for developers building tools for underserved communities.
          </p>
        </div>
      </section>

      {/* What's Available */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>WHAT'S AVAILABLE</p>
          <h2 style={s.sectionTitle}>APIs available in early access</h2>
          <div style={s.apiGrid}>
            {AVAILABLE.map((api, i) => (
              <div key={i} style={s.apiCard}>
                <div style={{ ...s.apiIcon, background: api.color + '14', border: `1px solid ${api.color}28` }}>
                  <api.Icon size={22} color={api.color} strokeWidth={1.8} />
                </div>
                <h3 style={s.apiTitle}>{api.title}</h3>
                <p style={s.apiDesc}>{api.desc}</p>
                <div style={s.tagRow}>
                  {api.tags.map(tag => (
                    <span key={tag} style={s.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section style={s.sectionAlt}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>COMING SOON</p>
          <h2 style={s.sectionTitle}>On the roadmap</h2>
          <div style={s.comingGrid}>
            {COMING_SOON.map((api, i) => (
              <div key={i} style={s.comingCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ ...s.apiIcon, background: api.color + '0f', border: `1px solid ${api.color}22` }}>
                    <api.Icon size={20} color={api.color} strokeWidth={1.8} />
                  </div>
                  <span style={{ ...s.comingSoonBadge }}>Coming Soon</span>
                </div>
                <h3 style={s.apiTitle}>{api.title}</h3>
                <p style={s.apiDesc}>{api.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.waitlistBox}>
            <p style={s.sectionEyebrow}>EARLY ACCESS</p>
            <h2 style={{ ...s.sectionTitle, marginBottom: '12px' }}>Get API access</h2>
            <p style={s.waitlistSubtitle}>
              We're onboarding developers building for underserved communities. Join the list and we'll send docs and credentials when you're approved.
            </p>

            {success ? (
              <div style={s.successInline}>
                <span style={s.successCheck}>✓</span>
                <div>
                  <p style={s.successTitle}>You're on the list.</p>
                  <p style={s.successMsg}>We'll send your API credentials when you're approved.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={s.form}>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={s.input}
                />
                {error && <p style={s.error}>{error}</p>}
                <button type="submit" disabled={loading} style={s.submitBtn}>
                  {loading ? 'Joining…' : 'Request Access'}
                  {!loading && <ArrowRight size={16} strokeWidth={2} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const s = {
  page: { background: '#0C0C0D', minHeight: '100vh' },

  hero: {
    background: '#080809',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '100px 24px 80px',
    position: 'relative', overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: [
      'radial-gradient(ellipse at 70% 40%, rgba(10,132,255,0.07) 0%, transparent 60%)',
      'radial-gradient(ellipse at 20% 60%, rgba(0,196,140,0.05) 0%, transparent 60%)',
    ].join(', '),
  },
  heroInner: {
    position: 'relative', zIndex: 1,
    maxWidth: '720px', margin: '0 auto', textAlign: 'center',
  },
  eyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#0A84FF', textTransform: 'uppercase', marginBottom: '16px',
  },
  headline: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '-0.03em',
    lineHeight: 1.08, color: '#F5F5F5', marginBottom: '20px',
  },
  subheadline: {
    fontSize: 'clamp(15px, 2vw, 18px)', color: '#A0A0A0',
    lineHeight: 1.65, maxWidth: '540px', margin: '0 auto',
  },

  section: {
    padding: '80px 24px',
    background: '#0C0C0D',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  sectionAlt: {
    padding: '80px 24px',
    background: '#080809',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  container: { maxWidth: '900px', margin: '0 auto' },
  sectionEyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#606060', textTransform: 'uppercase', marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em',
    color: '#F5F5F5', marginBottom: '40px',
  },

  apiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  apiCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '28px 24px',
    display: 'flex', flexDirection: 'column',
  },
  apiIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '18px', flexShrink: 0,
  },
  apiTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    color: '#F5F5F5', marginBottom: '10px', letterSpacing: '-0.01em',
  },
  apiDesc: {
    fontSize: '13px', color: '#606060', lineHeight: 1.65, flex: 1, marginBottom: '18px',
  },
  tagRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  tag: {
    fontSize: '11px', fontWeight: 600, color: '#A0A0A0',
    padding: '3px 10px', borderRadius: '99px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em',
  },

  comingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  comingCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '28px 24px',
    opacity: 0.8,
  },
  comingSoonBadge: {
    fontSize: '11px', fontWeight: 600, color: '#606060',
    padding: '4px 10px', borderRadius: '99px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.04em',
  },

  waitlistBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '48px 40px',
    maxWidth: '560px',
  },
  waitlistSubtitle: {
    fontSize: '15px', color: '#606060', lineHeight: 1.65, marginBottom: '28px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    height: '48px', padding: '0 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '15px', fontFamily: "'Inter', sans-serif",
    color: '#F5F5F5', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  error: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#FF6B6B',
    padding: '10px 14px', background: 'rgba(255,107,107,0.08)',
    borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)', margin: 0,
  },
  submitBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    height: '48px', padding: '0 28px',
    background: '#0A84FF', color: '#fff',
    border: 'none', borderRadius: '10px',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    alignSelf: 'flex-start',
  },
  successInline: {
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    padding: '20px 24px',
    background: 'rgba(0,196,140,0.06)',
    border: '1px solid rgba(0,196,140,0.2)',
    borderRadius: '12px',
  },
  successCheck: {
    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
    background: 'rgba(0,196,140,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#00C48C',
  },
  successTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px',
    color: '#F5F5F5', marginBottom: '4px',
  },
  successMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#606060',
  },
};
