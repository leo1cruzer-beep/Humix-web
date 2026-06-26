import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Briefcase, Gem, Pencil, Heart, Users, ArrowRight,
  Smartphone, Phone, GraduationCap, Scale, Shield, Fingerprint,
  CheckCircle2, Globe, User, Wifi,
} from 'lucide-react';

/* ─── Count-up animation hook ────────────────────────────────────── */
function useCountUp(target, decimals = 0, duration = 2200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = eased * target;
            setCount(decimals > 0 ? parseFloat(cur.toFixed(decimals)) : Math.floor(cur));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, duration]);

  return [count, ref];
}

/* ─── Static data ────────────────────────────────────────────────── */
const SERVICE_CARDS = [
  { id: 'life-assistant', label: 'Life Assistant', desc: 'Health checks, legal docs & daily guidance',       Icon: Heart,      to: '/life-assistant', color: '#00C48C' },
  { id: 'finance',        label: 'Finance',        desc: 'Smart budgeting, debt payoff & wealth tools',      Icon: TrendingUp, to: '/finance',        color: '#FFB340' },
  { id: 'career',         label: 'Career',         desc: 'AI résumés, interview prep & salary insights',     Icon: Briefcase,  to: '/career',         color: '#0A84FF' },
  { id: 'business',       label: 'Business',       desc: 'Business plans, pitch decks & market research',    Icon: Gem,        to: '/business',       color: '#FF6B35' },
  { id: 'creative',       label: 'Creative',       desc: 'Content writing, social media & brand voice',      Icon: Pencil,     to: '/creative',       color: '#BF5AF2' },
  { id: 'community',      label: 'Community',      desc: 'Connect with 24K+ members worldwide',              Icon: Users,      to: '/community',      color: '#FF375F' },
];

const STEPS = [
  { n: '1', title: 'Choose a service', desc: 'Pick from finance, career, health, business, and more — all in one place.' },
  { n: '2', title: 'Describe your need', desc: 'Talk to AI in your language. No jargon, no barriers, no friction.' },
  { n: '3', title: 'Take action', desc: 'Get personalized guidance, tools, and plans you can use right now.' },
];

/* ─── Root component ─────────────────────────────────────────────── */
export default function HomePage({ onScanToEnter }) {
  const navigate = useNavigate();
  return (
    <main className="page-enter page-transition">
      <HeroSection onScanToEnter={onScanToEnter} />
      <ServiceCardsSection navigate={navigate} />
      <HowItWorksSection />
      <ProblemSection />
      <HowHumixWorksSection />
      <AgentModelSection navigate={navigate} />
      <ConnectivitySection />
      <ImpactNumbersSection />
      <VisionStatementSection onScanToEnter={onScanToEnter} navigate={navigate} />
      <HowToJoinSection onScanToEnter={onScanToEnter} />
    </main>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXISTING SECTIONS (unchanged)
══════════════════════════════════════════════════════════════════ */

function HeroSection({ onScanToEnter }) {
  const handleLearnMore = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={s.hero}>
      <div style={s.heroGradient} aria-hidden="true" />
      <div className="orb-wrap">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div style={s.heroInner}>
        <div style={s.eyebrow}>
          <span style={s.eyebrowDot} />
          <span style={s.eyebrowText}>HUMIX PLATFORM</span>
        </div>

        <h1 style={s.headline}>
          AI built for the world's<br />
          <span style={s.headlineAccent}>next billion.</span>
        </h1>

        <p style={s.sub}>
          Health advice, legal help, income tools, and more —<br />
          in your language, on any device.
        </p>

        <div style={s.ctaRow}>
          <button onClick={onScanToEnter} style={s.btnPrimary}>Get Started Free</button>
          <button onClick={handleLearnMore} style={s.btnGhost}>
            Learn More <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>

        <div style={s.trustRow}>
          <TrustItem value="4B+" label="people served" />
          <div style={s.trustDivider} />
          <TrustItem value="150+" label="countries" />
          <div style={s.trustDivider} />
          <TrustItem value="Free" label="forever" />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ value, label }) {
  return (
    <div style={s.trustItem}>
      <span style={s.trustValue}>{value}</span>
      <span style={s.trustLabel}>{label}</span>
    </div>
  );
}

function ServiceCardsSection({ navigate }) {
  return (
    <section id="services-section" style={s.cardsSection}>
      <div className="container">
        <div style={s.cardsSectionHeader}>
          <p style={s.sectionEyebrow}>EVERYTHING IN ONE PLACE</p>
          <h2 style={s.cardsSectionTitle}>Six tools. One platform.</h2>
          <p style={s.cardsSectionSub}>AI services built for real people with real needs.</p>
        </div>
        <div className="cat-grid" style={s.cardsGrid}>
          {SERVICE_CARDS.map(card => (
            <ServiceCard key={card.id} card={card} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ card, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => navigate(card.to)}
      style={{
        background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px', padding: '24px 20px', textAlign: 'left',
        cursor: 'pointer', transition: 'all 0.15s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
        display: 'flex', flexDirection: 'column', gap: '16px', width: '100%',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: card.color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <card.Icon size={20} color={card.color} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#F5F5F5', marginBottom: '6px', letterSpacing: '-0.01em' }}>
          {card.label}
        </h3>
        <p style={{ fontSize: '13px', color: '#A0A0A0', lineHeight: 1.6 }}>{card.desc}</p>
      </div>
      <span style={{
        fontSize: '16px',
        color: hov ? card.color : '#606060',
        transition: 'color 0.15s ease, transform 0.15s ease',
        display: 'inline-block',
        transform: hov ? 'translateX(3px)' : 'none',
      }}>→</span>
    </button>
  );
}

function HowItWorksSection() {
  return (
    <section style={s.howWrap}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={s.sectionEyebrow}>HOW IT WORKS</p>
          <h2 style={{ ...s.cardsSectionTitle, marginBottom: '12px' }}>Simple by design</h2>
          <p style={s.cardsSectionSub}>Three steps. No friction.</p>
        </div>
        <div className="steps-row" style={s.stepsRow}>
          {STEPS.map((step, i) => (
            <StepItem key={step.n} step={step} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, isLast }) {
  return (
    <div style={s.stepWrap}>
      <div style={s.stepContent}>
        <div style={s.stepBadge}>{step.n}</div>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#F5F5F5', margin: '18px 0 10px', letterSpacing: '-0.02em' }}>
          {step.title}
        </h3>
        <p style={{ fontSize: '14px', color: '#A0A0A0', lineHeight: 1.7 }}>{step.desc}</p>
      </div>
      {!isLast && <div className="step-connector" style={s.stepConnector} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NEW MISSION SECTIONS
══════════════════════════════════════════════════════════════════ */

/* ─── Section 1: The Problem ─────────────────────────────────────── */
function ProblemStatBlock({ number, decimals, suffix, label }) {
  const [count, ref] = useCountUp(number, decimals);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(36px, 5vw, 60px)',
        fontWeight: 800, letterSpacing: '-0.04em',
        color: '#F5F5F5', lineHeight: 1, marginBottom: '10px',
      }}>
        {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#606060', lineHeight: 1.5 }}>
        {label}
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section style={{ background: '#080809', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ ...s.sectionEyebrow, color: '#FF375F' }}>THE PROBLEM</p>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: 'clamp(26px, 4vw, 44px)', letterSpacing: '-0.03em',
            color: '#F5F5F5', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.15,
          }}>
            Billions of people are locked out of the modern world.
          </h2>
        </div>

        {/* Stat counters */}
        <div className="problem-stats-grid">
          <div><ProblemStatBlock number={1.5} decimals={1} suffix="B" label="People with no legal identity" /></div>
          <div><ProblemStatBlock number={400} decimals={0} suffix="M" label="Unbanked adults worldwide" /></div>
          <div><ProblemStatBlock number={3.5} decimals={1} suffix="B" label="Without quality healthcare access" /></div>
          <div><ProblemStatBlock number={700} decimals={0} suffix="M" label="Living on under $2 a day" /></div>
        </div>

        {/* Tagline */}
        <p style={{
          textAlign: 'center',
          fontSize: 'clamp(16px, 2.2vw, 22px)',
          color: '#A0A0A0', fontWeight: 400,
          letterSpacing: '-0.01em', lineHeight: 1.6,
        }}>
          They have phones. They have potential. They just need{' '}
          <span style={{ color: '#F5F5F5', fontWeight: 600 }}>access.</span>
        </p>
      </div>
    </section>
  );
}

/* ─── CSS Illustrations ──────────────────────────────────────────── */

function HealthIllustration() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <div style={{
        width: '180px', height: '300px', borderRadius: '24px',
        border: '2px solid rgba(0,196,140,0.35)', background: '#141415',
        padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px',
        boxShadow: '0 0 60px rgba(0,196,140,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        {/* Notch */}
        <div style={{ height: '4px', width: '40px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)', margin: '10px auto 6px', flexShrink: 0 }} />
        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(0,196,140,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Heart size={11} color="#00C48C" fill="rgba(0,196,140,0.4)" />
          </div>
          <div>
            <div style={{ height: '5px', width: '55px', borderRadius: '3px', background: 'rgba(255,255,255,0.25)', marginBottom: '4px' }} />
            <div style={{ height: '3px', width: '35px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
        {/* User bubble */}
        <div style={{ alignSelf: 'flex-end', background: 'rgba(0,196,140,0.14)', border: '1px solid rgba(0,196,140,0.22)', borderRadius: '10px 10px 2px 10px', padding: '6px 10px', maxWidth: '80%' }}>
          <div style={{ height: '3px', width: '88px', borderRadius: '2px', background: 'rgba(0,196,140,0.5)', marginBottom: '4px' }} />
          <div style={{ height: '3px', width: '60px', borderRadius: '2px', background: 'rgba(0,196,140,0.3)' }} />
        </div>
        {/* AI bubble */}
        <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px 10px 10px 2px', padding: '8px 10px', maxWidth: '90%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
            {/* Medical cross */}
            <div style={{ position: 'relative', width: '12px', height: '12px', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '5px', left: '0', width: '12px', height: '2px', background: '#00C48C', borderRadius: '1px' }} />
              <div style={{ position: 'absolute', top: '0', left: '5px', width: '2px', height: '12px', background: '#00C48C', borderRadius: '1px' }} />
            </div>
            <div style={{ height: '5px', width: '45px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div style={{ height: '3px', width: '100px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)', marginBottom: '4px' }} />
          <div style={{ height: '3px', width: '80px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: '4px' }} />
          <div style={{ height: '3px', width: '90px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
        </div>
        {/* User bubble 2 */}
        <div style={{ alignSelf: 'flex-end', background: 'rgba(0,196,140,0.1)', border: '1px solid rgba(0,196,140,0.18)', borderRadius: '10px 10px 2px 10px', padding: '5px 8px' }}>
          <div style={{ height: '3px', width: '64px', borderRadius: '2px', background: 'rgba(0,196,140,0.4)' }} />
        </div>
        {/* Input bar */}
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px 8px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ height: '3px', flex: 1, borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, background: '#00C48C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={10} color="#000" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalIllustration() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <div style={{ position: 'relative', width: '210px', height: '256px' }}>
        {/* Document */}
        <div style={{
          position: 'absolute', top: '24px', left: '24px',
          width: '158px', height: '200px', borderRadius: '12px',
          background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)',
          padding: '20px 16px',
          boxShadow: '6px 6px 24px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#0A84FF', flexShrink: 0 }} />
            <div style={{ height: '5px', width: '70px', borderRadius: '3px', background: 'rgba(255,255,255,0.35)' }} />
          </div>
          {[100, 85, 100, 70, 90, 55, 80, 65, 75, 45].map((w, i) => (
            <div key={i} style={{ height: '3px', width: `${w}%`, borderRadius: '2px', background: i % 5 === 4 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)', marginBottom: '7px' }} />
          ))}
        </div>
        {/* Shield */}
        <div style={{
          position: 'absolute', bottom: '0', right: '0',
          width: '70px', height: '70px', borderRadius: '16px',
          background: 'rgba(10,132,255,0.12)', border: '2px solid rgba(10,132,255,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(10,132,255,0.08)',
        }}>
          <Shield size={30} color="#0A84FF" strokeWidth={1.5} />
        </div>
        {/* Scales */}
        <div style={{
          position: 'absolute', top: '0', right: '0',
          width: '46px', height: '46px', borderRadius: '12px',
          background: 'rgba(255,179,64,0.12)', border: '1px solid rgba(255,179,64,0.26)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Scale size={20} color="#FFB340" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function IncomeIllustration() {
  const bars = [22, 36, 28, 50, 42, 66, 56, 86];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <div style={{
        width: '170px', height: '260px', borderRadius: '22px',
        border: '2px solid rgba(255,179,64,0.28)', background: '#141415',
        padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px',
        boxShadow: '0 0 50px rgba(255,179,64,0.07), 0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Notch */}
        <div style={{ height: '3px', width: '36px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)', margin: '0 auto 4px', flexShrink: 0 }} />
        {/* Chart */}
        <div style={{ flex: 1, background: 'rgba(255,179,64,0.04)', borderRadius: '10px', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ height: '4px', width: '48px', borderRadius: '2px', background: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: '9px', color: '#FFB340', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>↑ 24%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '88px' }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: '3px 3px 1px 1px',
                background: i === bars.length - 1
                  ? '#FFB340'
                  : `rgba(255,179,64,${0.15 + (i / bars.length) * 0.45})`,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
            {['$847', 'QAR 3K', '₦650K'].map((v, i) => (
              <span key={i} style={{ fontSize: '7px', color: i === 0 ? '#FFB340' : 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{v}</span>
            ))}
          </div>
        </div>
        {/* Currency coins */}
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexShrink: 0 }}>
          {['$', '€', '₦', '৳'].map((sym, i) => (
            <div key={i} style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'rgba(255,179,64,0.12)', border: '1px solid rgba(255,179,64,0.26)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', color: '#FFB340', fontWeight: 700, fontFamily: 'Inter, sans-serif',
            }}>{sym}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationIllustration() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <div style={{ position: 'relative', width: '220px', height: '220px' }}>
        {/* Book */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '8px',
          width: '140px', height: '170px', borderRadius: '4px 14px 14px 4px',
          background: 'linear-gradient(145deg, #1A1830, #13122A)',
          border: '1px solid rgba(191,90,242,0.26)', overflow: 'hidden',
          boxShadow: '6px 6px 24px rgba(0,0,0,0.6)',
        }}>
          {/* Spine */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px', background: 'rgba(191,90,242,0.22)', borderRight: '1px solid rgba(191,90,242,0.14)' }} />
          <div style={{ padding: '14px 10px 10px 22px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ height: '5px', width: '80%', borderRadius: '3px', background: 'rgba(255,255,255,0.3)', marginBottom: '4px' }} />
            {[90, 70, 85, 60, 78, 50, 70, 40, 65].map((w, i) => (
              <div key={i} style={{ height: '3px', width: `${w}%`, borderRadius: '2px', background: i % 4 === 3 ? 'rgba(191,90,242,0.22)' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>
        {/* Graduation cap */}
        <div style={{
          position: 'absolute', top: '0', right: '0',
          width: '76px', height: '76px', borderRadius: '18px',
          background: 'rgba(191,90,242,0.12)', border: '1px solid rgba(191,90,242,0.24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GraduationCap size={34} color="#BF5AF2" strokeWidth={1.4} />
        </div>
        {/* Circuit dots */}
        {[{ top: '38px', right: '28px' }, { top: '56px', right: '8px' }, { top: '20px', right: '48px' }].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(191,90,242,0.7)' }} />
        ))}
        {/* Circuit lines */}
        <div style={{ position: 'absolute', top: '40px', right: '30px', width: '42px', height: '1px', background: 'linear-gradient(to right, rgba(191,90,242,0.4), transparent)' }} />
        <div style={{ position: 'absolute', top: '40px', right: '72px', width: '1px', height: '18px', background: 'linear-gradient(to bottom, rgba(191,90,242,0.4), transparent)' }} />
      </div>
    </div>
  );
}

/* ─── Section 2: How Humix Works ─────────────────────────────────── */
const WORK_CARDS = [
  {
    eyebrow: 'HEALTH', color: '#00C48C',
    title: 'A doctor in your pocket',
    body: 'Describe your symptoms in Urdu, Punjabi, Arabic, or English. Get immediate triage advice, medicine guidance, and directions to the nearest verified clinic — even offline.',
    stat: '300M+ people lack access to a doctor within 5km',
    Illustration: HealthIllustration,
  },
  {
    eyebrow: 'LEGAL', color: '#0A84FF', flip: true,
    title: 'Know your rights. Protect your family.',
    body: 'From worker rights in Qatar to land disputes in Nigeria — get clear legal guidance in your language without paying for a lawyer.',
    stat: '60% of the world\'s poor face at least one legal problem per year',
    Illustration: LegalIllustration,
  },
  {
    eyebrow: 'INCOME', color: '#FFB340',
    title: 'Earn in dollars. Live anywhere.',
    body: 'Micro-tasks, freelance skills, remote jobs — Humix guides you step by step to earning income online regardless of where you are.',
    stat: '200M+ informal workers have zero access to digital income opportunities',
    Illustration: IncomeIllustration,
  },
  {
    eyebrow: 'EDUCATION', color: '#BF5AF2', flip: true,
    title: 'Learn a skill. Change your life.',
    body: '30-day learning paths in local languages. From basic literacy to job-ready skills — education that fits around your life, not the other way around.',
    stat: '750M adults worldwide cannot read or write',
    Illustration: EducationIllustration,
  },
];

function HowHumixWorksSection() {
  return (
    <section style={{ background: '#0C0C0D', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p style={s.sectionEyebrow}>HOW HUMIX WORKS</p>
          <h2 style={{ ...s.cardsSectionTitle, fontSize: 'clamp(26px, 4vw, 44px)', marginBottom: '14px' }}>
            One platform. Every need.
          </h2>
          <p style={{ fontSize: '17px', color: '#606060', maxWidth: '460px', margin: '0 auto' }}>
            Available in your language, on any phone, even offline.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
          {WORK_CARDS.map((card, i) => (
            <WorkCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ card }) {
  return (
    <div className={`alt-row${card.flip ? ' flip' : ''}`}>
      {/* Illustration always first in DOM → top on mobile */}
      <div className="alt-col" style={{ display: 'flex', justifyContent: 'center' }}>
        <card.Illustration />
      </div>
      {/* Text */}
      <div className="alt-col">
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em', color: card.color, textTransform: 'uppercase', marginBottom: '12px' }}>
          {card.eyebrow}
        </p>
        <h3 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 700,
          fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.02em',
          color: '#F5F5F5', marginBottom: '16px', lineHeight: 1.2,
        }}>{card.title}</h3>
        <p style={{ fontSize: '16px', color: '#A0A0A0', lineHeight: 1.7, marginBottom: '24px' }}>
          {card.body}
        </p>
        {/* Impact stat pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'flex-start', gap: '10px',
          background: card.color + '0f', border: `1px solid ${card.color}28`,
          borderRadius: '10px', padding: '12px 16px',
        }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: card.color, flexShrink: 0, marginTop: '5px' }} />
          <span style={{ fontSize: '13px', color: '#A0A0A0', lineHeight: 1.5 }}>{card.stat}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Section 3: The Agent Model ─────────────────────────────────── */
const FLOW_STEPS = [
  { label: 'Village Agent',              icon: <User size={20} color="#00C48C" strokeWidth={1.8} /> },
  { label: 'Registers community' },
  { label: 'Helps with consultations' },
  { label: 'Earns commission' },
  { label: 'Grows network' },
];

const AGENT_COLS = [
  {
    icon: <User size={26} color="#00C48C" strokeWidth={1.5} />,
    title: 'The Agent',
    points: [
      'A teacher, imam, or community leader downloads Humix',
      'They become the access point for everyone around them',
      'They earn $0.25 per registration, $0.10 per consultation',
    ],
  },
  {
    icon: <Users size={26} color="#00C48C" strokeWidth={1.5} />,
    title: 'The Community',
    points: [
      'Families get health advice, legal help, income guidance',
      'No smartphone required — agent uses theirs',
      'Builds trust through familiar faces',
    ],
  },
  {
    icon: <Globe size={26} color="#00C48C" strokeWidth={1.5} />,
    title: 'The Network',
    points: [
      'Each agent registers 50–200 people',
      'Word of mouth grows the network organically',
      'Connected communities educate each other',
    ],
  },
];

function AgentModelSection({ navigate }) {
  return (
    <section style={{
      background: 'rgba(0,196,140,0.018)',
      borderTop: '1px solid rgba(0,196,140,0.08)',
      borderBottom: '1px solid rgba(0,196,140,0.08)',
      padding: '100px 0',
    }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ ...s.sectionEyebrow, color: '#00C48C' }}>THE DISTRIBUTION MODEL</p>
          <h2 style={{ ...s.cardsSectionTitle, fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: '14px' }}>
            The village agent — Humix's distribution model
          </h2>
          <p style={{ fontSize: '17px', color: '#606060', maxWidth: '480px', margin: '0 auto' }}>
            One person with a smartphone can change an entire community
          </p>
        </div>

        {/* Horizontal flow diagram */}
        <div className="flow-scroll">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '120px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(0,196,140,0.10)', border: '1px solid rgba(0,196,140,0.24)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.icon || <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C48C' }} />}
                </div>
                <span style={{ fontSize: '11px', color: '#A0A0A0', textAlign: 'center', fontWeight: 500, lineHeight: 1.4, maxWidth: '90px' }}>
                  {step.label}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ width: '48px', flexShrink: 0, height: '1px', background: 'linear-gradient(to right, rgba(0,196,140,0.5), rgba(0,196,140,0.2))', position: 'relative', marginBottom: '24px' }}>
                  {/* Arrow head */}
                  <div style={{
                    position: 'absolute', right: '-5px', top: '-4px',
                    borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
                    borderLeft: '7px solid rgba(0,196,140,0.5)',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Three columns */}
        <div className="agent-cols" style={{ marginTop: '64px' }}>
          {AGENT_COLS.map((col, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '28px 24px',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'rgba(0,196,140,0.10)', border: '1px solid rgba(0,196,140,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
              }}>
                {col.icon}
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F5F5F5', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                {col.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.points.map((pt, j) => (
                  <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00C48C', flexShrink: 0, marginTop: '7px' }} />
                    <p style={{ fontSize: '14px', color: '#A0A0A0', lineHeight: 1.6, margin: 0 }}>{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <button
            onClick={() => navigate('/agent/register')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '8px',
              background: '#00C48C', color: '#000', border: 'none',
              fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '-0.01em',
            }}
          >
            Become an Agent <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: Connectivity Vision ────────────────────────────── */
const CONNECTIVITY_TIERS = [
  {
    Icon: <Phone size={28} color="#606060" strokeWidth={1.5} />,
    title: 'Feature phones',
    body: 'IVR voice calls and SMS. No smartphone needed. No internet needed. Just a basic phone.',
    badge: 'Coming Soon',
    badgeColor: '#606060',
    badgeBg: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  {
    Icon: <Wifi size={28} color="#FFB340" strokeWidth={1.5} />,
    title: 'Village Starlink Hub',
    body: 'One Starlink connection shared by the whole village. The agent\'s hub becomes the community\'s gateway.',
    badge: 'Pilot Planning',
    badgeColor: '#FFB340',
    badgeBg: 'rgba(255,179,64,0.08)',
    borderColor: 'rgba(255,179,64,0.15)',
  },
  {
    Icon: <Smartphone size={28} color="#00C48C" strokeWidth={1.5} />,
    title: 'Mobile App',
    body: 'For those with smartphones — full Humix experience, biometric identity, all services.',
    badge: 'Live Now',
    badgeColor: '#00C48C',
    badgeBg: 'rgba(0,196,140,0.08)',
    borderColor: 'rgba(0,196,140,0.18)',
  },
];

function ConnectivitySection() {
  return (
    <section style={{ background: '#080809', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={s.sectionEyebrow}>ACCESS FOR ALL</p>
          <h2 style={{ ...s.cardsSectionTitle, fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: '14px' }}>
            Reaching the truly unreachable
          </h2>
          <p style={{ fontSize: '17px', color: '#606060', maxWidth: '440px', margin: '0 auto' }}>
            Where there's no internet, we find another way
          </p>
        </div>

        <div className="connectivity-cols">
          {CONNECTIVITY_TIERS.map((tier, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {tier.Icon}
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F5F5F5', letterSpacing: '-0.01em' }}>
                {tier.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#606060', lineHeight: 1.65, flex: 1 }}>{tier.body}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: tier.badgeBg, border: `1px solid ${tier.borderColor}`,
                borderRadius: '6px', padding: '5px 12px', width: 'fit-content',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tier.badgeColor, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: tier.badgeColor, fontFamily: 'Inter, sans-serif' }}>
                  {tier.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: Impact Numbers ─────────────────────────────────── */
const IMPACT_STATS = [
  { value: 4,   suffix: 'B+', decimals: 0, label: "People we're building for",      isStatic: false },
  { value: 5,   suffix: '',   decimals: 0, label: 'Services available today',        isStatic: false },
  { value: 3,   suffix: '',   decimals: 0, label: 'Languages supported (growing)',   isStatic: false },
  { display: '$0',             label: 'Cost to users',                               isStatic: true  },
  { value: 150, suffix: '+',  decimals: 0, label: 'Countries accessible',            isStatic: false },
  { display: '24/7',           label: 'AI availability',                             isStatic: true  },
];

function ImpactStatItem({ stat }) {
  const [count, ref] = useCountUp(stat.isStatic ? 0 : stat.value, stat.decimals || 0);
  return (
    <div ref={stat.isStatic ? undefined : ref} style={{ textAlign: 'center', padding: '8px 4px' }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(36px, 5vw, 56px)',
        fontWeight: 800, letterSpacing: '-0.04em',
        color: '#00C48C', lineHeight: 1, marginBottom: '10px',
      }}>
        {stat.isStatic ? stat.display : `${count}${stat.suffix}`}
      </div>
      <div style={{ fontSize: '14px', color: '#606060', fontWeight: 400, lineHeight: 1.4 }}>
        {stat.label}
      </div>
    </div>
  );
}

function ImpactNumbersSection() {
  return (
    <section style={{ background: '#0C0C0D', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={s.sectionEyebrow}>BY THE NUMBERS</p>
          <h2 style={{ ...s.cardsSectionTitle, fontSize: 'clamp(24px, 4vw, 40px)' }}>
            The mission in numbers
          </h2>
        </div>
        <div className="impact-grid-6">
          {IMPACT_STATS.map((stat, i) => (
            <ImpactStatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Vision Statement ───────────────────────────────── */
function VisionStatementSection({ onScanToEnter, navigate }) {
  return (
    <section style={{ background: '#080809', padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner" style={{ maxWidth: '860px' }}>
        {/* Opening quote mark */}
        <div style={{
          fontSize: '96px', color: 'rgba(0,196,140,0.12)',
          fontFamily: 'Georgia, serif', lineHeight: 0.8,
          textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.04em',
        }}>"</div>
        <blockquote style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(17px, 2.2vw, 24px)',
          fontWeight: 400, lineHeight: 1.7,
          color: '#F5F5F5', textAlign: 'center',
          margin: '0 0 28px', letterSpacing: '-0.01em',
        }}>
          Every child born in a rural village deserves the same access to health advice, legal protection, and economic opportunity as someone born in New York or London. Humix is how we bridge that gap —{' '}
          <span style={{ color: '#00C48C', fontWeight: 600 }}>one village, one agent, one family at a time.</span>
        </blockquote>
        <p style={{
          textAlign: 'center', fontSize: '12px', color: '#606060',
          fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: '56px',
        }}>— The Humix Mission</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onScanToEnter}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '8px',
              background: '#00C48C', color: '#000', border: 'none',
              fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Join as User
          </button>
          <button
            onClick={() => navigate('/agent/register')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '8px',
              background: 'transparent', color: '#F5F5F5',
              border: '1px solid rgba(255,255,255,0.16)',
              fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Become an Agent <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: How To Join ─────────────────────────────────────── */
const JOIN_STEPS = [
  {
    Icon: <Smartphone size={28} color="#00C48C" strokeWidth={1.5} />,
    title: 'Download or open humix.app',
    desc: 'Works on any phone, any browser. No app store required.',
  },
  {
    Icon: <Fingerprint size={28} color="#00C48C" strokeWidth={1.5} />,
    title: 'Scan your face to create your identity',
    desc: 'One biometric scan. No passwords, no forms, no friction.',
  },
  {
    Icon: <CheckCircle2 size={28} color="#00C48C" strokeWidth={1.5} />,
    title: 'Access all services instantly — free',
    desc: 'Health, legal, finance, career, and more. All free, forever.',
  },
];

function HowToJoinSection({ onScanToEnter }) {
  return (
    <section style={{ background: '#0C0C0D', padding: '100px 0 120px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="mission-inner">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={s.sectionEyebrow}>GET STARTED</p>
          <h2 style={{ ...s.cardsSectionTitle, fontSize: 'clamp(24px, 4vw, 40px)' }}>
            Get started in 60 seconds
          </h2>
        </div>

        <div className="join-row">
          {JOIN_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', position: 'relative' }}>
              {/* Step number bubble */}
              <div style={{
                position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-34px)',
                width: '22px', height: '22px', borderRadius: '50%',
                background: '#00C48C', color: '#000',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>{i + 1}</div>
              {/* Icon box */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'rgba(0,196,140,0.08)', border: '1px solid rgba(0,196,140,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '16px',
              }}>
                {step.Icon}
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px', color: '#F5F5F5', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#606060', lineHeight: 1.6, maxWidth: '240px' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', marginTop: '72px' }}>
          <button
            onClick={onScanToEnter}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 40px', borderRadius: '8px',
              background: '#00C48C', color: '#000', border: 'none',
              fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '-0.01em',
            }}
          >
            Start Now — It's Free <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Style tokens ────────────────────────────────────────────────── */
const s = {
  hero: {
    minHeight: '100vh',
    background: [
      'radial-gradient(ellipse at 20% 50%, rgba(0,196,140,0.08) 0%, transparent 60%)',
      'radial-gradient(ellipse at 80% 20%, rgba(10,132,255,0.06) 0%, transparent 60%)',
      '#0C0C0D',
    ].join(', '),
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    paddingTop: '100px', paddingBottom: '80px',
    position: 'relative', overflow: 'hidden',
  },
  heroGradient: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 },
  heroInner: {
    position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto',
    padding: '0 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' },
  eyebrowDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#00C48C', display: 'inline-block', flexShrink: 0 },
  eyebrowText: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em', color: '#00C48C', textTransform: 'uppercase' },
  headline: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: '-0.03em',
    lineHeight: 1.08, color: '#F5F5F5', marginBottom: '20px',
  },
  headlineAccent: { color: '#F5F5F5' },
  sub: {
    fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400,
    color: '#A0A0A0', lineHeight: 1.65, maxWidth: '560px', marginBottom: '40px',
  },
  ctaRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: '#00C48C', color: '#000', border: 'none',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.15s ease', letterSpacing: '-0.01em',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '8px',
    background: 'transparent', color: '#F5F5F5',
    border: '1px solid rgba(255,255,255,0.16)',
    fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500,
    cursor: 'pointer', transition: 'border-color 0.15s ease, background 0.15s ease',
  },
  trustRow: { display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' },
  trustDivider: { width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' },
  trustItem: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' },
  trustValue: { fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F5F5F5', letterSpacing: '-0.02em' },
  trustLabel: { fontSize: '13px', fontWeight: 400, color: '#606060' },
  cardsSection: { background: '#0C0C0D', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' },
  cardsSectionHeader: { textAlign: 'center', marginBottom: '48px' },
  sectionEyebrow: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em', color: '#606060', textTransform: 'uppercase', marginBottom: '12px' },
  cardsSectionTitle: {
    fontFamily: "'Inter', sans-serif", fontWeight: 700,
    fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em', color: '#F5F5F5', marginBottom: '10px',
  },
  cardsSectionSub: { fontSize: '16px', color: '#606060', fontWeight: 400 },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  howWrap: { background: '#0A0A0B', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' },
  stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' },
  stepWrap: { display: 'flex', alignItems: 'flex-start', position: 'relative' },
  stepContent: { flex: 1, padding: '0 40px 0 0' },
  stepBadge: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'rgba(0,196,140,0.10)', border: '1px solid rgba(0,196,140,0.20)',
    color: '#00C48C', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepConnector: {
    position: 'absolute', top: '20px', right: '-16px',
    width: '32px', borderTop: '1px dashed rgba(255,255,255,0.10)', zIndex: 1,
  },
};
