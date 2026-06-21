import { useRef, useEffect } from 'react';

const TESTIMONIALS = [
  {
    initials: 'FA', name: 'Fatima Al-Rashid',
    title: 'Teacher', location: 'Doha, Qatar',
    quote: 'The Finance section gave me a plan that actually fit my salary. I paid off QAR 80,000 in debt in 14 months. I had tried apps before but nothing made it feel this possible.',
    service: 'Finance', color: '#059669',
  },
  {
    initials: 'JM', name: 'Joseph Mwangi',
    title: 'Farmer', location: 'Nakuru, Kenya',
    quote: 'My maize crop had a disease I had never seen. I described it to the Life Assistant and within minutes I had the name, the treatment, and where to buy it. Saved my harvest.',
    service: 'Life Assistant', color: '#EA580C',
  },
  {
    initials: 'NK', name: 'Nadia Khurshid',
    title: 'Freelancer', location: 'Karachi, Pakistan',
    quote: 'Companion holds me accountable in a way no person has. It remembered I said I wanted to feel proud of myself on day 1. On day 34, when I almost quit, it quoted me back to myself.',
    service: 'Companion', color: '#7C3AED',
  },
];

export default function Testimonials() {
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    refs.current.filter(Boolean).forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={s.section}>
      <div className="container">
        <div ref={el => refs.current[0] = el} className="reveal" style={s.header}>
          <h2 style={s.title}>Real people. Real results.</h2>
          <p style={s.sub}>From 47 countries, in their own words.</p>
        </div>
        <div style={s.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={el => refs.current[i + 1] = el}
              className="reveal"
              style={{ ...s.card, transitionDelay: `${i * 80}ms` }}
            >
              <div style={s.stars}>{'★★★★★'}</div>
              <p style={s.quote}>"{t.quote}"</p>
              <div style={s.author}>
                <div style={{ ...s.avatar, background: t.color + '14', color: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div style={s.name}>{t.name}</div>
                  <div style={s.meta}>{t.title} · {t.location}</div>
                </div>
                <span style={{ ...s.serviceTag, color: t.color, background: t.color + '12', border: `1px solid ${t.color}25`, marginLeft: 'auto' }}>
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  section: { padding: '96px 0', background: '#FAFAFA', borderBottom: '1px solid #F4F4F5' },
  header: { marginBottom: 48 },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700,
    letterSpacing: '-1.2px', lineHeight: 1.1, color: '#0A0A0A', marginBottom: 10,
  },
  sub: { fontSize: 16, color: '#71717A', fontWeight: 400 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: {
    background: '#fff', border: '1px solid #E4E4E7', borderRadius: 14,
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 16,
    transition: 'transform 0.22s var(--ease), box-shadow 0.22s var(--ease)',
  },
  stars: { fontSize: 14, color: '#FBBF24', letterSpacing: 2 },
  quote: { fontSize: 15, color: '#374151', lineHeight: 1.7, fontStyle: 'italic', flex: 1 },
  author: { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid #F4F4F5', flexWrap: 'wrap' },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  name: { fontSize: 14, fontWeight: 600, color: '#0A0A0A' },
  meta: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  serviceTag: { fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, letterSpacing: '0.02em', flexShrink: 0 },
};
