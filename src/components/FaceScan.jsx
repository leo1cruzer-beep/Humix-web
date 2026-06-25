import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';
import { useIdentity } from '../hooks/useIdentity';

const MODEL_URL = '/models';
const DESCRIPTOR_KEY = 'humix_face_descriptor';
const MATCH_THRESHOLD = 0.5;
const VERIFY_TIMEOUT_MS = 10_000;
const DETECT_INTERVAL_MS = 500;
const SIZE = 240;
const RING = 7;

// phase values: loading | cam_error | registering | verifying | confirmed | failed

export default function FaceScan({ onComplete, onClose }) {
  const { verify } = useIdentity();
  const [phase, setPhase] = useState('loading');
  const [loadPct, setLoadPct] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const [wasRegistering, setWasRegistering] = useState(false);

  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Unmount cleanup — always stop camera + timers
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function stopDetection() {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  }

  // Shared detection loop — calls onFrame with each result (null = no face)
  function runDetect(onFrame) {
    stopDetection();
    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    intervalRef.current = setInterval(async () => {
      const v = videoRef.current;
      if (!v || v.readyState < 2) return;
      try {
        const r = await faceapi
          .detectSingleFace(v, opts)
          .withFaceLandmarks()
          .withFaceDescriptor();
        onFrame(r);
      } catch (_) { /* skip frame on inference error */ }
    }, DETECT_INTERVAL_MS);
  }

  function runRegister() {
    runDetect(r => {
      if (!r) { setConfidence(0); return; }
      const score = r.detection.score;
      setConfidence(Math.round(score * 100));
      if (score > 0.7) {
        stopDetection();
        localStorage.setItem(DESCRIPTOR_KEY, JSON.stringify(Array.from(r.descriptor)));
        setPhase('confirmed');
        setTimeout(() => { verify(); onComplete(); }, 1300);
      }
    });
  }

  function runVerify() {
    const raw = localStorage.getItem(DESCRIPTOR_KEY);
    if (!raw) { runRegister(); return; }
    const stored = new Float32Array(JSON.parse(raw));

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setPhase('failed');
    }, VERIFY_TIMEOUT_MS);

    runDetect(r => {
      if (!r) { setConfidence(0); return; }
      setConfidence(Math.round(r.detection.score * 100));
      const dist = faceapi.euclideanDistance(stored, r.descriptor);
      if (dist < MATCH_THRESHOLD) {
        stopDetection();
        setPhase('confirmed');
        setTimeout(() => { verify(); onComplete(); }, 1300);
      }
    });
  }

  // ── Init on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Load models
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadPct(40);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadPct(70);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadPct(100);
      } catch {
        if (!cancelled) {
          setPhase('cam_error');
          setErrMsg('Failed to load recognition models. Please refresh.');
        }
        return;
      }

      // 2. Open camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        if (!cancelled) {
          setPhase('cam_error');
          setErrMsg(
            e.name === 'NotAllowedError'
              ? 'Camera access denied. Please allow camera permissions and try again.'
              : 'Camera not available on this device.',
          );
        }
        return;
      }

      if (cancelled) return;

      // 3. Choose mode
      if (localStorage.getItem(DESCRIPTOR_KEY)) {
        setPhase('verifying');
        runVerify();
      } else {
        setWasRegistering(true);
        setPhase('registering');
        runRegister();
      }
    }

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── User actions ─────────────────────────────────────────────────────────

  const doClose = () => {
    stopDetection();
    streamRef.current?.getTracks().forEach(t => t.stop());
    onClose?.();
  };

  const handleRetry = () => {
    setConfidence(0);
    setPhase('verifying');
    runVerify();
  };

  const handleReRegister = () => {
    localStorage.removeItem(DESCRIPTOR_KEY);
    setConfidence(0);
    setWasRegistering(true);
    setPhase('registering');
    runRegister();
  };

  // ── Derived display values ────────────────────────────────────────────────

  const isScanning = phase === 'registering' || phase === 'verifying';

  const badgeColor =
    phase === 'confirmed'                       ? '#10B981' :
    (phase === 'failed' || phase === 'cam_error') ? '#EF4444' : '#6366F1';

  const ringExtra = (() => {
    if (phase === 'confirmed') return {
      background: 'conic-gradient(from 0deg, #10B981, rgba(16,185,129,0.3) 60%, #10B981)',
      animation: 'ringFadeGreen 0.4s ease forwards',
    };
    if (phase === 'failed') return {
      background: 'conic-gradient(from 0deg, #EF4444, rgba(239,68,68,0.12) 55%, #EF4444)',
      animation: 'ringFadeGreen 0.4s ease forwards',
    };
    if (phase === 'cam_error') return {
      background: 'rgba(239,68,68,0.15)',
      animation: 'none',
    };
    if (isScanning) return {
      background: 'conic-gradient(from 0deg, #6366F1 0%, rgba(99,102,241,0.4) 30%, transparent 55%, transparent 85%, rgba(99,102,241,0.3) 100%)',
      animation: 'scanRotate 1.8s linear infinite',
    };
    // loading — slow dim spin
    return {
      background: 'conic-gradient(from 0deg, rgba(99,102,241,0.4) 0%, transparent 60%)',
      animation: 'scanRotate 3s linear infinite',
    };
  })();

  const BADGE_LABELS = {
    loading: 'Loading Identity Engine',
    cam_error: 'Camera Required',
    registering: 'Biometric Registration',
    verifying: 'Biometric Verification',
    confirmed: 'Verification Complete',
    failed: 'Verification Failed',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label="Face scan identity verification">
      {onClose && phase !== 'confirmed' && (
        <button style={s.closeBtn} onClick={doClose} aria-label="Cancel scan">
          <X size={20} color="#64748B" strokeWidth={1.5} />
        </button>
      )}

      <div style={s.inner}>
        {/* Status badge */}
        <div style={s.badge}>
          <span style={{ ...s.dot, background: badgeColor, boxShadow: `0 0 8px ${badgeColor}` }} />
          {BADGE_LABELS[phase]}
        </div>

        {/* Viewfinder */}
        <div style={s.viewfinder}>
          {/* Outer spinning / colored ring */}
          <div style={{ ...s.spinRing, ...ringExtra }} />

          {/* Inner clipping circle — holds video + overlays */}
          <div style={s.innerCircle}>
            {/* Live camera feed */}
            <video
              ref={videoRef}
              autoPlay muted playsInline
              style={{ ...s.video, opacity: isScanning ? 1 : 0 }}
            />

            {/* Loading progress */}
            {phase === 'loading' && (
              <div style={s.centerOverlay}>
                <div style={s.progressTrack}>
                  <div style={{ ...s.progressBar, width: `${loadPct}%` }} />
                </div>
                <span style={{ ...s.confLabel, marginTop: '8px' }}>{loadPct}%</span>
              </div>
            )}

            {/* Confirmed checkmark */}
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

            {/* Failed X */}
            {phase === 'failed' && (
              <div style={s.centerOverlay}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                  style={{ animation: 'confirmCheck 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
                  <circle cx="40" cy="40" r="40" fill="rgba(239,68,68,0.12)" />
                  <path d="M27 27l26 26M53 27L27 53" stroke="#EF4444" strokeWidth="4"
                    strokeLinecap="round" />
                </svg>
              </div>
            )}

            {/* Camera / model error icon */}
            {phase === 'cam_error' && (
              <div style={s.centerOverlay}>
                <X size={40} color="#EF4444" strokeWidth={1.5} />
              </div>
            )}

            {/* Scan line (on top of video) */}
            {isScanning && <div style={s.scanLine} />}
          </div>

          {/* Corner bracket markers */}
          {isScanning && (
            <>
              <Corner top={36} left={36}   borders="tl" />
              <Corner top={36} right={36}  borders="tr" />
              <Corner bottom={36} left={36}  borders="bl" />
              <Corner bottom={36} right={36} borders="br" />
            </>
          )}
        </div>

        {/* Confidence bar */}
        {isScanning && confidence > 0 && (
          <div style={s.confWrap}>
            <div style={s.confTrack}>
              <div style={{
                ...s.confBar,
                width: `${confidence}%`,
                background: confidence > 70 ? '#10B981' : confidence > 40 ? '#F59E0B' : '#6366F1',
              }} />
            </div>
            <span style={s.confLabel}>{confidence}% confidence</span>
          </div>
        )}

        {/* Status text */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          {phase === 'loading' && <>
            <p style={s.title}>Loading identity engine…</p>
            <p style={s.sub}>Initializing neural network — one moment</p>
          </>}
          {phase === 'registering' && <>
            <p style={s.title}>Position your face in the circle</p>
            <p style={s.sub}>Hold still — capturing your biometric identity</p>
          </>}
          {phase === 'verifying' && <>
            <p style={s.title}>Verifying identity…</p>
            <p style={s.sub}>Hold still and look straight ahead</p>
          </>}
          {phase === 'confirmed' && <>
            <p style={{ ...s.title, color: '#10B981' }}>
              {wasRegistering ? 'Identity Registered' : 'Identity Confirmed'}
            </p>
            <p style={s.sub}>Welcome to Humix</p>
          </>}
          {phase === 'failed' && <>
            <p style={{ ...s.title, color: '#EF4444' }}>Face not recognized</p>
            <p style={s.sub}>We couldn't match your face to the stored identity</p>
          </>}
          {phase === 'cam_error' && <>
            <p style={{ ...s.title, color: '#EF4444' }}>Camera access required</p>
            <p style={{ ...s.sub, maxWidth: '260px' }}>{errMsg}</p>
          </>}
        </div>

        {/* Retry / re-register buttons */}
        {phase === 'failed' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '10px 20px', fontSize: '13px' }}
              onClick={handleRetry}
            >
              Try Again
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '10px 20px', fontSize: '13px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
              onClick={handleReRegister}
            >
              Re-register Face
            </button>
          </div>
        )}

        {/* Pulsing dots while waiting for face */}
        {(isScanning || phase === 'loading') && confidence === 0 && (
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
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
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
  video: {
    position: 'absolute', width: '100%', height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // mirror so user sees themselves naturally
    transition: 'opacity 0.4s ease',
  },
  centerOverlay: {
    position: 'absolute', inset: 0, zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
  },
  scanLine: {
    position: 'absolute', left: '16px', right: '16px', top: '50%',
    height: '2px', zIndex: 3,
    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)',
    borderRadius: '1px', boxShadow: '0 0 8px rgba(99,102,241,0.6)',
    animation: 'scanLine 2s ease-in-out infinite',
  },
  progressTrack: {
    width: '140px', height: '3px',
    background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden',
  },
  progressBar: {
    height: '100%', background: '#6366F1',
    borderRadius: '99px', transition: 'width 0.4s ease',
  },
  confWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '6px', marginTop: '20px',
  },
  confTrack: {
    width: '180px', height: '3px',
    background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden',
  },
  confBar: {
    height: '100%', borderRadius: '99px',
    transition: 'width 0.3s ease, background 0.3s ease',
  },
  confLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '11px',
    color: '#64748B', fontWeight: 500, letterSpacing: '0.02em',
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '22px',
    letterSpacing: '-0.03em', color: '#F8FAFC', marginBottom: '8px', transition: 'color 0.4s ease',
  },
  sub: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#64748B', fontWeight: 500,
  },
  dotsRow: { display: 'flex', gap: '6px', marginTop: '24px' },
};
