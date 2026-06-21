import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { slug: 'automate',       name: 'Automate',        sub: 'Connect your workflow to AI',       Icon: IconBolt },
  { slug: 'finance',        name: 'Finance',          sub: 'From debt to wealth',               Icon: IconChart },
  { slug: 'companion',      name: 'Companion',        sub: 'AI that never forgets',             Icon: IconChat },
  { slug: 'life-assistant', name: 'Life Assistant',   sub: 'Health, legal, farming, education', Icon: IconHeart },
  { slug: 'community',      name: 'Community',        sub: 'Connect with people like you',      Icon: IconPeople },
  { slug: 'career',         name: 'Career',           sub: 'Find work or hire globally',        Icon: IconBriefcase },
  { slug: 'business',       name: 'Business',         sub: 'Tools for entrepreneurs',           Icon: IconRocket },
  { slug: 'creative',       name: 'Creative',         sub: 'Design, write, and create',         Icon: IconPen },
];

export default function ServicesGrid() {
  const navigate  = useNavigate();
  const headRef   = useRef(null);
  const cardRefs  = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    [headRef.current, ...cardRefs.current].filter(Boolean).forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={s.section}>
      <div className="container">
        <div ref={headRef} className="reveal" style={s.header}>
          <h2 style={s.title}>Explore Humix</h2>
          <p style={s.subtitle}>
            Eight AI service areas built for real-world outcomes. Start anywhere — they all work together.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.slug}
              svc={svc}
              cardRef={el => (cardRefs.current[i] = el)}
              delay={i * 50}
              onClick={() => navigate(`/service/${svc.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc, cardRef, delay, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      ref={cardRef}
      className="reveal"
      style={{
        ...s.card,
        transitionDelay: `${delay}ms`,
        transform:   hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:   hov
          ? '0 10px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        borderColor: hov ? '#C4C4CF' : '#E4E4E7',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.iconWrap}>
        <svc.Icon />
      </div>
      <h3 style={s.cardTitle}>{svc.name}</h3>
      <p style={s.cardSub}>{svc.sub}</p>
    </button>
  );
}

/* ── Icons — simple 20×20 line icons ─────────────────────────── */
const ip = {
  width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none',
  stroke: '#374151', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round',
};

function IconBolt()      { return <svg {...ip}><path d="M12 2L4 11h5l-1 7 8-9h-5l1-7z"/></svg>; }
function IconChart()     { return <svg {...ip}><polyline points="2,15 7,9 11,12 17,5"/><polyline points="13,5 17,5 17,9"/></svg>; }
function IconChat()      { return <svg {...ip}><path d="M18 9.5c0 3.6-3.6 6.5-8 6.5a9 9 0 01-2.1-.2L4 17.5l.6-3.2C3 13 2 11.3 2 9.5 2 5.9 5.6 3 10 3s8 2.9 8 6.5z"/></svg>; }
function IconHeart()     { return <svg {...ip}><path d="M10 17S2 12 2 6.5C2 4.6 3.6 3 5.5 3c1 0 1.9.5 2.5 1.2C8.6 3.5 9.5 3 10.5 3 12.4 3 14 4.6 14 6.5 14 12 10 17 10 17z"/></svg>; }
function IconPeople()    { return <svg {...ip}><circle cx="7.5" cy="6" r="3"/><path d="M1 18v-1a6.5 6.5 0 0113 0v1"/><path d="M14 5.5a3 3 0 010 5"/><path d="M18 18v-1a5 5 0 00-3.5-4.8"/></svg>; }
function IconBriefcase() { return <svg {...ip}><rect x="2" y="7" width="16" height="11" rx="2"/><path d="M7 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><line x1="2" y1="12" x2="18" y2="12"/></svg>; }
function IconRocket()    { return <svg {...ip}><path d="M10 2s5 4.5 5 9-5 9-5 9"/><path d="M10 2S5 6.5 5 11s5 9 5 9"/><circle cx="10" cy="11" r="2.2"/></svg>; }
function IconPen()       { return <svg {...ip}><path d="M14.5 2.5l3 3-10 10H4v-3.5l10.5-9.5z"/><line x1="12" y1="5" x2="15" y2="8"/></svg>; }

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  section: {
    padding: '96px 0 88px',
    background: '#FAFAFA',
    borderTop: '1px solid #F4F4F5',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 'clamp(26px, 3.2vw, 38px)',
    fontWeight: 700,
    color: '#0A0A0A',
    letterSpacing: '-1.1px',
    lineHeight: 1.1,
    marginBottom: 10,
    fontFamily: 'Inter, sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    lineHeight: 1.55,
    maxWidth: 440,
  },
  card: {
    display: 'block',
    textAlign: 'left',
    width: '100%',
    background: '#ffffff',
    border: '1px solid #E4E4E7',
    borderRadius: 12,
    padding: '24px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition:
      'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: '#F4F4F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0A0A0A',
    marginBottom: 5,
    letterSpacing: '-0.2px',
  },
  cardSub: {
    fontSize: 13,
    color: '#71717A',
    lineHeight: 1.5,
  },
};
