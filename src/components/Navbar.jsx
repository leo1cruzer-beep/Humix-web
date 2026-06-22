import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import AuthModal from './AuthModal';
import { useTheme } from '../hooks/useTheme.jsx';

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
  const { theme, toggle } = useTheme();

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
            <ThemeToggle theme={theme} onToggle={toggle} />
            <button className="btn btn-ghost" style={{ padding: '8px 18px' }} onClick={openLogin}>Log In</button>
            <button className="btn btn-blue" style={{ padding: '8px 18px' }} onClick={openSignup}>Get Started</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }} className="nav-hamburger-group">
            <ThemeToggle theme={theme} onToggle={toggle} />
            <button
              className="nav-hamburger"
              style={s.hamburger}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} color="var(--text-primary)" strokeWidth={1.5} />
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
            <X size={22} color="var(--text-primary)" strokeWidth={1.5} />
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
                color: active ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </Link>
          );
        })}

        <button onClick={openLogin} style={{ ...s.drawerLink, color: 'var(--text-secondary)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Log In</button>

        <div style={{ padding: '16px 24px', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
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

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1.5px solid var(--border)',
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'border-color 0.18s ease, color 0.18s ease',
        flexShrink: 0,
      }}
    >
      {theme === 'dark'
        ? <Sun size={16} strokeWidth={1.8} />
        : <Moon size={16} strokeWidth={1.8} />
      }
    </button>
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
        color: active ? 'var(--accent)' : (hov ? 'var(--text-primary)' : 'var(--text-secondary)'),
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
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
    background: 'var(--nav-bg)',
    borderBottom: '1px solid var(--nav-border)',
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
    color: 'var(--text-primary)',
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
    background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100%',
    width: '280px',
    background: 'var(--bg-card)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
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
    borderBottom: '1px solid var(--border)',
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
    borderBottom: '1px solid var(--border)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'background 0.15s ease',
  },
};
