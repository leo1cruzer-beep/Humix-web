import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Briefcase, Gem, Pencil, Heart, Users, ArrowRight,
} from 'lucide-react';

const SERVICE_CARDS = [
  { id: 'life-assistant', label: 'Life Assistant', desc: 'Health checks, legal docs & daily guidance', Icon: Heart,      to: '/life-assistant', color: '#00C48C' },
  { id: 'finance',        label: 'Finance',        desc: 'Smart budgeting, debt payoff & wealth tools', Icon: TrendingUp, to: '/finance',        color: '#FFB340' },
  { id: 'career',         label: 'Career',         desc: 'AI résumés, interview prep & salary insights', Icon: Briefcase,  to: '/career',         color: '#0A84FF' },
  { id: 'business',       label: 'Business',       desc: 'Business plans, pitch decks & market research', Icon: Gem,       to: '/business',       color: '#FF6B35' },
  { id: 'creative',       label: 'Creative',       desc: 'Content writing, social media & brand voice', Icon: Pencil,     to: '/creative',       color: '#BF5AF2' },
  { id: 'community',      label: 'Community',      desc: 'Connect with 24K+ members worldwide', Icon: Users,          to: '/community',      color: '#FF375F' },
];

const STEPS = [
  { n: '1', title: 'Choose a service', desc: 'Pick from finance, career, health, business, and more — all in one place.' },
  { n: '2', title: 'Describe your need', desc: 'Talk to AI in your language. No jargon, no barriers, no friction.' },
  { n: '3', title: 'Take action', desc: 'Get personalized guidance, tools, and plans you can use right now.' },
];

export default function HomePage({ onScanToEnter }) {
  const navigate = useNavigate();
  return (
    <main className="page-enter page-transition">
      <HeroSection onScanToEnter={onScanToEnter} />
      <ServiceCardsSection navigate={navigate} />
      <HowItWorksSection />
    </main>
  );
}

function HeroSection({ onScanToEnter }) {
  const handleLearnMore = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={s.hero}>
      {/* Gradient orb background */}
      <div style={s.heroGradient} aria-hidden="true" />
      <div className="orb-wrap">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div style={s.heroInner}>
        {/* Eyebrow */}
        <div style={s.eyebrow}>
          <span style={s.eyebrowDot} />
          <span style={s.eyebrowText}>HUMIX PLATFORM</span>
        </div>

        {/* Headline */}
        <h1 style={s.headline}>
          AI built for the world's<br />
          <span style={s.headlineAccent}>next billion.</span>
        </h1>

        {/* Subheadline */}
        <p style={s.sub}>
          Health advice, legal help, income tools, and more —<br />
          in your language, on any device.
        </p>

        {/* CTAs */}
        <div style={s.ctaRow}>
          <button
            onClick={onScanToEnter}
            style={s.btnPrimary}
          >
            Get Started Free
          </button>
          <button
            onClick={handleLearnMore}
            style={s.btnGhost}
          >
            Learn More
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Trust indicators */}
        <div style={s.trustRow}>
          <TrustItem value="4B+" label="people served" />
          <div style={s.trustDivider} />
          <TrustItem value="150+" label="countries" />
          <div style={s.trustDivider} />
          <TrustItem value="Free" label="forever" />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ value, label }) {
  return (
    <div style={s.trustItem}>
      <span style={s.trustValue}>{value}</span>
      <span style={s.trustLabel}>{label}</span>
    </div>
  );
}

function ServiceCardsSection({ navigate }) {
  return (
    <section id="services-section" style={s.cardsSection}>
      <div className="container">
        <div style={s.cardsSectionHeader}>
          <p style={s.sectionEyebrow}>EVERYTHING IN ONE PLACE</p>
          <h2 style={s.cardsSectionTitle}>Six tools. One platform.</h2>
          <p style={s.cardsSectionSub}>AI services built for real people with real needs.</p>
        </div>
        <div className="cat-grid" style={s.cardsGrid}>
          {SERVICE_CARDS.map(card => (
            <ServiceCard key={card.id} card={card} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ card, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => navigate(card.to)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px', padding: '24px 20px', textAlign: 'left',
        cursor: 'pointer', transition: 'all 0.15s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.3)` : 'none',
        display: 'flex', flexDirection: 'column', gap: '16px', width: '100%',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: card.color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <card.Icon size={20} color={card.color} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#F5F5F5', marginBottom: '6px', letterSpacing: '-0.01em' }}>
          {card.label}
        </h3>
        <p style={{ fontSize: '13px', color: '#A0A0A0', lineHeight: 1.6 }}>{card.desc}</p>
      </div>

      {/* Arrow */}
      <span style={{
        fontSize: '16px',
        color: hov ? card.color : '#606060',
        transition: 'color 0.15s ease, transform 0.15s ease',
        display: 'inline-block',
        transform: hov ? 'translateX(3px)' : 'none',
      }}>
        →
      </span>
    </button>
  );
}

function HowItWorksSection() {
  return (
    <section style={s.howWrap}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={s.sectionEyebrow}>HOW IT WORKS</p>
          <h2 style={{ ...s.cardsSectionTitle, marginBottom: '12px' }}>Simple by design</h2>
          <p style={s.cardsSectionSub}>Three steps. No friction.</p>
        </div>
        <div className="steps-row" style={s.stepsRow}>
          {STEPS.map((step, i) => (
            <StepItem key={step.n} step={step} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, isLast }) {
  return (
    <div style={s.stepWrap}>
      <div style={s.stepContent}>
        <div style={s.stepBadge}>{step.n}</div>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#F5F5F5', margin: '18px 0 10px', letterSpacing: '-0.02em' }}>
          {step.title}
        </h3>
        <p style={{ fontSize: '14px', color: '#A0A0A0', lineHeight: 1.7 }}>{step.desc}</p>
      </div>
      {!isLast && <div className="step-connector" style={s.stepConnector} />}
    </div>
  );
}

const s = {
  hero: {
    minHeight: '100vh',
    background: [
      'radial-gradient(ellipse at 20% 50%, rgba(0,196,140,0.08) 0%, transparent 60%)',
      'radial-gradient(ellipse at 80% 20%, rgba(10,132,255,0.06) 0%, transparent 60%)',
      '#0C0C0D',
    ].join(', '),
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    paddingTop: '100px', paddingBottom: '80px',
    position: 'relative', overflow: 'hidden',
  },
  heroGradient: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 },
  heroInner: {
    position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto',
    padding: '0 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    marginBottom: '28px',
  },
  eyebrowDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#00C48C', display: 'inline-block', flexShrink: 0,
  },
  eyebrowText: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#00C48C', textTransform: 'uppercase',
  },
  headline: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: '-0.03em',
    lineHeight: 1.08, color: '#F5F5F5', marginBottom: '20px',
  },
  headlineAccent: { color: '#F5F5F5' },
  sub: {
    fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400,
    color: '#A0A0A0', lineHeight: 1.65,
    maxWidth: '560px', marginBottom: '40px',
  },
  ctaRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: '#00C48C', color: '#000', border: 'none',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    letterSpacing: '-0.01em',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: 'transparent', color: '#F5F5F5',
    border: '1px solid rgba(255,255,255,0.16)',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
    cursor: 'pointer', transition: 'border-color 0.15s ease, background 0.15s ease',
  },
  trustRow: { display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' },
  trustDivider: { width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' },
  trustItem: { display: 'flex', flex: 'row', alignItems: 'center', gap: '6px' },
  trustValue: { fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F5F5F5', letterSpacing: '-0.02em' },
  trustLabel: { fontSize: '13px', fontWeight: 400, color: '#606060' },
  cardsSection: { background: '#0C0C0D', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' },
  cardsSectionHeader: { textAlign: 'center', marginBottom: '48px' },
  sectionEyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#606060', textTransform: 'uppercase', marginBottom: '12px',
  },
  cardsSectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em', color: '#F5F5F5', marginBottom: '10px',
  },
  cardsSectionSub: { fontSize: '16px', color: '#606060', fontWeight: 400 },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  howWrap: { background: '#0A0A0B', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' },
  stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' },
  stepWrap: { display: 'flex', alignItems: 'flex-start', position: 'relative' },
  stepContent: { flex: 1, padding: '0 40px 0 0' },
  stepBadge: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'rgba(0,196,140,0.10)', border: '1px solid rgba(0,196,140,0.20)',
    color: '#00C48C', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepConnector: {
    position: 'absolute', top: '20px', right: '-16px',
    width: '32px', borderTop: '1px dashed rgba(255,255,255,0.10)', zIndex: 1,
  },
};
