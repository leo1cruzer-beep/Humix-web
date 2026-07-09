import { useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Mic, FileCheck } from 'lucide-react';

const FEATURES = [
  {
    Icon: Phone,
    color: '#00C48C',
    title: "Speaks the borrower's language",
    body: 'Natural Urdu voice, built for feature phones and low-literacy users. No app. No reading required.',
  },
  {
    Icon: Mic,
    color: '#0A84FF',
    title: 'Verifies real understanding',
    body: 'Terms are read aloud in full, with confirmation captured — not a checkbox, an actual verbal yes.',
  },
  {
    Icon: FileCheck,
    color: '#FFB340',
    title: 'Audit-ready by default',
    body: 'Every consent session is logged with timestamps. Exportable evidence for SBP and SECP consumer protection requirements.',
  },
];

const HOW_STEPS = [
  {
    num: '1',
    title: 'Trigger',
    body: 'Your loan officer initiates a consent call at disbursement — from the field, the branch, or automatically from your LOS.',
  },
  {
    num: '2',
    title: 'Explain',
    body: 'The voice agent walks the borrower through every material term in Urdu, at a pace built for comprehension, not compliance theater.',
  },
  {
    num: '3',
    title: 'Confirm',
    body: 'The borrower gives verbal consent. The agent verifies the response and flags hesitation or confusion for human follow-up.',
  },
  {
    num: '4',
    title: 'Log',
    body: 'A complete consent record — audio, transcript, timestamp — lands in your audit trail. Retrievable in seconds, years later.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <main style={{ background: '#0C0C0D', minHeight: '100vh' }}>
      <HeroSection navigate={navigate} />
      <ProblemSection />
      <ProductSection navigate={navigate} />
      <HowItWorksSection />
      <LiveDemoSection navigate={navigate} />
      <ComplianceSection />
      <PilotSection />
      <FounderSection />
    </main>
  );
}

function HeroSection({ navigate }) {
  return (
    <section style={{
      background: [
        'radial-gradient(ellipse at 15% 50%, rgba(0,196,140,0.08) 0%, transparent 60%)',
        'radial-gradient(ellipse at 85% 30%, rgba(10,132,255,0.05) 0%, transparent 60%)',
        '#080809',
      ].join(', '),
      padding: '120px 24px 100px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <p style={s.eyebrow}>HAVRO PLATFORM</p>
        <h1 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 800,
          fontSize: 'clamp(36px, 6vw, 68px)', letterSpacing: '-0.03em',
          lineHeight: 1.06, color: '#F5F5F5', marginBottom: '24px',
        }}>
          Voice AI infrastructure for microfinance.
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)', color: '#A0A0A0',
          lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 40px',
        }}>
          Verbal consent, borrower protection, and compliance audit trails — delivered in Urdu, over any phone. Built for MFIs serving low-literacy borrowers in Pakistan.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/mfi')} style={s.btnPrimary}>
            See Voice Loan Shield <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <button onClick={() => navigate('/life-assistant')} style={s.btnGhost}>
            Try the live demo
          </button>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section style={s.section}>
      <div style={s.container}>
        <p style={{ ...s.eyebrow, color: '#FF375F' }}>THE PROBLEM</p>
        <h2 style={s.sectionTitle}>
          Your borrowers can't read the fine print. Regulators know it.
        </h2>
        <div style={{ maxWidth: '700px' }}>
          <p style={s.bodyText}>
            Millions of microfinance borrowers in Pakistan sign loan agreements they cannot read. Thumbprints on paper prove nothing about understanding — and when disputes reach SECP or SBP consumer protection review, "she signed the form" is not a defense.
          </p>
          <p style={{ ...s.bodyText, marginBottom: 0 }}>
            Field officers explain terms verbally today. But nothing captures that moment. No record. No proof. No protection — for the borrower or for you.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductSection({ navigate }) {
  return (
    <section style={s.sectionAlt}>
      <div style={s.container}>
        <p style={s.eyebrow}>VOICE LOAN SHIELD</p>
        <h2 style={s.sectionTitle}>
          Voice Loan Shield: verbal consent, verified and logged.
        </h2>
        <p style={{ ...s.bodyText, maxWidth: '680px', marginBottom: '48px' }}>
          An AI voice agent explains the loan terms to the borrower in clear, natural Urdu — the amount, the installments, the total repayment, the consequences of default. Then it asks for consent, records the response, and writes a timestamped consent log your compliance team can produce on demand.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '48px',
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={s.card}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: f.color + '14', border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <f.Icon size={20} color={f.color} strokeWidth={1.8} />
              </div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardBody}>{f.body}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/mfi')} style={s.linkBtn}>
          Explore Voice Loan Shield for your institution <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section style={s.section}>
      <div style={s.container}>
        <p style={s.eyebrow}>HOW IT WORKS</p>
        <h2 style={s.sectionTitle}>
          From disbursement queue to consent log in one call.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {HOW_STEPS.map((step) => (
            <div key={step.num} style={s.card}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(0,196,140,0.10)', border: '1px solid rgba(0,196,140,0.24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
                fontFamily: "'Inter', sans-serif", fontWeight: 700,
                fontSize: '16px', color: '#00C48C',
              }}>
                {step.num}
              </div>
              <h3 style={s.cardTitle}>{step.title}</h3>
              <p style={s.cardBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDemoSection({ navigate }) {
  return (
    <section style={s.sectionAlt}>
      <div style={{ ...s.container, textAlign: 'center', maxWidth: '620px' }}>
        <p style={s.eyebrow}>THE TECHNOLOGY</p>
        <h2 style={s.sectionTitle}>Hear the engine yourself.</h2>
        <p style={{ ...s.bodyText, marginBottom: '36px' }}>
          This browser demo runs on the same voice engine that powers our IVR and SMS workflows for feature-phone users. What you experience here in the browser, a borrower experiences on a ten-year-old Nokia — same understanding, same natural Urdu, no smartphone required.
        </p>
        <button onClick={() => navigate('/life-assistant')} style={s.btnPrimary}>
          Launch live demo
        </button>
      </div>
    </section>
  );
}

function ComplianceSection() {
  return (
    <section style={s.section}>
      <div style={{ ...s.container, maxWidth: '720px' }}>
        <p style={s.eyebrow}>REGULATORY FIT</p>
        <h2 style={s.sectionTitle}>
          Built for the regulatory environment you actually operate in.
        </h2>
        <p style={{ ...s.bodyText, marginBottom: 0 }}>
          Havro is designed around SBP consumer protection expectations and SECP conduct requirements for lending to vulnerable borrowers. Consent logs are structured as evidence: what was said, what was agreed, when, and by whom. When a regulator or auditor asks how your institution ensures informed consent from borrowers who cannot read — you show them, in one click.
        </p>
      </div>
    </section>
  );
}

function PilotSection() {
  return (
    <section style={s.sectionAlt}>
      <div style={{ ...s.container, maxWidth: '720px' }}>
        <p style={s.eyebrow}>GET STARTED</p>
        <h2 style={s.sectionTitle}>Run a 90-day pilot with your portfolio.</h2>
        <p style={{ ...s.bodyText, marginBottom: '36px' }}>
          We deploy Voice Loan Shield with a single branch or lending product, integrate with your existing disbursement workflow, and measure what matters: consent completion rates, borrower comprehension, dispute reduction, and audit readiness. No long-term commitment. Your compliance team gets full access to every log from day one.
        </p>
        <a
          href="mailto:saeed@havro.app?subject=MFI%20Pilot%20Inquiry"
          style={s.btnPrimary}
        >
          Discuss a pilot <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section style={s.section}>
      <div style={s.container}>
        <p style={s.eyebrow}>THE BUILDER</p>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '40px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '40px',
          flexWrap: 'wrap',
        }}>
          <img
            src="/founder.jpg"
            alt="Saeed Ahmad, founder of Havro"
            style={{
              width: '120px', height: '120px', flexShrink: 0,
              borderRadius: '16px', objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h2 style={{ ...s.sectionTitle, marginBottom: '4px' }}>
              Built by an operator, not a lab.
            </h2>
            <p style={{ fontSize: '14px', color: '#00C48C', fontWeight: 500, marginBottom: '16px' }}>
              Saeed Ahmad · Founder, Havro
            </p>
            <p style={{ ...s.bodyText, marginBottom: '20px' }}>
              Havro is built by a founder with fifteen years of operating experience across multiple markets, focused on one problem: making financial services safe and comprehensible for people the system was never designed to include.
            </p>
            <a
              href="https://www.linkedin.com/in/saeed-ahmad-273a17225?trk=contact-info"
              style={{ fontSize: '14px', color: '#0A84FF', fontWeight: 500, textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn profile →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const s = {
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
  eyebrow: {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em',
    color: '#606060', textTransform: 'uppercase', marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em',
    color: '#F5F5F5', marginBottom: '24px', lineHeight: 1.2,
  },
  bodyText: {
    fontSize: '16px', color: '#808080', lineHeight: 1.75, marginBottom: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '28px 24px',
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px',
    color: '#F5F5F5', marginBottom: '10px', letterSpacing: '-0.01em',
  },
  cardBody: { fontSize: '14px', color: '#606060', lineHeight: 1.7 },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: '#00C48C', color: '#000', border: 'none',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', textDecoration: 'none', letterSpacing: '-0.01em',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: 'transparent', color: '#F5F5F5',
    border: '1px solid rgba(255,255,255,0.16)',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
    cursor: 'pointer', letterSpacing: '-0.01em',
  },
  linkBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
    color: '#00C48C', letterSpacing: '-0.01em',
  },
};
