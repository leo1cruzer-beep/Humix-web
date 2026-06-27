import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const COUNTRIES = [
  'Afghanistan', 'Bangladesh', 'Cameroon', 'DR Congo', 'Egypt', 'Ethiopia',
  'Ghana', 'India', 'Indonesia', 'Iraq', 'Jordan', 'Kenya', 'Lebanon',
  'Liberia', 'Malaysia', 'Morocco', 'Mozambique', 'Myanmar', 'Nepal',
  'Nigeria', 'Pakistan', 'Philippines', 'Qatar', 'Rwanda', 'Saudi Arabia',
  'Senegal', 'Sierra Leone', 'Somalia', 'South Africa', 'Sri Lanka', 'Sudan',
  'Syria', 'Tanzania', 'Tunisia', 'Uganda', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  'Other',
];

const ROLES = ['User', 'Agent', 'Partner'];

export default function WaitlistModal({ isOpen, onClose, defaultRole = 'User' }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole]       = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(''); setPhone(''); setCountry('');
      setRole(defaultRole);
      setError(''); setSuccess(false);
    }
  }, [isOpen, defaultRole]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !country) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase
        .from('waitlist')
        .insert({ name: name.trim(), phone: phone.trim(), country, role });
      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.modal} role="dialog" aria-modal="true" aria-labelledby="waitlist-title">
        <button style={s.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} color="#A0A0A0" strokeWidth={1.5} />
        </button>

        {success ? (
          <div style={s.successWrap}>
            <div style={s.successCheck}>✓</div>
            <h2 style={s.successTitle}>You're on the list.</h2>
            <p style={s.successMsg}>We'll be in touch.</p>
          </div>
        ) : (
          <>
            <h2 id="waitlist-title" style={s.title}>Join the Waitlist</h2>
            <p style={s.subtitle}>Be among the first to access Havro when we launch in your region.</p>

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={s.input}
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={s.input}
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Country</label>
                <select
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  style={s.select}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={s.field}>
                <label style={s.label}>I'm joining as</label>
                <div style={s.roleRow}>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{ ...s.roleBtn, ...(role === r ? s.roleBtnActive : {}) }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={s.error}>{error}</p>}

              <button type="submit" disabled={loading} style={s.submitBtn}>
                {loading ? 'Joining…' : 'Join Waitlist'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.78)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 500,
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 501,
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '44px 36px 36px',
    width: 'calc(100% - 32px)',
    maxWidth: '440px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.65)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute', top: '16px', right: '16px',
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px',
    letterSpacing: '-0.03em', color: '#F5F5F5', marginBottom: '8px',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#606060',
    marginBottom: '28px', lineHeight: 1.55,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600,
    color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  input: {
    height: '44px', padding: '0 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px', fontFamily: "'Inter', sans-serif",
    color: '#F5F5F5', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  select: {
    height: '44px', padding: '0 36px 0 14px',
    background: '#1A1A1A',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px', fontFamily: "'Inter', sans-serif",
    color: '#F5F5F5', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23606060' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  },
  roleRow: { display: 'flex', gap: '8px' },
  roleBtn: {
    flex: 1, padding: '10px 0', borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#606060', fontFamily: "'Inter', sans-serif",
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  roleBtnActive: {
    background: 'rgba(0,196,140,0.12)',
    border: '1px solid rgba(0,196,140,0.3)',
    color: '#00C48C',
  },
  error: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#FF6B6B',
    padding: '10px 14px', background: 'rgba(255,107,107,0.08)',
    borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)',
    margin: 0,
  },
  submitBtn: {
    height: '48px', background: '#00C48C', color: '#000',
    border: 'none', borderRadius: '10px',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    marginTop: '4px',
  },
  successWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 0 16px', textAlign: 'center',
  },
  successCheck: {
    width: '60px', height: '60px', borderRadius: '50%',
    background: 'rgba(0,196,140,0.12)', border: '2px solid rgba(0,196,140,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '26px', color: '#00C48C', marginBottom: '20px',
  },
  successTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px',
    color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: '8px',
  },
  successMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#606060',
  },
};
