import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const NAV_LINKS = [
  { label: 'Explore',        to: '/explore' },
  { label: 'Services',       to: '/services' },
  { label: 'Life Assistant', to: '/life-assistant' },
  { label: 'Pricing',        to: '/pricing' },
  { label: 'Community',      to: '/community' },
  { label: 'Career',         to: '/career' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });
  const { pathname } = useLocation();

  const openLogin = () => { setDrawerOpen(false); setAuthModal({ open: true, tab: 'login' }); };
  const openSignup = () => { setDrawerOpen(false); setAuthModal({ open: true, tab: 'signup' }); };
  const closeAuth = () => setAuthModal((prev) => ({ ...prev, open: false }));

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
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to;
              return (
                <NavLink key={to} to={to} label={label} active={active} />
              );
            })}
          </div>

          <div className="nav-right-buttons" style={s.rightButtons}>
            <button className="btn btn-ghost" style={{ padding: '8px 18px' }} onClick={openLogin}>Log In</button>
            <button className="btn btn-blue" style={{ padding: '8px 18px' }} onClick={openSignup}>Get Started</button>
          </div>

          <button
            className="nav-hamburger"
            style={s.hamburger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} color="#1A1A1A" strokeWidth={1.5} />
          </button>
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
            <X size={22} color="#1A1A1A" strokeWidth={1.5} />
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
                color: active ? '#1B4FD8' : '#1A1A1A',
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </Link>
          );
        })}

        <button onClick={openLogin} style={{ ...s.drawerLink, color: '#737373', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Log In</button>

        <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid #E8E8E4' }}>
          <button
            className="btn btn-blue"
            style={{ width: '100%', justifyContent: 'center', padding: '13px 16px', fontSize: '15px' }}
            onClick={openSignup}
          >
            Get Started
          </button>
        </div>
      </div>

      <AuthModal isOpen={authModal.open} onClose={closeAuth} defaultTab={authModal.tab} />
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
        fontWeight: 500,
        fontSize: '15px',
        textDecoration: 'none',
        color: active ? '#1B4FD8' : (hov ? '#1A1A1A' : '#737373'),
        borderBottom: active ? '2px solid #1B4FD8' : '2px solid transparent',
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
    background: '#F7F7F5',
    borderBottom: '1px solid #E8E8E4',
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
    gap: '24px',
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '-0.03em',
    color: '#1A1A1A',
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
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 200,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '280px',
    background: '#FFFFFF',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
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
    borderBottom: '1px solid #E8E8E4',
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
    borderBottom: '1px solid #E8E8E4',
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'background 0.15s ease',
  },
};
