import { CheckCircle2, FileText, MessageSquare, ClipboardCheck, Play } from 'lucide-react';

const PROBLEM_POINTS = [
  {
    title: 'Borrowers sign terms they cannot read',
    body: 'Pakistan\'s SBP estimates 43% of adults are functionally financially illiterate. Oral agreements dominate rural lending. Loan officers move fast; comprehension verification is absent.',
  },
  {
    title: 'Uninformed consent creates default risk',
    body: 'When borrowers do not understand repayment schedules, early payment penalties, or insurance attachments, default rates spike — not from unwillingness but from confusion about obligations.',
  },
  {
    title: 'Regulatory exposure is growing',
    body: 'SBP\'s Financial Inclusion Strategy and SECP\'s Microfinance Regulations place informed consent obligations on MFIs. The absence of a documented consent trail is a compliance liability.',
  },
  {
    title: 'Disputes are costly and difficult to resolve',
    body: 'Without a verifiable record of what the borrower was told and when, dispute resolution depends on conflicting verbal accounts. This absorbs staff time and erodes borrower trust.',
  },
];

const HOW_STEPS = [
  {
    num: '01',
    Icon: FileText,
    title: 'MFI shares loan terms',
    body: 'Upload a loan schedule via spreadsheet or connect via REST API. No bespoke integration required in phase one — CSV upload works for pilot.',
    color: '#00C48C',
  },
  {
    num: '02',
    Icon: MessageSquare,
    title: 'Borrower receives a WhatsApp voice call',
    body: 'An AI voice agent calls the borrower on WhatsApp in Urdu or Punjabi. It explains principal, interest rate, repayment schedule, and flags any terms that require attention — in plain language, at the borrower\'s pace.',
    color: '#0A84FF',
  },
  {
    num: '03',
    Icon: ClipboardCheck,
    title: 'MFI receives a consent log',
    body: 'A timestamped transcript and audio record is delivered to the MFI: which terms were explained, which were acknowledged, and a spoken consent confirmation from the borrower.',
    color: '#FFB340',
  },
];

const PILOT_METRICS = [
  { label: 'Borrower comprehension score', desc: 'Pre/post assessment via follow-up call' },
  { label: 'Dispute frequency', desc: 'Comparing cohort against branch baseline' },
  { label: 'Consent audit completeness', desc: 'Percentage of disbursements with logged consent' },
  { label: 'Loan officer time saved', desc: 'Self-reported time on consent and explanation tasks' },
];

export default function MFIPage() {
  return (
    <main style={s.page}>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true" />
        <div style={s.heroInner}>
          <p style={s.eyebrow}>FOR MICROFINANCE INSTITUTIONS</p>
          <h1 style={s.headline}>Voice Loan Shield</h1>
          <p style={s.subheadline}>
            AI voice agent that explains loan terms to low-literacy borrowers in Urdu and Punjabi,
            flags predatory terms, and confirms informed consent — delivered over WhatsApp,
            no app install required.
          </p>
          <a href="mailto:saeed@havro.app?subject=MFI%20Pilot%20Inquiry" style={s.ctaBtn}>
            Discuss a pilot
          </a>
        </div>
      </section>

      {/* ─── The Problem ──────────────────────────────────────── */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>THE PROBLEM</p>
          <h2 style={s.sectionTitle}>The informed consent gap in microfinance</h2>
          <p style={s.sectionIntro}>
            MFIs operating under SBP's financial inclusion and transparency agenda face a
            structural problem: the populations they serve are often unable to read loan documents,
            yet signed contracts are treated as evidence of informed consent. The consequences
            are measurable and costly.
          </p>
          <div style={s.problemGrid}>
            {PROBLEM_POINTS.map((pt, i) => (
              <div key={i} style={s.problemCard}>
                <div style={s.problemNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={s.problemTitle}>{pt.title}</h3>
                <p style={s.problemBody}>{pt.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────── */}
      <section style={s.sectionAlt}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>HOW IT WORKS</p>
          <h2 style={s.sectionTitle}>Three steps from disbursement to documented consent</h2>
          <div style={s.stepsGrid}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ ...s.stepIcon, background: step.color + '14', border: `1px solid ${step.color}28` }}>
                    <step.Icon size={22} color={step.color} strokeWidth={1.8} />
                  </div>
                  <span style={{ ...s.stepNum, color: step.color + '50' }}>{step.num}</span>
                </div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepBody}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pilot Structure ──────────────────────────────────── */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>PILOT STRUCTURE</p>
          <h2 style={s.sectionTitle}>A 90-day pilot designed for low disruption</h2>
          <div style={s.pilotLayout}>
            <div style={s.pilotLeft}>
              <p style={s.pilotBody}>
                Phase one is scoped to a single branch or lending cohort — typically 200 to 500
                active borrowers. There is no integration burden: loan data is shared via
                spreadsheet upload. No change to your existing loan management system is required.
              </p>
              <p style={s.pilotBody}>
                The pilot runs for 90 days. At the end, you receive a structured impact report
                covering the metrics below, with comparison data against your branch baseline.
                Continuation, expansion, or termination is your decision — no lock-in.
              </p>
              <div style={s.pilotDetails}>
                <div style={s.pilotDetail}>
                  <span style={s.pilotDetailLabel}>Duration</span>
                  <span style={s.pilotDetailVal}>90 days</span>
                </div>
                <div style={s.pilotDetail}>
                  <span style={s.pilotDetailLabel}>Scope</span>
                  <span style={s.pilotDetailVal}>One branch or cohort</span>
                </div>
                <div style={s.pilotDetail}>
                  <span style={s.pilotDetailLabel}>Integration</span>
                  <span style={s.pilotDetailVal}>CSV upload, no system changes</span>
                </div>
                <div style={s.pilotDetail}>
                  <span style={s.pilotDetailLabel}>Languages</span>
                  <span style={s.pilotDetailVal}>Urdu, Punjabi (more on request)</span>
                </div>
              </div>
            </div>
            <div style={s.pilotRight}>
              <p style={{ ...s.sectionEyebrow, marginBottom: '20px' }}>SUCCESS METRICS</p>
              {PILOT_METRICS.map((m, i) => (
                <div key={i} style={s.metricItem}>
                  <CheckCircle2 size={16} color="#00C48C" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={s.metricLabel}>{m.label}</div>
                    <div style={s.metricDesc}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Demo Video ───────────────────────────────────────── */}
      <section style={s.sectionAlt}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>PRODUCT DEMO</p>
          <h2 style={s.sectionTitle}>See it work in Urdu</h2>
          <p style={{ ...s.sectionIntro, maxWidth: '560px' }}>
            A 60–90 second walkthrough of a borrower interaction — from WhatsApp call initiation
            to consent confirmation.
          </p>
          {/* TODO: Replace this placeholder with the actual demo video file */}
          <div style={s.videoWrap}>
            <div style={s.videoPoster} aria-label="Demo video placeholder">
              <div style={s.playBtn}>
                <Play size={28} color="#000" fill="#000" />
              </div>
              <p style={s.videoNote}>
                Demo video — recording in progress
                {/* TODO: insert <video> or <iframe> here once demo is recorded */}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Founder ──────────────────────────────────────────── */}
      <section style={s.section}>
        <div style={s.container}>
          <p style={s.sectionEyebrow}>THE BUILDER</p>
          <div style={s.founderCard}>
            <img
              src="/founder.jpg"
              alt="Saeed Ahmad, founder of Havro"
              style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.10)' }}
            />
            <div style={s.founderText}>
              <h3 style={s.founderName}>Saeed Ahmad</h3>
              <p style={s.founderTitle}>Founder, Havro</p>
              <p style={s.founderBio}>
                Self-funded. Built the full stack — voice AI, WhatsApp delivery, and multilingual
                support. Founder of Build Edge Contracting WLL and Prime Stone Trading WLL (Qatar).
                Havro is built from direct exposure to the informal lending and labour markets
                across South Asia and the Gulf.
              </p>
              <a
                href="https://www.linkedin.com/in/saeed-ahmad-273a17225?trk=contact-info"
                style={s.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn profile →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact CTA ──────────────────────────────────────── */}
      <section style={s.sectionAlt}>
        <div style={{ ...s.container, textAlign: 'center', maxWidth: '620px' }}>
          <h2 style={{ ...s.sectionTitle, marginBottom: '16px' }}>Ready to discuss a pilot?</h2>
          <p style={{ fontSize: '16px', color: '#606060', lineHeight: 1.7, marginBottom: '36px' }}>
            One email. No sales funnel. If Voice Loan Shield fits your institution's compliance
            and inclusion priorities, we'll schedule a call and scope a pilot together.
          </p>
          <a href="mailto:saeed@havro.app?subject=MFI%20Pilot%20Inquiry" style={s.ctaBtnLarge}>
            Discuss a pilot — saeed@havro.app
          </a>
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
      'radial-gradient(ellipse at 15% 50%, rgba(0,196,140,0.08) 0%, transparent 60%)',
      'radial-gradient(ellipse at 85% 30%, rgba(10,132,255,0.05) 0%, transparent 60%)',
    ].join(', '),
  },
  heroInner: {
    position: 'relative', zIndex: 1,
    maxWidth: '740px', margin: '0 auto', textAlign: 'center',
  },
  eyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#00C48C', textTransform: 'uppercase', marginBottom: '16px',
  },
  headline: {
    fontFamily: "'Inter', sans-serif", fontWeight: 800,
    fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.03em',
    lineHeight: 1.06, color: '#F5F5F5', marginBottom: '20px',
  },
  subheadline: {
    fontSize: 'clamp(16px, 2vw, 19px)', color: '#A0A0A0',
    lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 36px',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    height: '48px', padding: '0 32px',
    background: '#00C48C', color: '#000', border: 'none', borderRadius: '8px',
    fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600,
    textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s ease',
    letterSpacing: '-0.01em',
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
  container: { maxWidth: '900px', margin: '0 auto' },
  sectionEyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#606060', textTransform: 'uppercase', marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em',
    color: '#F5F5F5', marginBottom: '24px',
  },
  sectionIntro: {
    fontSize: '16px', color: '#808080', lineHeight: 1.7,
    marginBottom: '48px', maxWidth: '720px',
  },

  problemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  problemCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '28px 24px',
  },
  problemNum: {
    fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 800,
    color: 'rgba(0,196,140,0.22)', letterSpacing: '-0.04em', marginBottom: '16px',
  },
  problemTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    color: '#F5F5F5', marginBottom: '10px', letterSpacing: '-0.01em',
  },
  problemBody: { fontSize: '14px', color: '#606060', lineHeight: 1.7 },

  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  stepCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '28px 24px',
  },
  stepIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNum: {
    fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 800,
    letterSpacing: '-0.04em', lineHeight: 1,
  },
  stepTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    color: '#F5F5F5', marginBottom: '10px', letterSpacing: '-0.01em',
  },
  stepBody: { fontSize: '14px', color: '#606060', lineHeight: 1.7 },

  pilotLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  pilotLeft: {},
  pilotRight: {},
  pilotBody: {
    fontSize: '15px', color: '#A0A0A0', lineHeight: 1.75,
    marginBottom: '24px',
  },
  pilotDetails: {
    display: 'flex', flexDirection: 'column', gap: '0',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden',
  },
  pilotDetail: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  pilotDetailLabel: { fontSize: '13px', color: '#606060', fontWeight: 500 },
  pilotDetailVal: { fontSize: '13px', color: '#F5F5F5', fontWeight: 600 },

  metricItem: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px', marginBottom: '10px',
  },
  metricLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '14px',
    color: '#F5F5F5', fontWeight: 500, marginBottom: '3px',
  },
  metricDesc: { fontSize: '12px', color: '#606060', lineHeight: 1.5 },

  videoWrap: { maxWidth: '700px', margin: '0 auto' },
  videoPoster: {
    width: '100%', aspectRatio: '16 / 9',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '16px',
    cursor: 'default',
    position: 'relative',
  },
  playBtn: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#00C48C',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0.7,
  },
  videoNote: {
    fontSize: '13px', color: '#606060',
    fontFamily: "'Inter', sans-serif", textAlign: 'center',
  },

  founderCard: {
    display: 'flex', alignItems: 'flex-start', gap: '40px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '40px',
    flexWrap: 'wrap',
  },
  founderPhoto: {
    width: '120px', height: '120px', flexShrink: 0,
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  founderPhotoText: { fontSize: '12px', color: '#606060', fontFamily: "'Inter', sans-serif" },
  founderText: { flex: 1, minWidth: '240px' },
  founderName: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px',
    color: '#F5F5F5', marginBottom: '4px', letterSpacing: '-0.02em',
  },
  founderTitle: {
    fontSize: '14px', color: '#00C48C', fontWeight: 500, marginBottom: '16px',
  },
  founderBio: {
    fontSize: '15px', color: '#808080', lineHeight: 1.75, marginBottom: '20px',
  },
  linkedinLink: {
    fontSize: '14px', color: '#0A84FF', fontWeight: 500,
    textDecoration: 'none', fontFamily: "'Inter', sans-serif",
  },

  ctaBtnLarge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    height: '52px', padding: '0 36px',
    background: '#00C48C', color: '#000', border: 'none', borderRadius: '8px',
    fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600,
    textDecoration: 'none', cursor: 'pointer',
    letterSpacing: '-0.01em',
  },
};
