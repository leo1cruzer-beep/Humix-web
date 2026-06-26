import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserCircle, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      to: '/' },
  { label: 'Services',  to: '/services' },
  { label: 'Community', to: '/community' },
];

const TOOLS_LINKS = [
  { label: 'Finance',        to: '/finance' },
  { label: 'Business',       to: '/business' },
  { label: 'Creative',       to: '/creative' },
  { label: 'Career',         to: '/career' },
  { label: 'Life Assistant', to: '/life-assistant' },
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
            <ToolsDropdown pathname={pathname} />
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
                borderLeft: active ? '2px solid #6366F1' : '2px solid transparent',
                paddingLeft: active ? '22px' : '24px',
              }}
            >
              {label}
            </Link>
          );
        })}
        <div style={{ padding: '6px 24px 4px', fontSize: '10px', fontWeight: 700, color: '#3A3A3A', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
          Tools
        </div>
        {TOOLS_LINKS.map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                ...s.drawerLink,
                color: active ? '#F5F5F5' : '#A0A0A0',
                fontWeight: active ? 600 : 400,
                borderLeft: active ? '2px solid #6366F1' : '2px solid transparent',
                paddingLeft: active ? '36px' : '38px',
                fontSize: '14px',
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

function ToolsDropdown({ pathname }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const isActive = TOOLS_LINKS.some(l => l.to === pathname);

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
      <button style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '14px',
        letterSpacing: '-0.01em',
        color: isActive ? '#F5F5F5' : (open ? '#F5F5F5' : '#A0A0A0'),
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        transition: 'color 0.15s ease',
      }}>
        Tools
        <ChevronDown size={12} strokeWidth={2} style={{ transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: '10px',
          background: 'rgba(17,17,17,0.96)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '6px',
          minWidth: '160px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          zIndex: 200,
        }}>
          {TOOLS_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '9px 14px',
                fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 400,
                color: pathname === to ? '#F5F5F5' : '#A0A0A0',
                textDecoration: 'none', borderRadius: '8px',
                background: pathname === to ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'background 0.12s ease, color 0.12s ease',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#F5F5F5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = pathname === to ? 'rgba(255,255,255,0.06)' : 'transparent'; e.currentTarget.style.color = pathname === to ? '#F5F5F5' : '#A0A0A0'; }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
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
