import { useRef, useEffect } from 'react';

const STATS = [
  { num: 15,  suffix: 'M+', label: 'People using Humix',  decimals: false },
  { num: 47,  suffix: '',   label: 'Countries',           decimals: false },
  { num: 12,  suffix: '',   label: 'Languages supported', decimals: false },
  { num: 4,   suffix: '',   label: 'AI service systems',  decimals: false },
];

export default function StatsBar() {
  const sectionRef = useRef(null);
  const started    = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        STATS.forEach((stat, i) => animateNum(i, stat.num, 1800 + i * 120));
        obs.unobserve(e.target);
      }
    }, { threshold: 0.35 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  function animateNum(idx, target, duration) {
    const el = document.getElementById(`sn-${idx}`);
    if (!el) return;
    let start = null;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(run);
      else el.textContent = target;
    };
    requestAnimationFrame(run);
  }

  return (
    <section ref={sectionRef} style={s.section}>
      <div className="container" style={s.inner}>
        {STATS.map((st, i) => (
          <div key={i} style={s.stat}>
            <div style={s.num}>
              <span id={`sn-${i}`}>0</span>
              <span style={s.suffix}>{st.suffix}</span>
            </div>
            <span style={s.label}>{st.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const s = {
  section: { background: 'var(--bg-card)', padding: '96px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' },
  inner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 48, textAlign: 'center',
  },
  stat: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' },
  num: {
    fontSize: 'clamp(40px, 5.5vw, 64px)',
    fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1,
    color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: 2,
    fontFamily: "'Inter', sans-serif",
  },
  suffix: { fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#2563EB' },
  label: { fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.5 },
};
