import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ScanFace, UserCircle } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Explore',        to: '/explore' },
  { label: 'Services',       to: '/services' },
  { label: 'Life Assistant', to: '/life-assistant' },
  { label: 'Pricing',        to: '/pricing' },
  { label: 'Community',      to: '/community' },
  { label: 'Career',         to: '/career' },
];

export default function Navbar({ onScanToEnter, isVerified }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  const handleScan = () => { setDrawerOpen(false); onScanToEnter?.(); };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <>
      <nav style={s.nav}>
        <div className="nav-inner" style={s.inner}>
          <Link to="/" style={s.logo}>Humix</Link>

          <div className="nav-center-links" style={s.centerLinks}>
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} label={label} active={pathname === to} />
            ))}
          </div>

          <div className="nav-right-buttons" style={s.rightButtons}>
            {isVerified ? (
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10B981', fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', display: 'inline-block' }} />
                Verified
                <UserCircle size={16} color="#10B981" strokeWidth={1.8} />
              </Link>
            ) : (
              <button
                className="btn btn-blue"
                style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={handleScan}
              >
                <ScanFace size={16} strokeWidth={2} />
                Scan to Enter
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }} className="nav-hamburger-group">
            <button
              className="nav-hamburger"
              style={s.hamburger}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} color="#94A3B8" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        style={{
          ...s.overlay,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div style={{
        ...s.drawer,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div style={s.drawerHeader}>
          <span style={s.logo}>Humix</span>
          <button onClick={() => setDrawerOpen(false)} style={s.closeBtn} aria-label="Close menu">
            <X size={22} color="#94A3B8" strokeWidth={1.5} />
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
                color: active ? '#818CF8' : '#94A3B8',
                fontWeight: active ? 700 : 500,
              }}
            >
              {label}
            </Link>
          );
        })}

        <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid #1A1A1A' }}>
          {isVerified ? (
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 16px', fontSize: '14px', color: '#10B981', fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', display: 'inline-block' }} />
              Identity Verified
              <UserCircle size={16} color="#10B981" strokeWidth={1.8} />
            </Link>
          ) : (
            <button
              className="btn btn-blue"
              style={{ width: '100%', justifyContent: 'center', padding: '13px 16px', fontSize: '15px', gap: '8px' }}
              onClick={handleScan}
            >
              <ScanFace size={17} strokeWidth={2} />
              Scan to Enter
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
        fontWeight: 600,
        fontSize: '14px',
        textDecoration: 'none',
        color: active ? '#818CF8' : (hov ? '#F8FAFC' : '#64748B'),
        borderBottom: active ? '2px solid #6366F1' : '2px solid transparent',
        paddingBottom: '2px',
        transition: 'all 0.18s ease',
        display: 'inline-block',
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
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 900,
    fontSize: '20px',
    letterSpacing: '-0.04em',
    color: '#6366F1',
    textDecoration: 'none',
    flexShrink: 0,
  },
  centerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flex: 1,
    justifyContent: 'center',
  },
  rightButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 200,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '280px',
    background: '#0A0A0A',
    border: '1px solid #1A1A1A',
    boxShadow: '0 0 80px rgba(0,0,0,0.9)',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease',
    overflowY: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    borderBottom: '1px solid #1A1A1A',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  drawerLink: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    padding: '0 24px',
    borderBottom: '1px solid #1A1A1A',
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
};
