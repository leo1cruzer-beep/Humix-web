import { useState, useEffect } from 'react';
import { X, Fingerprint, Lock } from 'lucide-react';
import { useIdentity } from '../hooks/useIdentity';
import { supabase } from '../lib/supabase';

const USER_ID_KEY = 'humix_user_id';
const SIZE = 240;
const RING = 7;

function toBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export default function PasskeyAuth({ onComplete, onClose }) {
  const { verify } = useIdentity();
  const [phase, setPhase] = useState('loading');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Phone + OTP state (registration only)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Determine flow on mount
  useEffect(() => {
    const checkSupport = async () => {
      if (!window.PublicKeyCredential) return false;
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) return true;
      } catch (_) {}
      try {
        if (PublicKeyCredential.isConditionalMediationAvailable) {
          const conditional = await PublicKeyCredential.isConditionalMediationAvailable();
          if (conditional) return true;
        }
      } catch (_) {}
      return window.PublicKeyCredential !== undefined;
    };

    checkSupport().then(supported => {
      if (!supported) { setPhase('unsupported'); return; }
      const storedId = localStorage.getItem(USER_ID_KEY);
      setIsRegistering(!storedId);
      setPhase('ready');
    });
  }, []);

  // Step 1: biometric — creates passkey, then moves to phone input
  const handleRegister = async () => {
    setPhase('registering');
    try {
      // Self-generated UUID — never exists in auth.users. profiles.id must NOT
      // have a FK constraint to auth.users.id or the profile insert will fail.
      const userId = crypto.randomUUID();
      console.log('[PasskeyAuth] self-generated userId (not from auth.users):', userId);
      const userIdBytes = new TextEncoder().encode(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode(crypto.randomUUID()),
          rp: { name: 'Humix', id: 'humix.app' },
          user: { id: userIdBytes, name: 'humix-user', displayName: 'Humix User' },
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

      const credentialId = toBase64(credential.rawId);
      const publicKey    = toBase64(credential.response.getPublicKey());

      const { error } = await supabase.from('passkeys').insert({
        credential_id: credentialId,
        public_key: publicKey,
        user_id: userId,
        sign_count: 0,
      });

      if (error) throw new Error(error.message);

      setPendingUserId(userId);
      setPhase('phone-input');
    } catch (e) {
      if (e?.name === 'NotAllowedError') { setPhase('ready'); return; }
      setErrMsg(e?.message ?? 'Registration failed');
      setPhase('failed');
    }
  };

  // Step 2: send OTP to phone
  const handleSendOtp = async () => {
    setOtpError('');
    const phone = phoneNumber.trim();
    if (!phone) { setOtpError('Please enter your phone number'); return; }
    if (!phone.startsWith('+')) {
      setOtpError('Include your country code (e.g. +1 for US, +44 for UK)');
      return;
    }

    // Check phone uniqueness before sending OTP
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();
    if (existing) {
      setOtpError('An account with this phone number already exists.');
      return;
    }

    setPhase('sending-otp');
    try {
      const r = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to send code');
      }
      setPhase('otp-input');
    } catch (e) {
      setOtpError(e.message);
      setPhase('phone-input');
    }
  };

  // Step 3: verify OTP, then finalize account creation
  const handleVerifyOtp = async () => {
    setOtpError('');
    const phone = phoneNumber.trim();
    const code = otpCode.trim();
    if (!code) { setOtpError('Please enter the code'); return; }

    setPhase('verifying-otp');
    try {
      const r = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error ?? 'Invalid or expired code');
      }

      // OTP verified — create profile with phone
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('[PasskeyAuth] supabase.auth.getUser() at registration:', authUser);
      console.log('[PasskeyAuth] sending userId to create-profile:', pendingUserId);

      const profileRes = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pendingUserId, phone }),
      });
      if (!profileRes.ok) {
        const body = await profileRes.json().catch(() => ({}));
        throw new Error(body.error ?? 'Profile creation failed');
      }

      localStorage.setItem(USER_ID_KEY, pendingUserId);

      // Handle referral earnings
      const pendingReferral = localStorage.getItem('humix_pending_referral');
      console.log('[PasskeyAuth] pending referral code from localStorage:', pendingReferral);
      if (pendingReferral) {
        const { data: agentData, error: agentLookupErr } = await supabase
          .from('agents')
          .select('id, total_earnings, referral_code, phone')
          .eq('referral_code', pendingReferral)
          .single();
        console.log('[PasskeyAuth] agent lookup result:', agentData, agentLookupErr);
        if (agentData) {
          const isSamePhone = agentData.phone === phone;
          console.log('[PasskeyAuth] agent phone match (self-referral check):', isSamePhone);
          if (!isSamePhone) {
            const newEarnings = (agentData.total_earnings || 0) + 0.25;
            const { error: updateErr } = await supabase
              .from('agents')
              .update({ total_earnings: newEarnings })
              .eq('id', agentData.id);
            console.log('[PasskeyAuth] earnings update result — newEarnings:', newEarnings, 'error:', updateErr);
            if (!updateErr) localStorage.removeItem('humix_pending_referral');
          } else {
            console.log('[PasskeyAuth] skipping referral credit — same phone as agent');
            localStorage.removeItem('humix_pending_referral');
          }
        }
      }

      setPhase('confirmed');
      setTimeout(() => { verify(); onComplete(); }, 1300);
    } catch (e) {
      setOtpError(e.message);
      setPhase('otp-input');
    }
  };

  const handleAuthenticate = async () => {
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

      setPhase('confirmed');
      setTimeout(() => { verify(); onComplete(); }, 1300);
    } catch (e) {
      if (e?.name === 'NotAllowedError') { setPhase('ready'); return; }
      setErrMsg(e?.message ?? 'Authentication failed');
      setPhase('failed');
    }
  };

  const handleSwitchToRegister = () => {
    localStorage.removeItem(USER_ID_KEY);
    setIsRegistering(true);
    setPhase('ready');
  };

  const handleGuestContinue = () => {
    verify();
    onComplete();
  };

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

  const BADGE_LABELS = {
    loading:        'Initializing Secure Identity',
    ready:          isRegistering ? 'Biometric Registration' : 'Biometric Verification',
    registering:    'Setting Up Face ID',
    verifying:      'Verifying Identity',
    'phone-input':  'Phone Verification',
    'sending-otp':  'Sending Code',
    'otp-input':    'Enter Code',
    'verifying-otp':'Verifying Code',
    confirmed:      'Verification Complete',
    failed:         'Verification Failed',
    unsupported:    'Device Not Supported',
  };

  const isActive = phase === 'registering' || phase === 'verifying';
  const isPhonePhase = phase === 'phone-input' || phase === 'sending-otp' || phase === 'otp-input' || phase === 'verifying-otp';

  return (
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label="Passkey identity verification">
      {onClose && phase !== 'confirmed' && (
        <button style={s.closeBtn} onClick={doClose} aria-label="Cancel">
          <X size={20} color="#64748B" strokeWidth={1.5} />
        </button>
      )}

      <div style={s.inner}>
        {/* Status badge */}
        <div style={s.badge}>
          <span style={{ ...s.dot, background: badgeColor, boxShadow: `0 0 8px ${badgeColor}` }} />
          {BADGE_LABELS[phase] ?? BADGE_LABELS.loading}
        </div>

        {/* Viewfinder — hidden during phone/OTP phases */}
        {!isPhonePhase && (
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
                  {isRegistering || phase === 'registering'
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
        )}

        {/* Text + actions */}
        <div style={{ textAlign: 'center', marginTop: isPhonePhase ? 0 : '28px', width: '100%', maxWidth: '320px' }}>
          {phase === 'loading' && <>
            <p style={s.title}>Initializing secure identity…</p>
            <p style={s.sub}>One moment</p>
          </>}

          {phase === 'ready' && isRegistering && <>
            <p style={s.title}>Set up your biometric identity</p>
            <p style={s.sub}>Your face never leaves this device</p>
            <button className="btn btn-primary" style={s.actionBtn} onClick={handleRegister}>
              Register with Face ID
            </button>
            <p style={s.hint}>Works with Face ID, Touch ID, fingerprint</p>
          </>}

          {phase === 'ready' && !isRegistering && <>
            <p style={s.title}>Verify your identity</p>
            <p style={s.sub}>Use Face ID to continue</p>
            <button className="btn btn-primary" style={s.actionBtn} onClick={handleAuthenticate}>
              Authenticate
            </button>
            <p style={s.hintLink} onClick={handleSwitchToRegister}>
              Different device? Register here
            </p>
          </>}

          {phase === 'registering' && <>
            <p style={s.title}>Setting up Face ID…</p>
            <p style={s.sub}>Follow the prompt on your device</p>
          </>}

          {phase === 'verifying' && <>
            <p style={s.title}>Verifying with Face ID…</p>
            <p style={s.sub}>Follow the prompt on your device</p>
          </>}

          {/* Phone number input */}
          {(phase === 'phone-input' || phase === 'sending-otp') && <>
            <p style={s.title}>Verify your phone</p>
            <p style={s.sub}>We'll send a one-time code to confirm your number</p>
            <input
              style={s.textInput}
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={e => { setPhoneNumber(e.target.value); setOtpError(''); }}
              disabled={phase === 'sending-otp'}
              autoFocus
            />
            {otpError && <p style={s.inlineError}>{otpError}</p>}
            <button
              className="btn btn-primary"
              style={{ ...s.actionBtn, opacity: phase === 'sending-otp' ? 0.6 : 1 }}
              onClick={handleSendOtp}
              disabled={phase === 'sending-otp'}
            >
              {phase === 'sending-otp' ? 'Sending…' : 'Send Code →'}
            </button>
            <p style={s.hint}>Use E.164 format: +44 7911 123456</p>
          </>}

          {/* OTP code input */}
          {(phase === 'otp-input' || phase === 'verifying-otp') && <>
            <p style={s.title}>Enter the code</p>
            <p style={s.sub}>Sent to {phoneNumber}</p>
            <input
              style={{ ...s.textInput, letterSpacing: '0.25em', fontSize: '22px', textAlign: 'center' }}
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otpCode}
              onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
              disabled={phase === 'verifying-otp'}
              autoFocus
            />
            {otpError && <p style={s.inlineError}>{otpError}</p>}
            <button
              className="btn btn-primary"
              style={{ ...s.actionBtn, opacity: phase === 'verifying-otp' ? 0.6 : 1 }}
              onClick={handleVerifyOtp}
              disabled={phase === 'verifying-otp'}
            >
              {phase === 'verifying-otp' ? 'Verifying…' : 'Verify →'}
            </button>
            <p
              style={s.hintLink}
              onClick={() => { setOtpCode(''); setOtpError(''); setPhase('phone-input'); }}
            >
              Wrong number? Change it
            </p>
          </>}

          {phase === 'confirmed' && <>
            <p style={{ ...s.title, color: '#10B981' }}>Identity Confirmed ✓</p>
            <p style={s.sub}>Welcome to Humix</p>
          </>}

          {phase === 'failed' && <>
            <p style={{ ...s.title, color: '#EF4444' }}>Verification Failed</p>
            <p style={{ ...s.sub, maxWidth: '260px', margin: '0 auto' }}>{errMsg}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
              <button className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '13px', color: '#F8FAFC' }}
                onClick={() => { setPhase('ready'); }}>
                Try Again
              </button>
              <button className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '13px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                onClick={handleSwitchToRegister}>
                Re-register
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

        {/* Pulsing dots while processing */}
        {(phase === 'loading' || isActive || phase === 'sending-otp' || phase === 'verifying-otp') && (
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
    cursor: 'pointer', transition: 'background 0.15s ease',
  },
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '360px', padding: '0 24px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '99px', padding: '7px 18px', fontSize: '12px', fontWeight: 600,
    fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.02em', marginBottom: '40px',
  },
  dot: {
    width: '6px', height: '6px', borderRadius: '50%',
    display: 'inline-block', transition: 'all 0.4s ease',
  },
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
  sub: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#64748B', fontWeight: 500,
  },
  actionBtn: {
    marginTop: '24px', padding: '12px 28px', fontSize: '16px', fontWeight: 700,
    color: '#F8FAFC', background: '#6366F1', border: 'none', borderRadius: '10px',
    cursor: 'pointer', width: '100%',
  },
  textInput: {
    marginTop: '20px', width: '100%', padding: '14px 16px', fontSize: '16px',
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', color: '#F8FAFC', fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  },
  inlineError: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F87171',
    marginTop: '10px', textAlign: 'center',
  },
  hint: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#475569',
    marginTop: '12px',
  },
  hintLink: {
    fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#6366F1',
    marginTop: '12px', cursor: 'pointer', textDecoration: 'underline',
  },
  dotsRow: { display: 'flex', gap: '6px', marginTop: '24px' },
};
