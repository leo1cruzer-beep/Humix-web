import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Fingerprint, Activity, Calendar, Star, Shield, LogOut, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useIdentity } from '../hooks/useIdentity';

const USER_ID_KEY = 'humix_user_id';

const serviceRoutes = {
  'Resume Builder':       '/career/resume',
  'Cover Letter':         '/career/cover-letter',
  'Interview Prep':       '/career/interview',
  'Salary Insights':      '/career/salary',
  'Business Plan':        '/business/plan',
  'Pitch Deck':           '/business/pitch',
  'Name Generator':       '/business/names',
  'Market Research':      '/business/market',
  'Content Writer':       '/creative/content',
  'Social Media Pack':    '/creative/social',
  'Email Campaign':       '/creative/email',
  'Brand Voice':          '/creative/brand',
  'Budget Tracker':       '/finance/budget',
  'Wealth Builder':       '/finance/wealth',
  'Debt Freedom':         '/finance/debt',
  'Remittance':           '/finance/remittance',
  'Remittance Optimizer': '/finance/remittance',
  'Markets':              '/finance/markets',
  'Health':               '/life-assistant',
  'Legal':                '/life-assistant',
  'Agriculture':          '/life-assistant',
  'Education':            '/life-assistant',
  'Freelancing':          '/life-assistant',
};

function daysSince(dateStr) {
  if (!dateStr) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000));
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function IdentityProfile() {
  const { clearIdentity } = useIdentity();
  const navigate = useNavigate();
  const userId = localStorage.getItem(USER_ID_KEY);

  const [passkey, setPasskey]       = useState(null);
  const [activity, setActivity]     = useState([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [hoveredActivity, setHoveredActivity] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    async function load() {
      const [pkRes, convRes] = await Promise.all([
        supabase.from('passkeys').select('created_at').eq('user_id', userId).limit(1).single(),
        supabase.from('conversations').select('id, service, created_at, preview, messages').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      ]);

      if (!alive) return;

      if (pkRes.data) setPasskey(pkRes.data);

      if (convRes.data) {
        setActivity(convRes.data);
        const unique = new Set(convRes.data.map(r => r.service)).size;
        setServiceCount(unique);
      }

      setLoading(false);
    }

    load();
    return () => { alive = false; };
  }, [userId]);

  const identityScore = Math.min(100, 50 + serviceCount * 10);
  const daysActive    = daysSince(passkey?.created_at);
  const humixId       = userId ? userId.slice(0, 8).toUpperCase() : '--------';

  const handleReset = () => {
    clearIdentity();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
            <div style={s.spinner} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* ── Identity Card ───────────────────────────────────── */}
        <div style={s.identityCard}>
          <div style={s.cardGlow} />

          <div style={s.iconRing}>
            <Fingerprint size={40} color="#6366F1" strokeWidth={1.4} />
          </div>

          <div style={s.verifiedBadge}>
            <span style={s.verifiedDot} />
            Identity Verified ✓
          </div>

          <h1 style={s.idTitle}>Humix ID</h1>
          <p style={s.idValue}>{humixId}</p>

          <div style={s.metaRow}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Member since</span>
              <span style={s.metaValue}>{fmtDate(passkey?.created_at)}</span>
            </div>
            <div style={s.metaDivider} />
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Identity score</span>
              <span style={{ ...s.metaValue, color: '#6366F1', textShadow: '0 0 12px rgba(99,102,241,0.6)' }}>
                {identityScore}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div style={s.statsRow}>
          <StatCard
            icon={<Activity size={20} color="#6366F1" strokeWidth={1.8} />}
            label="Services Used"
            value={serviceCount}
          />
          <StatCard
            icon={<Calendar size={20} color="#10B981" strokeWidth={1.8} />}
            label="Days Active"
            value={daysActive}
            valueColor="#10B981"
          />
          <StatCard
            icon={<Star size={20} color="#F59E0B" strokeWidth={1.8} />}
            label="Identity Score"
            value={identityScore}
            valueColor="#6366F1"
            glow
          />
        </div>

        {/* ── Recent Activity ─────────────────────────────────── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Recent Activity</h2>

          {activity.length === 0 ? (
            <div style={s.emptyState}>
              <Shield size={32} color="#1E293B" strokeWidth={1.2} />
              <p style={s.emptyText}>No activity yet — start using Humix services</p>
            </div>
          ) : (
            <div style={s.activityList}>
              {activity.map((item, i) => (
                <Link
                  key={i}
                  to={serviceRoutes[item.service] || '/'}
                  state={{ previousContent: item.messages?.[0]?.content || null }}
                  style={{
                    ...s.activityItem,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    filter: hoveredActivity === i ? 'brightness(1.15)' : 'brightness(1)',
                    transition: 'filter 0.15s',
                  }}
                  onMouseEnter={() => setHoveredActivity(i)}
                  onMouseLeave={() => setHoveredActivity(null)}
                >
                  <div style={s.activityDot} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={s.activityService}>{item.service ?? 'Humix Service'}</p>
                    {item.preview && (
                      <p style={s.activityPreview}>{item.preview}</p>
                    )}
                  </div>
                  <span style={s.activityDate}>{fmtDate(item.created_at)}</span>
                  <ChevronRight size={14} color="#1E293B" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Settings ────────────────────────────────────────── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Settings</h2>

          <div style={s.settingsCard}>
            {!confirmReset ? (
              <div style={s.settingsRow}>
                <div>
                  <p style={s.settingsLabel}>Reset Biometric Identity</p>
                  <p style={s.settingsDesc}>Remove your passkey and all stored credentials. You'll need to re-register.</p>
                </div>
                <button
                  style={s.resetBtn}
                  onClick={() => setConfirmReset(true)}
                >
                  <LogOut size={15} strokeWidth={2} />
                  Reset
                </button>
              </div>
            ) : (
              <div style={s.confirmBox}>
                <p style={s.confirmText}>Are you sure? This will erase your identity and log you out.</p>
                <div style={s.confirmBtns}>
                  <button style={s.cancelBtn} onClick={() => setConfirmReset(false)}>Cancel</button>
                  <button style={s.confirmResetBtn} onClick={handleReset}>Yes, reset identity</button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, valueColor = '#F8FAFC', glow = false }) {
  return (
    <div style={s.statCard}>
      <div style={s.statIcon}>{icon}</div>
      <p style={{
        ...s.statValue,
        color: valueColor,
        textShadow: glow ? '0 0 16px rgba(99,102,241,0.5)' : 'none',
      }}>
        {value}
      </p>
      <p style={s.statLabel}>{label}</p>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-page)',
    padding: '48px 0 80px',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '0 20px',
  },

  // Identity card
  identityCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '24px',
    padding: '48px 32px 40px',
    textAlign: 'center',
    overflow: 'hidden',
    marginBottom: '20px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  cardGlow: {
    position: 'absolute',
    top: '-80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '200px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  iconRing: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 0 32px rgba(99,102,241,0.2)',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '99px',
    padding: '5px 14px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#10B981',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '28px',
    letterSpacing: '0.02em',
  },
  verifiedDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10B981',
    boxShadow: '0 0 6px #10B981',
    display: 'inline-block',
  },
  idTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  idValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '32px',
    fontWeight: 900,
    color: '#F8FAFC',
    letterSpacing: '0.08em',
    marginBottom: '32px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  metaValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    fontWeight: 700,
    color: '#F8FAFC',
  },
  metaDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(255,255,255,0.08)',
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '20px 16px',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
  },
  statIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  statValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '4px',
  },
  statLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  // Section
  section: { marginBottom: '32px' },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },

  // Activity
  emptyState: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#334155',
    textAlign: 'center',
  },
  activityList: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  activityDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#6366F1',
    flexShrink: 0,
    boxShadow: '0 0 6px rgba(99,102,241,0.5)',
  },
  activityService: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: '#F8FAFC',
    marginBottom: '2px',
  },
  activityPreview: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#475569',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '300px',
  },
  activityDate: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#334155',
    flexShrink: 0,
    marginLeft: 'auto',
  },

  // Settings
  settingsCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  settingsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '20px 24px',
    flexWrap: 'wrap',
  },
  settingsLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: '#F8FAFC',
    marginBottom: '4px',
  },
  settingsDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#475569',
    maxWidth: '340px',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: '10px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#EF4444',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    flexShrink: 0,
  },
  confirmBox: {
    padding: '24px',
  },
  confirmText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#94A3B8',
    marginBottom: '16px',
  },
  confirmBtns: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  cancelBtn: {
    padding: '9px 20px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
  },
  confirmResetBtn: {
    padding: '9px 20px',
    borderRadius: '10px',
    background: '#EF4444',
    border: 'none',
    color: '#F8FAFC',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
  },

  // Misc
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(99,102,241,0.15)',
    borderTop: '3px solid #6366F1',
    animation: 'spin 0.8s linear infinite',
  },
};
