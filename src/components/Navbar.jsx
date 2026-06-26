import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserCircle } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',           to: '/' },
  { label: 'Services',       to: '/services' },
  { label: 'Life Assistant', to: '/life-assistant' },
  { label: 'Community',      to: '/community' },
  { label: 'Career',         to: '/career' },
];

export default function Navbar({ onScanToEnter, isVerified }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  const handleCTA = () => { setDrawerOpen(false); onScanToEnter?.(); };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <>
      <nav style={s.nav}>
        <div className="nav-inner" style={s.inner}>
          <Link to="/" style={s.logo}>HUMIX</Link>

          <div className="nav-center-links" style={s.centerLinks}>
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} label={label} active={pathname === to} />
            ))}
          </div>

          <div className="nav-right-buttons" style={s.rightButtons}>
            {isVerified ? (
              <Link to="/profile" style={s.verifiedLink}>
                <span style={s.verifiedDot} />
                Verified
                <UserCircle size={15} color="#00C48C" strokeWidth={1.8} />
              </Link>
            ) : (
              <button
                style={s.ctaBtn}
                onClick={handleCTA}
              >
                Get Started
              </button>
            )}
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
          <span style={s.logo}>HUMIX</span>
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

        <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {isVerified ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', fontSize: '14px', color: '#00C48C', fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C48C', display: 'inline-block' }} />
              Identity Verified
              <UserCircle size={15} color="#00C48C" strokeWidth={1.8} />
            </Link>
          ) : (
            <button
              style={{ ...s.ctaBtn, width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '15px' }}
              onClick={handleCTA}
            >
              Get Started Free
            </button>
          )}
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
  rightButtons: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '0 16px', height: '32px',
    background: '#00C48C', color: '#000', border: 'none', borderRadius: '6px',
    fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    letterSpacing: '0.01em',
  },
  verifiedLink: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', color: '#00C48C', fontWeight: 600,
    fontFamily: "'Inter', sans-serif", textDecoration: 'none',
  },
  verifiedDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#00C48C', display: 'inline-block',
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
    display: 'flex', alignItems: 'center', height: '48px', padding: '0 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Inter', sans-serif",
    fontSize: '15px', textDecoration: 'none', transition: 'color 0.15s ease',
  },
};
