import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Explore',   to: '/explore' },
  { label: 'Services',  to: '/services' },
  { label: 'Pricing',   to: '/pricing' },
  { label: 'Community', to: '/community' },
  { label: 'Career',    to: '/career' },
];

const CATEGORY_LINKS = [
  'Automate', 'Finance', 'Companion', 'Life Assistant',
  'Community', 'Career', 'Business', 'Creative',
];

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        {/* Top row */}
        <div style={s.topRow}>
          <Link to="/" style={s.logo}>Humix</Link>
          <div style={s.topLinks}>
            {NAV_LINKS.map(({ label, to }) => (
              <FooterLink key={to} to={to}>{label}</FooterLink>
            ))}
          </div>
        </div>

        {/* Middle row */}
        <div style={s.midRow}>
          {CATEGORY_LINKS.map((cat, i) => (
            <span key={cat}>
              <FooterLink to={`/explore?category=${cat.toLowerCase().replace(' ', '-')}`}>
                {cat}
              </FooterLink>
              {i < CATEGORY_LINKS.length - 1 && (
                <span style={{ color: '#3A3A3A', margin: '0 4px' }}>|</span>
              )}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div style={s.borderTop} />
        <div style={s.bottomRow}>
          <span style={s.copy}>© 2026 Humix. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FooterLink to="/">Privacy Policy</FooterLink>
            <span style={{ color: '#3A3A3A' }}>·</span>
            <FooterLink to="/">Terms</FooterLink>
            <span style={{ color: '#3A3A3A' }}>·</span>
            <FooterLink to="/">Contact</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{ color: '#737373', fontSize: '13px', textDecoration: 'none', transition: 'color 0.18s ease' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#737373'; }}
    >
      {children}
    </Link>
  );
}

const s = {
  footer: {
    background: '#1A1A1A',
    borderTop: '1px solid #2A2A2A',
    paddingTop: '48px',
    paddingBottom: '40px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '32px',
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '-0.03em',
    color: '#FFFFFF',
    textDecoration: 'none',
  },
  topLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  midRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '32px',
    fontSize: '13px',
    alignItems: 'center',
  },
  borderTop: {
    borderTop: '1px solid #2A2A2A',
    marginBottom: '24px',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copy: {
    color: '#737373',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
};
