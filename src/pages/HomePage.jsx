import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Briefcase, Gem, Pencil, Heart, Users,
} from 'lucide-react';

const SERVICE_CARDS = [
  { id: 'finance',        label: 'Finance',        desc: 'Smart budgeting, debt payoff & wealth tools',      Icon: TrendingUp, to: '/finance',        color: '#10B981' },
  { id: 'career',         label: 'Career',          desc: 'AI résumés, interview prep & salary insights',      Icon: Briefcase,  to: '/career',         color: '#6366F1' },
  { id: 'business',       label: 'Business',        desc: 'Business plans, pitch decks & market research',    Icon: Gem,        to: '/business',       color: '#8B5CF6' },
  { id: 'creative',       label: 'Creative',        desc: 'Content writing, social media & brand voice',      Icon: Pencil,     to: '/creative',       color: '#F59E0B' },
  { id: 'life-assistant', label: 'Life Assistant',  desc: 'Health checks, legal docs & daily guidance',       Icon: Heart,      to: '/life-assistant', color: '#EF4444' },
  { id: 'community',      label: 'Community',       desc: 'Connect with 24K+ members worldwide',              Icon: Users,      to: '/community',      color: '#06B6D4' },
];

const STEPS = [
  { n: '1', title: 'Sign in with email',  desc: 'We send a secure magic link — no password, no phone number, no documents needed.' },
  { n: '2', title: 'Access everything',   desc: 'Finance, career, health, business — one account unlocks every service on the platform.' },
  { n: '3', title: 'Take action',         desc: 'AI tools that turn insight into results. In your language, at your pace.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <main className="page-enter page-transition">
      <HeroSection navigate={navigate} />
      <ServiceCardsSection navigate={navigate} />
      <HowItWorksSection />
    </main>
  );
}

function HeroSection({ navigate }) {
  return (
    <section style={s.hero}>
      {/* Gradient orbs — CSS animation only */}
      <div className="orb-wrap">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Dot grid */}
      <div className="dot-grid-bg" style={s.dotGrid} />

      <div style={s.heroInner}>
        {/* Eyebrow badge */}
        <div style={s.eyebrowWrap}>
          <div style={s.eyebrow}>
            <span style={s.eyebrowDot} />
            Biometric Identity Platform · 150+ Countries
          </div>
        </div>

        {/* Headline */}
        <h1 style={s.headline}>
          Your Identity.<br />Your World.
        </h1>

        {/* Subtitle */}
        <p style={s.sub}>
          One face. Access everything. No documents needed.
        </p>

        {/* Primary CTA */}
        <button
          className="btn-cta"
          onClick={() => navigate('/explore')}
          style={{ marginBottom: '56px' }}
        >
          Start Exploring
        </button>

        {/* Stats row */}
        <div style={s.statsRow}>
          <StatItem value="4B+" label="People" />
          <div style={s.statDivider} />
          <StatItem value="150+" label="Countries" />
          <div style={s.statDivider} />
          <StatItem value="0" label="Documents" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }) {
  return (
    <div style={s.statItem}>
      <span style={s.statValue}>{value}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  );
}

function ServiceCardsSection({ navigate }) {
  return (
    <section style={s.cardsSection}>
      <div className="container">
        <div style={s.cardsSectionHeader}>
          <h2 style={s.cardsSectionTitle}>Everything under one identity</h2>
          <p style={s.cardsSectionSub}>Six systems. One face. Zero friction.</p>
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
        background: hov ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${hov ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '20px',
        padding: '28px 24px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px rgba(99,102,241,0.18)` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        width: '100%',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '16px',
        background: card.color + '20',
        border: `1px solid ${card.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <card.Icon size={24} color={card.color} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#F8FAFC', marginBottom: '7px', letterSpacing: '-0.02em' }}>
          {card.label}
        </h3>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>{card.desc}</p>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color: card.color, letterSpacing: '-0.01em' }}>
        Explore →
      </span>
    </button>
  );
}

function HowItWorksSection() {
  return (
    <section style={s.howWrap}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ ...s.cardsSectionTitle, marginBottom: '12px' }}>How it works</h2>
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
        <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#F8FAFC', margin: '18px 0 10px', letterSpacing: '-0.02em' }}>
          {step.title}
        </h3>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.7 }}>{step.desc}</p>
      </div>
      {!isLast && <div className="step-connector" style={s.stepConnector} />}
    </div>
  );
}

const s = {
  hero: {
    minHeight: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '120px',
    paddingBottom: '80px',
    position: 'relative',
    overflow: 'hidden',
  },
  dotGrid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.3,
    zIndex: 0,
    pointerEvents: 'none',
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '720px',
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  eyebrowWrap: { marginBottom: '28px' },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '99px',
    padding: '7px 18px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.02em',
  },
  eyebrowDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10B981',
    boxShadow: '0 0 8px #10B981',
    display: 'inline-block',
  },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 900,
    fontSize: 'clamp(44px, 8vw, 88px)',
    letterSpacing: 'clamp(-2px, -0.04em, -4px)',
    lineHeight: 1.04,
    color: '#F8FAFC',
    marginBottom: '24px',
  },
  sub: {
    fontSize: 'clamp(16px, 2.2vw, 21px)',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.6,
    maxWidth: '520px',
    marginBottom: '44px',
    letterSpacing: '-0.01em',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
  },
  statValue: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '26px',
    color: '#F8FAFC',
    letterSpacing: '-0.03em',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  cardsSection: {
    background: '#0A0A0A',
    padding: '100px 0',
    borderTop: '1px solid #1A1A1A',
  },
  cardsSectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  cardsSectionTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(28px, 4vw, 40px)',
    letterSpacing: '-0.04em',
    color: '#F8FAFC',
    marginBottom: '12px',
  },
  cardsSectionSub: {
    fontSize: '17px',
    color: '#64748B',
    fontWeight: 500,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  howWrap: {
    background: '#080808',
    padding: '100px 0',
    borderTop: '1px solid #1A1A1A',
    borderBottom: '1px solid #1A1A1A',
  },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0',
    position: 'relative',
  },
  stepWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stepContent: {
    flex: 1,
    padding: '0 40px 0 0',
  },
  stepBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: '#818CF8',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '17px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepConnector: {
    position: 'absolute',
    top: '22px',
    right: '-16px',
    width: '32px',
    borderTop: '2px dashed #1A1A1A',
    zIndex: 1,
  },
};
