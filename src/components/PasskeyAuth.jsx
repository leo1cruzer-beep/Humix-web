import { useState, useEffect } from 'react';
import { X, Fingerprint, Lock } from 'lucide-react';
import { useIdentity } from '../hooks/useIdentity';
import { supabase } from '../lib/supabase';

const USER_ID_KEY = 'humix_user_id';
const SIZE = 240;
const RING = 7;

export default function PasskeyAuth({ onComplete, onClose }) {
  const { verify } = useIdentity();
  // mode: 'auto' = try auth first | 'register' = no passkey found, show register
  const [mode, setMode]   = useState('auto');
  // phase: loading | ready | verifying | registering | confirmed | failed | unsupported
  const [phase, setPhase] = useState('loading');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const checkSupport = async () => {
      if (!window.PublicKeyCredential) return false;
      try {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch (_) {}
      return false;
    };
    checkSupport().then(ok => setPhase(ok ? 'ready' : 'unsupported'));
  }, []);

  // Try to authenticate with the OS-managed passkey (iCloud Keychain / Google PM).
  // On success, look up the account by credential_id — works from any browser on the device.
  // On NotAllowedError (no passkey exists yet), switch to registration.
  const handleContinue = async () => {
    setPhase('verifying');
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(crypto.randomUUID()),
          rpId: 'humix.app',
          userVerification: 'preferred',
          timeout: 60000,
        },
      });

      if (!assertion) throw new Error('No assertion returned');

      // credential.id is the base64url credential ID — same string regardless of browser
      const { data, error } = await supabase
        .from('passkeys')
        .select('user_id')
        .eq('credential_id', assertion.id)
        .maybeSingle();

      if (error || !data) {
        setErrMsg('No account found for this passkey. Please register.');
        setPhase('failed');
        return;
      }

      localStorage.setItem(USER_ID_KEY, data.user_id);
      setPhase('confirmed');
      setTimeout(() => { verify(); onComplete(); }, 1300);
    } catch (e) {
      if (e?.name === 'NotAllowedError') {
        // No passkey on this device yet → show registration
        setMode('register');
        setPhase('ready');
        return;
      }
      setErrMsg(e?.message ?? 'Authentication failed');
      setPhase('failed');
    }
  };

  const handleRegister = async () => {
    setPhase('registering');
    try {
      const userId = crypto.randomUUID();

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode(crypto.randomUUID()),
          rp: { name: 'Humix', id: 'humix.app' },
          user: {
            id: new TextEncoder().encode(userId),
            name: 'humix-user',
            displayName: 'Humix User',
          },
          pubKeyCredParams: [
            { alg: -7,   type: 'public-key' },
            { alg: -257, type: 'public-key' },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
            residentKey: 'preferred',
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'none',
        },
      });

      if (!credential) throw new Error('No credential returned');

      // Store credential_id using credential.id (base64url, same value in any browser)
      const publicKey = btoa(String.fromCharCode(...new Uint8Array(credential.response.getPublicKey())));

      const { error: passkeyErr } = await supabase.from('passkeys').insert({
        credential_id: credential.id,
        public_key: publicKey,
        user_id: userId,
        sign_count: 0,
      });
      if (passkeyErr) throw new Error(passkeyErr.message);

      const profileRes = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!profileRes.ok) {
        const body = await profileRes.json().catch(() => ({}));
        throw new Error(body.error ?? 'Profile creation failed');
      }

      localStorage.setItem(USER_ID_KEY, userId);

      const pendingReferral = localStorage.getItem('humix_pending_referral');
      if (pendingReferral) {
        const { data: agentData } = await supabase
          .from('agents')
          .select('id, total_earnings')
          .eq('referral_code', pendingReferral)
          .single();
        if (agentData) {
          const { error: updateErr } = await supabase
            .from('agents')
            .update({ total_earnings: (agentData.total_earnings || 0) + 0.25 })
            .eq('id', agentData.id);
          if (!updateErr) localStorage.removeItem('humix_pending_referral');
        }
      }

      setPhase('confirmed');
      setTimeout(() => { verify(); onComplete(); }, 1300);
    } catch (e) {
      if (e?.name === 'NotAllowedError') { setPhase('ready'); return; }
      setErrMsg(e?.message ?? 'Registration failed');
      setPhase('failed');
    }
  };

  const handleGuestContinue = () => { verify(); onComplete(); };
  const doClose = () => onClose?.();

  const badgeColor =
    phase === 'confirmed' ? '#10B981' :
    phase === 'failed'    ? '#EF4444' : '#6366F1';

  const ringStyle = (() => {
    if (phase === 'confirmed') return {
      background: 'conic-gradient(from 0deg, #10B981, rgba(16,185,129,0.3) 60%, #10B981)',
      animation: 'ringFadeGreen 0.4s ease forwards',
    };
    if (phase === 'failed') return {
      background: 'conic-gradient(from 0deg, #EF4444, rgba(239,68,68,0.12) 55%, #EF4444)',
      animation: 'ringFadeGreen 0.4s ease forwards',
    };
    if (phase === 'registering' || phase === 'verifying') return {
      background: 'conic-gradient(from 0deg, #6366F1 0%, rgba(99,102,241,0.4) 30%, transparent 55%, transparent 85%, rgba(99,102,241,0.3) 100%)',
      animation: 'scanRotate 1.8s linear infinite',
    };
    return {
      background: 'conic-gradient(from 0deg, rgba(99,102,241,0.4) 0%, transparent 60%)',
      animation: 'scanRotate 3s linear infinite',
    };
  })();

  const badgeLabel =
    phase === 'loading'     ? 'Initializing Secure Identity' :
    phase === 'verifying'   ? 'Verifying Identity' :
    phase === 'registering' ? 'Biometric Registration' :
    phase === 'confirmed'   ? 'Verification Complete' :
    phase === 'failed'      ? 'Verification Failed' :
    phase === 'unsupported' ? 'Device Not Supported' :
    mode === 'register'     ? 'Biometric Registration' : 'Biometric Verification';

  const isActive = phase === 'registering' || phase === 'verifying';

  return (
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label="Passkey identity verification">
      {onClose && phase !== 'confirmed' && (
        <button style={s.closeBtn} onClick={doClose} aria-label="Cancel">
          <X size={20} color="#64748B" strokeWidth={1.5} />
        </button>
      )}

      <div style={s.inner}>
        <div style={s.badge}>
          <span style={{ ...s.dot, background: badgeColor, boxShadow: `0 0 8px ${badgeColor}` }} />
          {badgeLabel}
        </div>

        <div style={s.viewfinder}>
          <div style={{ ...s.spinRing, ...ringStyle }} />
          <div style={s.innerCircle}>
            {phase === 'confirmed' && (
              <div style={s.centerOverlay}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                  style={{ animation: 'confirmCheck 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
                  <circle cx="40" cy="40" r="40" fill="rgba(16,185,129,0.12)" />
                  <path d="M24 40l13 13 19-19" stroke="#10B981" strokeWidth="4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            {phase === 'failed' && (
              <div style={s.centerOverlay}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                  style={{ animation: 'confirmCheck 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
                  <circle cx="40" cy="40" r="40" fill="rgba(239,68,68,0.12)" />
                  <path d="M27 27l26 26M53 27L27 53" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            )}
            {phase === 'unsupported' && (
              <div style={s.centerOverlay}>
                <X size={40} color="#EF4444" strokeWidth={1.5} />
              </div>
            )}
            {(phase === 'ready' || phase === 'registering' || phase === 'verifying' || phase === 'loading') && (
              <div style={s.centerOverlay}>
                {mode === 'register' || phase === 'registering'
                  ? <Fingerprint size={56} color="rgba(99,102,241,0.7)" strokeWidth={1.2} />
                  : <Lock size={48} color="rgba(99,102,241,0.7)" strokeWidth={1.2} />
                }
              </div>
            )}
            {isActive && <div style={s.scanLine} />}
          </div>
          {isActive && (
            <>
              <Corner top={36} left={36}    borders="tl" />
              <Corner top={36} right={36}   borders="tr" />
              <Corner bottom={36} left={36}  borders="bl" />
              <Corner bottom={36} right={36} borders="br" />
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px', width: '100%', maxWidth: '320px' }}>
          {phase === 'loading' && <>
            <p style={s.title}>Initializing secure identity…</p>
            <p style={s.sub}>One moment</p>
          </>}

          {phase === 'ready' && mode === 'auto' && <>
            <p style={s.title}>Scan to Enter</p>
            <p style={s.sub}>Use Face ID to verify your identity</p>
            <button className="btn btn-primary" style={s.actionBtn} onClick={handleContinue}>
              Continue with Face ID
            </button>
            <p style={s.hint}>Works with Face ID, Touch ID, fingerprint</p>
          </>}

          {phase === 'ready' && mode === 'register' && <>
            <p style={s.title}>Create your identity</p>
            <p style={s.sub}>No account found — register your biometric to get started</p>
            <button className="btn btn-primary" style={s.actionBtn} onClick={handleRegister}>
              Register with Face ID
            </button>
            <p style={s.hintLink} onClick={() => { setMode('auto'); setPhase('ready'); }}>
              Already registered? Try again
            </p>
          </>}

          {phase === 'verifying' && <>
            <p style={s.title}>Verifying with Face ID…</p>
            <p style={s.sub}>Follow the prompt on your device</p>
          </>}

          {phase === 'registering' && <>
            <p style={s.title}>Setting up Face ID…</p>
            <p style={s.sub}>Follow the prompt on your device</p>
          </>}

          {phase === 'confirmed' && <>
            <p style={{ ...s.title, color: '#10B981' }}>Identity Confirmed ✓</p>
            <p style={s.sub}>Welcome to Humix</p>
          </>}

          {phase === 'failed' && <>
            <p style={{ ...s.title, color: '#EF4444' }}>Verification Failed</p>
            <p style={{ ...s.sub, maxWidth: '260px', margin: '0 auto' }}>{errMsg}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
              <button className="btn btn-ghost"
                style={{ padding: '10px 20px', fontSize: '13px', color: '#F8FAFC' }}
                onClick={() => { setMode('auto'); setPhase('ready'); }}>
                Try Again
              </button>
              <button className="btn btn-ghost"
                style={{ padding: '10px 20px', fontSize: '13px', color: '#6366F1', borderColor: 'rgba(99,102,241,0.3)' }}
                onClick={() => { setMode('register'); setPhase('ready'); }}>
                Register
              </button>
            </div>
          </>}

          {phase === 'unsupported' && <>
            <p style={{ ...s.title, color: '#EF4444' }}>Passkeys not supported on this device</p>
            <p style={s.sub}>Your browser doesn't support biometric login</p>
            <button style={{ ...s.actionBtn, background: 'rgba(255,255,255,0.08)', marginTop: '24px' }}
              onClick={handleGuestContinue}>
              Continue as guest
            </button>
          </>}
        </div>

        {(phase === 'loading' || isActive) && (
          <div style={s.dotsRow}>
            {[0, 1, 2].map(i => (
              <span key={i} className="typing-dot"
                style={{ animationDelay: `${i * 0.2}s`, background: '#6366F1' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Corner({ top, right, bottom, left, borders }) {
  const t = borders.includes('t'), b = borders.includes('b'),
        l = borders.includes('l'), r = borders.includes('r');
  const radius = t && l ? '4px 0 0 0' : t && r ? '0 4px 0 0' : b && l ? '0 0 0 4px' : '0 0 4px 0';
  return (
    <div style={{
      position: 'absolute', top, right, bottom, left, width: 22, height: 22,
      borderTop:    t ? '2.5px solid #6366F1' : 'none',
      borderBottom: b ? '2.5px solid #6366F1' : 'none',
      borderLeft:   l ? '2.5px solid #6366F1' : 'none',
      borderRight:  r ? '2.5px solid #6366F1' : 'none',
      borderRadius: radius,
    }} />
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: '#0A0A0A',
    zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute', top: '24px', right: '24px',
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '360px', padding: '0 24px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '99px', padding: '7px 18px', fontSize: '12px', fontWeight: 600,
    fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.02em', marginBottom: '40px',
  },
  dot: { width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', transition: 'all 0.4s ease' },
  viewfinder: { position: 'relative', width: SIZE, height: SIZE },
  spinRing: { position: 'absolute', inset: 0, borderRadius: '50%' },
  innerCircle: {
    position: 'absolute', top: RING, left: RING, right: RING, bottom: RING,
    borderRadius: '50%', background: '#0A0A0A', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  centerOverlay: {
    position: 'absolute', inset: 0, zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute', left: '16px', right: '16px', top: '50%',
    height: '2px', zIndex: 3,
    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)',
    borderRadius: '1px', boxShadow: '0 0 8px rgba(99,102,241,0.6)',
    animation: 'scanLine 2s ease-in-out infinite',
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '22px',
    letterSpacing: '-0.03em', color: '#F8FAFC', marginBottom: '8px', transition: 'color 0.4s ease',
  },
  sub: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#64748B', fontWeight: 500 },
  actionBtn: {
    marginTop: '24px', padding: '12px 28px', fontSize: '16px', fontWeight: 700,
    color: '#F8FAFC', background: '#6366F1', border: 'none', borderRadius: '10px',
    cursor: 'pointer', width: '100%',
  },
  hint: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#475569', marginTop: '12px' },
  hintLink: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6366F1',
    marginTop: '12px', cursor: 'pointer', textDecoration: 'underline',
  },
  dotsRow: { display: 'flex', gap: '6px', marginTop: '24px' },
};
