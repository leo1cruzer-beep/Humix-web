import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, TrendingUp, MessageCircle, Heart,
  Users, Briefcase, Gem, Pencil,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'automate',       label: 'Automate',        desc: 'Connect your workflow to AI',         Icon: Zap },
  { id: 'finance',        label: 'Finance',          desc: 'From debt to wealth',                 Icon: TrendingUp },
  { id: 'companion',      label: 'Companion',        desc: 'AI that never forgets',               Icon: MessageCircle },
  { id: 'life-assistant', label: 'Life Assistant',   desc: 'Health, legal, farming, education',   Icon: Heart },
  { id: 'community',      label: 'Community',        desc: 'Connect with people like you',        Icon: Users },
  { id: 'career',         label: 'Career',           desc: 'Find work or hire globally',          Icon: Briefcase },
  { id: 'business',       label: 'Business',         desc: 'Tools for entrepreneurs',             Icon: Gem },
  { id: 'creative',       label: 'Creative',         desc: 'Design, write, and create',           Icon: Pencil },
];

const STATS = [
  { value: '10K+',  label: 'Users' },
  { value: '8',     label: 'Categories' },
  { value: '20',    label: 'Countries' },
  { value: '98%',   label: 'Satisfaction' },
];

const STEPS = [
  {
    n: '1',
    title: 'Choose a category',
    desc: 'Browse 8 service areas built for every real-world need — from finance to farming to creative work.',
  },
  {
    n: '2',
    title: 'Get AI-powered help',
    desc: 'Use 50+ intelligent tools that work in plain language — no setup, no learning curve.',
  },
  {
    n: '3',
    title: 'Take action',
    desc: 'Implement plans, hire experts, or join your community. Humix turns insight into results.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="page-enter">
      <HeroSection navigate={navigate} />
      <CategoriesSection navigate={navigate} />
      <SocialProofStrip />
      <HowItWorksSection />
    </main>
  );
}

function HeroSection({ navigate }) {
  return (
    <section style={s.heroWrap}>
      {/* Dot grid background */}
      <div className="dot-grid-bg" style={s.dotGrid} />

      <div style={s.heroInner}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <span className="badge badge-blue label-tag">AI-Powered Platform</span>
        </div>

        <h1 style={s.headline}>
          Everything you need.<br />One platform.
        </h1>

        <p style={s.subheadline}>
          From freelancing to farming, finance to creativity — Humix is built for real people.
        </p>

        <div style={s.ctaRow}>
          <button
            className="btn btn-blue"
            style={{ padding: '12px 28px', fontSize: '15px' }}
            onClick={() => navigate('/explore')}
          >
            Get Started
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '12px 28px', fontSize: '15px' }}
            onClick={() => navigate('/explore')}
          >
            Explore Tools
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#A3A3A3', marginTop: '16px' }}>
          Trusted by 10,000+ users across 20 countries
        </p>
      </div>
    </section>
  );
}

function CategoriesSection({ navigate }) {
  return (
    <section style={s.section}>
      <div className="container" style={s.container}>
        <h2 className="section-heading" style={{ marginBottom: '32px', textAlign: 'center' }}>
          What do you need today?
        </h2>
        <div className="cat-grid" style={s.catGrid}>
          {CATEGORIES.map(({ id, label, desc, Icon }) => (
            <CategoryCard
              key={id}
              id={id}
              label={label}
              desc={desc}
              Icon={Icon}
              onClick={() => {
              if (id === 'life-assistant') return navigate('/life-assistant')
              if (id === 'finance') return navigate('/finance')
              navigate(`/explore?category=${id}`)
            }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ label, desc, Icon, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...s.catCard,
        borderColor: hov ? '#1B4FD8' : '#E8E8E4',
        boxShadow: hov ? '0 4px 16px rgba(27,79,216,0.10)' : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.iconBox}>
        <Icon size={22} color="#374151" strokeWidth={1.5} />
      </div>
      <h3 className="card-title" style={{ marginTop: '16px', marginBottom: '6px' }}>{label}</h3>
      <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.5 }}>{desc}</p>
    </button>
  );
}

function SocialProofStrip() {
  return (
    <section style={s.stripWrap}>
      <div style={s.stripInner}>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#737373', marginBottom: '24px' }}>
          Powered by AI. Built for humans.
        </p>
        <div style={s.statsRow}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={s.statItem}>
              <span style={s.statValue}>{value}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section style={{ ...s.section, background: 'var(--bg-page)' }}>
      <div className="container" style={s.container}>
        <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: '48px' }}>
          How it works
        </h2>
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
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1A1A1A', margin: '16px 0 8px' }}>
          {step.title}
        </h3>
        <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.65 }}>{step.desc}</p>
      </div>
      {!isLast && <div style={s.stepConnector} />}
    </div>
  );
}

const s = {
  heroWrap: {
    position: 'relative',
    paddingTop: '96px',
    paddingBottom: '96px',
    textAlign: 'center',
    overflow: 'hidden',
    background: 'var(--bg-page)',
  },
  dotGrid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.4,
    zIndex: 0,
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '680px',
    margin: '0 auto',
    padding: '0 24px',
  },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(36px, 5vw, 56px)',
    letterSpacing: '-0.04em',
    color: 'var(--text-primary)',
    lineHeight: 1.1,
    marginBottom: '20px',
  },
  subheadline: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: '520px',
    margin: '0 auto 32px',
  },
  ctaRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  section: {
    padding: '80px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  catCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    width: '100%',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'var(--icon-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stripWrap: {
    background: 'var(--bg-card)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '48px 24px',
    textAlign: 'center',
  },
  stripInner: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '28px',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
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
    padding: '0 32px 0 0',
  },
  stepBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--accent-light)',
    color: 'var(--accent)',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepConnector: {
    position: 'absolute',
    top: '20px',
    right: '-16px',
    width: '32px',
    borderTop: '2px dashed #E8E8E4',
    zIndex: 1,
  },
};
