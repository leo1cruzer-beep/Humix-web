import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const FREE_FEATURES = [
  '3 AI tools',
  '5 messages/day',
  'Community access',
  'Basic Career tools',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited AI tools',
  'Priority support',
  'Advanced Finance tools',
  'Companion memory',
  'Career Pro badge',
];

const BUSINESS_FEATURES = [
  'Everything in Pro',
  'Team workspace',
  'API access',
  'Custom AI workflows',
  'White-label tools',
  'Dedicated account manager',
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees and you keep access until the end of your billing period.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: "Your data is always yours. If you downgrade to Free, your history and saved content remain accessible, though you'll lose access to Pro-only features.",
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! All new users get a 14-day free trial of Pro when they sign up. No credit card required to start.',
  },
  {
    q: 'How does the Yearly plan work?',
    a: "You're billed once per year at a 20% discount compared to monthly pricing. For Pro, that's $9.60/mo billed as $115.20/year.",
  },
  {
    q: 'Can I add team members on the Business plan?',
    a: 'Yes. Business plans include unlimited team members. Each member gets their own workspace with shared billing.',
  },
  {
    q: 'Do you offer discounts for nonprofits or students?',
    a: "Yes! We offer 50% off for verified nonprofits and full-time students. Contact us at support@havro.ai with proof of status.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const proMonthly = yearly ? '$9.60' : '$12';
  const bizMonthly = yearly ? '$31.20' : '$39';

  return (
    <main className="page-enter page-transition" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <section style={s.header}>
        <div style={s.container}>
          <h1 className="page-title" style={{ marginBottom: '8px', textAlign: 'center' }}>
            Simple, honest pricing.
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
            No hidden fees. Cancel anytime.
          </p>

          {/* Toggle */}
          <div style={s.toggleRow}>
            <span style={{ fontSize: '14px', color: yearly ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: yearly ? 400 : 600 }}>Monthly</span>
            <button
              style={s.togglePill}
              onClick={() => setYearly(y => !y)}
              aria-label="Toggle billing period"
            >
              <div style={{ ...s.toggleKnob, transform: yearly ? 'translateX(22px)' : 'translateX(2px)' }} />
            </button>
            <span style={{ fontSize: '14px', color: yearly ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: yearly ? 600 : 400 }}>
              Yearly
              <span style={{ marginLeft: '6px', padding: '2px 8px', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '11px', fontWeight: 600 }}>
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <div style={s.container}>
        <div className="pricing-row" style={s.pricingRow}>
          {/* Free */}
          <PricingCard
            tier="Free"
            price="$0/mo"
            subtitle="Perfect to get started"
            features={FREE_FEATURES}
            cta="Get Started Free"
            ctaVariant="ghost"
            featured={false}
          />

          {/* Pro */}
          <PricingCard
            tier="Pro"
            price={`${proMonthly}/mo`}
            priceSub={yearly ? `Billed $${(9.60 * 12).toFixed(0)}/year` : ''}
            subtitle="For power users"
            features={PRO_FEATURES}
            cta="Start Pro"
            ctaVariant="blue"
            featured={true}
            badge="Most Popular"
          />

          {/* Business */}
          <PricingCard
            tier="Business"
            price={`${bizMonthly}/mo`}
            priceSub={yearly ? `Billed $${(31.20 * 12).toFixed(0)}/year` : ''}
            subtitle="For teams and agencies"
            features={BUSINESS_FEATURES}
            cta="Contact Sales"
            ctaVariant="ghost"
            featured={false}
          />
        </div>

        {/* FAQ */}
        <section style={{ marginTop: '80px' }}>
          <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
            Frequently asked questions
          </h2>
          <div style={s.faqList}>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PricingCard({ tier, price, priceSub, subtitle, features, cta, ctaVariant, featured, badge }) {
  return (
    <div className="pricing-card" style={{
      ...s.card,
      border: featured ? '2px solid var(--accent)' : '1px solid var(--border)',
      boxShadow: featured ? '0 8px 32px rgba(0,196,140,0.2)' : 'none',
      transform: featured ? 'scale(1.02)' : 'scale(1)',
      position: 'relative',
    }}>
      {badge && (
        <div style={s.badge}>{badge}</div>
      )}

      <div style={{ padding: '32px 28px' }}>
        <p style={{ fontWeight: 700, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
          {tier}
        </p>
        <p style={{ fontWeight: 700, fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
          {price}
        </p>
        {priceSub && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{priceSub}</p>
        )}
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>{subtitle}</p>

        <button
          className={ctaVariant === 'blue' ? 'btn btn-blue' : 'btn btn-ghost'}
          style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '15px', marginBottom: '28px' }}
        >
          {cta}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={16} color="#16A34A" strokeWidth={2.5} style={{ marginTop: '1px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, open, onToggle }) {
  return (
    <div style={s.faqItem}>
      <button style={s.faqToggle} onClick={onToggle}>
        <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', textAlign: 'left', flex: 1 }}>
          {faq.q}
        </span>
        {open
          ? <ChevronUp size={18} color="var(--text-secondary)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
          : <ChevronDown size={18} color="var(--text-secondary)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
        }
      </button>
      <div className={`accordion-content${open ? ' open' : ''}`}>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: '12px', paddingBottom: '16px' }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

const s = {
  header: {
    padding: '64px 48px 48px',
    background: 'var(--bg-page)',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 48px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  togglePill: {
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    background: '#00C48C',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.18s ease',
  },
  toggleKnob: {
    position: 'absolute',
    top: '3px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#F8FAFC',
    transition: 'transform 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
  pricingRow: {
    display: 'flex',
    gap: '24px',
    marginTop: '40px',
    alignItems: 'center',
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: '20px',
    flex: 1,
    overflow: 'hidden',
  },
  badge: {
    textAlign: 'center',
    background: 'var(--accent-light)',
    color: 'var(--accent)',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 0',
    fontFamily: "'Inter', sans-serif",
  },
  faqList: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  faqItem: {
    borderBottom: '1px solid var(--border)',
  },
  faqToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    width: '100%',
    padding: '20px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    textAlign: 'left',
  },
};
