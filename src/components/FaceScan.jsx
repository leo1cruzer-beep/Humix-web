import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useIdentity } from '../hooks/useIdentity';

export default function FaceScan({ onComplete, onClose }) {
  const { verify } = useIdentity();
  const [phase, setPhase] = useState('scanning'); // 'scanning' | 'confirmed'

  // 3-second scan → confirmed
  useEffect(() => {
    const t = setTimeout(() => setPhase('confirmed'), 3000);
    return () => clearTimeout(t);
  }, []);

  // After confirmed, verify and hand off
  useEffect(() => {
    if (phase !== 'confirmed') return;
    const t = setTimeout(() => {
      verify();
      onComplete();
    }, 900);
    return () => clearTimeout(t);
  }, [phase, verify, onComplete]);

  // Lock scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label="Face scan identity verification">
      {/* Close button */}
      {onClose && phase === 'scanning' && (
        <button style={s.closeBtn} onClick={onClose} aria-label="Cancel scan">
          <X size={20} color="#64748B" strokeWidth={1.5} />
        </button>
      )}

      <div style={s.inner}>
        {/* Eyebrow badge */}
        <div style={s.badge}>
          <span style={{ ...s.dot, background: phase === 'confirmed' ? '#10B981' : '#6366F1', boxShadow: `0 0 8px ${phase === 'confirmed' ? '#10B981' : '#6366F1'}` }} />
          {phase === 'scanning' ? 'Biometric Identity Scan' : 'Verification Complete'}
        </div>

        {/* Viewfinder */}
        <div style={s.viewfinder}>
          {phase === 'scanning' ? (
            <>
              {/* Spinning conic-gradient ring */}
              <div style={s.spinRing} />
              {/* Inner dark circle — clips scan line */}
              <div style={s.innerCircle}>
                <div style={s.scanLine} />
              </div>
              {/* Corner markers */}
              <Corner top={36} left={36}   borders="tl" />
              <Corner top={36} right={36}  borders="tr" />
              <Corner bottom={36} left={36}  borders="bl" />
              <Corner bottom={36} right={36} borders="br" />
            </>
          ) : (
            <>
              {/* Green confirmed ring */}
              <div style={s.confirmedRing} />
              <div style={s.innerCircle}>
                {/* Checkmark */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  style={{ animation: 'confirmCheck 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
                >
                  <circle cx="40" cy="40" r="40" fill="rgba(16,185,129,0.12)" />
                  <path
                    d="M24 40l13 13 19-19"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          )}
        </div>

        {/* Status text */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          {phase === 'scanning' ? (
            <>
              <p style={s.title}>Scanning your face…</p>
              <p style={s.sub}>Hold still and look straight ahead</p>
            </>
          ) : (
            <>
              <p style={{ ...s.title, color: '#10B981' }}>Identity Confirmed</p>
              <p style={s.sub}>Welcome to Humix</p>
            </>
          )}
        </div>

        {/* Progress dots */}
        {phase === 'scanning' && (
          <div style={s.dotsRow}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="typing-dot"
                style={{ animationDelay: `${i * 0.2}s`, background: '#6366F1' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Corner({ top, right, bottom, left, borders }) {
  const isTop    = borders.includes('t');
  const isBottom = borders.includes('b');
  const isLeft   = borders.includes('l');
  const isRight  = borders.includes('r');

  const radius =
    isTop && isLeft  ? '4px 0 0 0' :
    isTop && isRight ? '0 4px 0 0' :
    isBottom && isLeft  ? '0 0 0 4px' :
    '0 0 4px 0';

  return (
    <div style={{
      position: 'absolute',
      top, right, bottom, left,
      width: 22,
      height: 22,
      borderTop:    isTop    ? '2.5px solid #6366F1' : 'none',
      borderBottom: isBottom ? '2.5px solid #6366F1' : 'none',
      borderLeft:   isLeft   ? '2.5px solid #6366F1' : 'none',
      borderRight:  isRight  ? '2.5px solid #6366F1' : 'none',
      borderRadius: radius,
    }} />
  );
}

const SIZE = 240;
const RING = 7;

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#0A0A0A',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '99px',
    padding: '7px 18px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.02em',
    marginBottom: '40px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    display: 'inline-block',
    transition: 'all 0.4s ease',
  },
  viewfinder: {
    position: 'relative',
    width: SIZE,
    height: SIZE,
  },
  spinRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #6366F1 0%, rgba(99,102,241,0.4) 30%, transparent 55%, transparent 85%, rgba(99,102,241,0.3) 100%)',
    animation: 'scanRotate 1.8s linear infinite',
  },
  innerCircle: {
    position: 'absolute',
    top: RING,
    left: RING,
    right: RING,
    bottom: RING,
    borderRadius: '50%',
    background: '#0A0A0A',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #10B981, rgba(16,185,129,0.3) 60%, #10B981)',
    animation: 'ringFadeGreen 0.4s ease forwards',
  },
  scanLine: {
    position: 'absolute',
    left: '16px',
    right: '16px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)',
    borderRadius: '1px',
    boxShadow: '0 0 8px rgba(99,102,241,0.6)',
    animation: 'scanLine 2s ease-in-out infinite',
    top: '50%',
  },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: '22px',
    letterSpacing: '-0.03em',
    color: '#F8FAFC',
    marginBottom: '8px',
    transition: 'color 0.4s ease',
  },
  sub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#64748B',
    fontWeight: 500,
  },
  dotsRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '24px',
  },
};
