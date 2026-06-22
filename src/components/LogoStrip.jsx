import { useRef, useEffect } from 'react';

const LOGOS = [
  'WhatsApp', 'Binance', 'Google Sheets', 'Instagram', 'Twitter',
  'Telegram', 'Notion', 'Gmail', 'Stripe', 'Shopify', 'Wise', 'Zapier',
  'WhatsApp', 'Binance', 'Google Sheets', 'Instagram', 'Twitter',
  'Telegram', 'Notion', 'Gmail', 'Stripe', 'Shopify', 'Wise', 'Zapier',
];

export default function LogoStrip() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={s.section}>
      <div className="container">
        <p ref={ref} className="reveal" style={s.label}>Works everywhere you do</p>
      </div>
      <div style={s.strip}>
        <div style={s.inner}>
          {LOGOS.map((name, i) => (
            <span key={i} style={s.logo}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  section: { background: 'var(--bg-card)', padding: '64px 0', borderBottom: '1px solid var(--border)', overflow: 'hidden' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 32 },
  strip: {
    overflow: 'hidden',
    maskImage: 'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
  },
  inner: {
    display: 'flex', gap: 56, alignItems: 'center',
    animation: 'logoScroll 30s linear infinite',
    width: 'max-content',
  },
  logo: { fontSize: 14, fontWeight: 700, color: '#D1D5DB', letterSpacing: '-0.2px', flexShrink: 0, userSelect: 'none' },
};
