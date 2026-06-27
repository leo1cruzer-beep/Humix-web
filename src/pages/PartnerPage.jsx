import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PARTNERSHIP_TYPES = ['NGO', 'Health Org', 'Education', 'Government', 'Other'];

const WHY_ITEMS = [
  {
    title: 'Reach the truly underserved',
    body: 'Havro is built for communities with limited connectivity, low digital literacy, and no access to formal services — exactly the populations you work with.',
  },
  {
    title: 'AI that works in their language',
    body: 'Life guidance, health triage, and legal information delivered in Urdu, Arabic, Swahili, and more — in the user\'s dialect, not just the official language.',
  },
  {
    title: 'Works on any phone',
    body: 'IVR voice calls, SMS, and smartphone app — Havro meets people wherever they are, even with a basic feature phone and no internet.',
  },
];

const OFFER_ITEMS = [
  'White-label deployment with your organization\'s branding',
  'Co-created content aligned with your health or education programs',
  'Offline-capable modules for low-connectivity field operations',
  'Shared analytics dashboard for impact measurement',
  'Dedicated integration support and onboarding assistance',
  'Joint grant applications and impact reporting',
];

const COUNTRIES = [
  'Afghanistan', 'Bangladesh', 'Cameroon', 'DR Congo', 'Egypt', 'Ethiopia',
  'Ghana', 'India', 'Indonesia', 'Iraq', 'Jordan', 'Kenya', 'Lebanon',
  'Morocco', 'Mozambique', 'Myanmar', 'Nepal', 'Nigeria', 'Pakistan',
  'Philippines', 'Rwanda', 'Senegal', 'Somalia', 'South Africa', 'Sri Lanka',
  'Sudan', 'Syria', 'Tanzania', 'Tunisia', 'Uganda', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  'Other',
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    org_name: '', contact_name: '', email: '', country: '',
    partnership_type: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.org_name || !form.contact_name || !form.email || !form.country || !form.partnership_type) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.from('partners').insert(form);
      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={s.page}>
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true" />
        <div style={s.heroInner}>
          <p style={s.eyebrow}>PARTNERSHIP</p>
          <h1 style={s.headline}>Partner with Havro</h1>
          <p style={s.subheadline}>
            We're looking for NGOs, health organizations, and community networks who want to bring AI access to underserved populations.
          </p>
        </div>
      </section>

      {/* Why Partner */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>WHY PARTNER</p>
          <h2 style={s.sectionTitle}>Technology built for the missions that matter</h2>
          <div style={s.whyGrid}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} style={s.whyCard}>
                <div style={s.whyNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={s.whyTitle}>{item.title}</h3>
                <p style={s.whyBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section style={s.sectionAlt}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>WHAT WE OFFER</p>
          <h2 style={s.sectionTitle}>Designed for deep integration</h2>
          <div style={s.offerGrid}>
            {OFFER_ITEMS.map((item, i) => (
              <div key={i} style={s.offerItem}>
                <CheckCircle2 size={18} color="#00C48C" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={s.offerText}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>GET IN TOUCH</p>
          <h2 style={s.sectionTitle}>Start the conversation</h2>
          <p style={s.formIntro}>
            Fill in your details and our partnerships team will reach out within 48 hours.
          </p>

          {success ? (
            <div style={s.successBox}>
              <div style={s.successCheck}>✓</div>
              <h3 style={s.successTitle}>Thank you for reaching out.</h3>
              <p style={s.successMsg}>Our partnerships team will be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formRow}>
                <div style={s.field}>
                  <label style={s.label}>Organization Name *</label>
                  <input
                    type="text" required
                    placeholder="Your organization"
                    value={form.org_name} onChange={set('org_name')}
                    style={s.input}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Contact Name *</label>
                  <input
                    type="text" required
                    placeholder="Your name"
                    value={form.contact_name} onChange={set('contact_name')}
                    style={s.input}
                  />
                </div>
              </div>

              <div style={s.formRow}>
                <div style={s.field}>
                  <label style={s.label}>Email Address *</label>
                  <input
                    type="email" required
                    placeholder="contact@organization.org"
                    value={form.email} onChange={set('email')}
                    style={s.input}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Country *</label>
                  <select required value={form.country} onChange={set('country')} style={s.select}>
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Partnership Type *</label>
                <div style={s.typeRow}>
                  {PARTNERSHIP_TYPES.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm(p => ({ ...p, partnership_type: t }))}
                      style={{
                        ...s.typeBtn,
                        ...(form.partnership_type === t ? s.typeBtnActive : {}),
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Message</label>
                <textarea
                  placeholder="Tell us about your organization and how you'd like to partner..."
                  value={form.message} onChange={set('message')}
                  rows={5}
                  style={s.textarea}
                />
              </div>

              {error && <p style={s.error}>{error}</p>}

              <button type="submit" disabled={loading} style={s.submitBtn}>
                {loading ? 'Sending…' : 'Send Partnership Inquiry'} {!loading && <ArrowRight size={16} strokeWidth={2} />}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

const s = {
  page: { background: '#0C0C0D', minHeight: '100vh' },

  hero: {
    background: '#080809',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '100px 24px 80px',
    position: 'relative', overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: [
      'radial-gradient(ellipse at 20% 50%, rgba(0,196,140,0.07) 0%, transparent 60%)',
      'radial-gradient(ellipse at 80% 30%, rgba(10,132,255,0.05) 0%, transparent 60%)',
    ].join(', '),
  },
  heroInner: {
    position: 'relative', zIndex: 1,
    maxWidth: '720px', margin: '0 auto', textAlign: 'center',
  },
  eyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#00C48C', textTransform: 'uppercase', marginBottom: '16px',
  },
  headline: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '-0.03em',
    lineHeight: 1.08, color: '#F5F5F5', marginBottom: '20px',
  },
  subheadline: {
    fontSize: 'clamp(15px, 2vw, 18px)', color: '#A0A0A0',
    lineHeight: 1.65, maxWidth: '580px', margin: '0 auto',
  },

  section: {
    padding: '80px 24px',
    background: '#0C0C0D',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  sectionAlt: {
    padding: '80px 24px',
    background: '#080809',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  container: { maxWidth: '860px', margin: '0 auto' },
  sectionEyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#606060', textTransform: 'uppercase', marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em',
    color: '#F5F5F5', marginBottom: '40px',
  },

  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
  },
  whyCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '28px 24px',
  },
  whyNum: {
    fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 800,
    color: 'rgba(0,196,140,0.25)', letterSpacing: '-0.04em',
    marginBottom: '16px',
  },
  whyTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    color: '#F5F5F5', marginBottom: '10px', letterSpacing: '-0.01em',
  },
  whyBody: {
    fontSize: '14px', color: '#606060', lineHeight: 1.65,
  },

  offerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  offerItem: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
  },
  offerText: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px',
    color: '#A0A0A0', lineHeight: 1.55,
  },

  formIntro: {
    fontSize: '15px', color: '#606060', lineHeight: 1.6, marginBottom: '36px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
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
    cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23606060' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  },
  textarea: {
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px', fontFamily: "'Inter', sans-serif",
    color: '#F5F5F5', outline: 'none',
    width: '100%', boxSizing: 'border-box', resize: 'vertical',
    lineHeight: 1.6,
  },
  typeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  typeBtn: {
    padding: '9px 18px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#606060', fontFamily: "'Inter', sans-serif",
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  typeBtnActive: {
    background: 'rgba(0,196,140,0.12)',
    border: '1px solid rgba(0,196,140,0.3)',
    color: '#00C48C',
  },
  error: {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#FF6B6B',
    padding: '10px 14px', background: 'rgba(255,107,107,0.08)',
    borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)', margin: 0,
  },
  submitBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    height: '48px', background: '#00C48C', color: '#000',
    border: 'none', borderRadius: '10px',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease',
    paddingLeft: '28px', paddingRight: '28px',
    alignSelf: 'flex-start',
  },

  successBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '56px 32px', textAlign: 'center',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
  },
  successCheck: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'rgba(0,196,140,0.12)', border: '2px solid rgba(0,196,140,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', color: '#00C48C', marginBottom: '20px',
  },
  successTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px',
    color: '#F5F5F5', letterSpacing: '-0.02em', marginBottom: '8px',
  },
  successMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#606060',
  },
};
