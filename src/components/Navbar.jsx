import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',              to: '/' },
  { label: 'Voice Loan Shield', to: '/mfi' },
  { label: 'Live Demo',         to: '/life-assistant' },
];

const CONTACT_HREF = 'mailto:saeed@havro.app?subject=MFI%20Pilot%20Inquiry';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <>
      <nav style={s.nav}>
        <div className="nav-inner" style={s.inner}>
          <Link to="/" style={s.logo}>HAVRO</Link>

          <div className="nav-center-links" style={s.centerLinks}>
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} label={label} active={pathname === to} />
            ))}
            <a href={CONTACT_HREF} style={s.contactLink}>Pilot / Contact</a>
          </div>

          <div className="nav-right-buttons" style={s.rightButtons}>
            <a href={CONTACT_HREF} style={s.ctaBtn}>Discuss a pilot</a>
          </div>

          <div style={s.hamburgerGroup} className="nav-hamburger-group">
            <button
              className="nav-hamburger"
              style={s.hamburger}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} color="#A0A0A0" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <div
        style={{
          ...s.overlay,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={() => setDrawerOpen(false)}
      />

      <div style={{
        ...s.drawer,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div style={s.drawerHeader}>
          <span style={s.logo}>HAVRO</span>
          <button onClick={() => setDrawerOpen(false)} style={s.closeBtn} aria-label="Close menu">
            <X size={20} color="#A0A0A0" strokeWidth={1.5} />
          </button>
        </div>

        {NAV_LINKS.map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                ...s.drawerLink,
                color: active ? '#F5F5F5' : '#A0A0A0',
                fontWeight: active ? 600 : 400,
                borderLeft: active ? '2px solid #00C48C' : '2px solid transparent',
                paddingLeft: active ? '22px' : '24px',
              }}
            >
              {label}
            </Link>
          );
        })}
        <a href={CONTACT_HREF} style={{ ...s.drawerLink, color: '#A0A0A0', borderLeft: '2px solid transparent', paddingLeft: '24px' }}>
          Pilot / Contact
        </a>

        <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href={CONTACT_HREF} style={{ ...s.ctaBtn, width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '15px', display: 'flex', textDecoration: 'none' }}>
            Discuss a pilot
          </a>
        </div>
      </div>
    </>
  );
}

function NavLink({ to, label, active }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: '14px',
        textDecoration: 'none',
        color: active ? '#F5F5F5' : (hov ? '#F5F5F5' : '#A0A0A0'),
        transition: 'color 0.15s ease',
        display: 'inline-block',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {label}
    </Link>
  );
}

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(12,12,13,0.8)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    height: '56px', display: 'flex', alignItems: 'center',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 48px',
    width: '100%', display: 'flex', alignItems: 'center', gap: '32px',
  },
  logo: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    letterSpacing: '0.04em', color: '#F5F5F5', textDecoration: 'none', flexShrink: 0,
  },
  centerLinks: { display: 'flex', alignItems: 'center', gap: '28px', flex: 1, justifyContent: 'center' },
  contactLink: {
    fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '14px',
    letterSpacing: '-0.01em', color: '#A0A0A0', textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  rightButtons: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '0 16px', height: '32px',
    background: '#00C48C', color: '#000', border: 'none', borderRadius: '6px',
    fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    letterSpacing: '0.01em', textDecoration: 'none',
  },
  hamburgerGroup: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 },
  drawer: {
    position: 'fixed', top: 0, right: 0, height: '100%', width: '280px',
    background: '#0C0C0D', border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 0 80px rgba(0,0,0,0.8)', zIndex: 201,
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.25s ease', overflowY: 'auto',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: '56px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
  },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' },
  drawerLink: {
    display: 'flex', alignItems: 'center', height: '48px',
    borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Inter', sans-serif",
    fontSize: '15px', textDecoration: 'none', transition: 'color 0.15s ease',
  },
};
