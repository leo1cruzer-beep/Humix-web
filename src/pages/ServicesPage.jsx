import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';

const SERVICE_TABS = ['All', 'Writing', 'Design', 'Finance', 'Legal', 'Health', 'Tech', 'Agriculture'];

const SERVICES = [
  {
    id: 1, category: 'Writing',
    provider: 'Sarah K.', initial: 'S', rating: 4.9, reviews: 312,
    title: 'Professional blog posts and SEO articles crafted in your brand voice',
    tags: ['AI-Assisted', 'Fast Delivery'],
    price: '$25',
  },
  {
    id: 2, category: 'Design',
    provider: 'Marcus L.', initial: 'M', rating: 4.8, reviews: 201,
    title: 'Custom logo and brand identity design with unlimited revisions',
    tags: ['Human Expert', '3-Day Delivery'],
    price: '$80',
  },
  {
    id: 3, category: 'Finance',
    provider: 'Aisha R.', initial: 'A', rating: 5.0, reviews: 89,
    title: 'Personalized debt repayment plan and investment strategy review',
    tags: ['Certified Advisor', 'AI-Assisted'],
    price: '$45',
  },
  {
    id: 4, category: 'Legal',
    provider: 'James T.', initial: 'J', rating: 4.7, reviews: 156,
    title: 'Contract review and plain-English summary with risk flags highlighted',
    tags: ['Licensed Attorney', 'Fast Delivery'],
    price: '$60',
  },
  {
    id: 5, category: 'Tech',
    provider: 'Priya S.', initial: 'P', rating: 4.9, reviews: 445,
    title: 'Full-stack web app built with React and Node.js in 7 days',
    tags: ['AI-Assisted', 'Verified Expert'],
    price: '$200',
  },
  {
    id: 6, category: 'Health',
    provider: 'Dr. Amara N.', initial: 'A', rating: 4.8, reviews: 278,
    title: 'Nutrition plan and wellness coaching tailored to your goals and lifestyle',
    tags: ['Certified Nutritionist', 'Ongoing Support'],
    price: '$55',
  },
  {
    id: 7, category: 'Agriculture',
    provider: 'Kofi M.', initial: 'K', rating: 4.6, reviews: 94,
    title: 'AI-powered crop disease diagnosis and treatment recommendations',
    tags: ['AI-Assisted', 'Same Day'],
    price: '$15',
  },
  {
    id: 8, category: 'Writing',
    provider: 'Elena V.', initial: 'E', rating: 4.9, reviews: 367,
    title: 'Resume and LinkedIn profile rewrite optimized for your target role',
    tags: ['Career Expert', 'AI-Assisted'],
    price: '$40',
  },
  {
    id: 9, category: 'Design',
    provider: 'Omar F.', initial: 'O', rating: 4.7, reviews: 183,
    title: 'UI/UX wireframes and interactive prototype for your mobile app',
    tags: ['Figma Expert', 'Fast Delivery'],
    price: '$120',
  },
];

const TOP_EXPERTS = [
  { name: 'Sarah K.',     specialty: 'Content Writing',  rating: 4.9, initial: 'S' },
  { name: 'Marcus L.',    specialty: 'Brand Design',      rating: 4.8, initial: 'M' },
  { name: 'Dr. Amara N.', specialty: 'Health & Wellness', rating: 4.8, initial: 'A' },
  { name: 'Priya S.',     specialty: 'Web Development',   rating: 4.9, initial: 'P' },
  { name: 'James T.',     specialty: 'Legal Review',      rating: 4.7, initial: 'J' },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQ, setSearchQ] = useState('');

  const filtered = SERVICES.filter(s => {
    const matchTab = activeTab === 'All' || s.category === activeTab;
    const matchQ = !searchQ || s.title.toLowerCase().includes(searchQ.toLowerCase());
    return matchTab && matchQ;
  });

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <section style={s.heroBanner}>
        <div style={s.heroInner}>
          <h1 style={s.heroHeadline}>Hire experts. Get things done.</h1>
          <p style={s.heroSub}>Browse human + AI services across every category.</p>
          <div style={s.heroSearch}>
            <input
              type="text"
              placeholder="What service are you looking for?"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={s.darkInput}
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div style={s.tabStrip}>
        <div style={s.tabInner}>
          <div className="pills-scroll" style={{ borderBottom: 'none', gap: '0' }}>
            {SERVICE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...s.tab,
                  color: activeTab === tab ? '#1B4FD8' : '#737373',
                  borderBottom: activeTab === tab ? '2px solid #1B4FD8' : '2px solid transparent',
                  fontWeight: activeTab === tab ? 600 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={s.container}>
        {/* Service Cards Grid */}
        <div className="service-grid" style={s.serviceGrid}>
          {filtered.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#1A1A1A', marginBottom: '8px' }}>No services found</h3>
            <p style={{ color: '#737373' }}>Try a different category or search term</p>
          </div>
        )}

        {/* Featured Experts Strip */}
        <section style={{ marginTop: '64px' }}>
          <h2 className="section-heading" style={{ marginBottom: '24px' }}>Top-Rated Experts This Week</h2>
          <div style={s.expertsStrip}>
            {TOP_EXPERTS.map(expert => <ExpertCard key={expert.name} expert={expert} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

function ServiceCard({ svc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...s.card,
        boxShadow: hov ? '0 4px 16px rgba(27,79,216,0.10)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image placeholder */}
      <div style={s.cardImg} />

      <div style={s.cardBody}>
        {/* Provider row */}
        <div style={s.providerRow}>
          <div style={s.avatar}>{svc.initial}</div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{svc.provider}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Star size={12} fill="#D97706" color="#D97706" />
              <span style={{ fontSize: '12px', color: '#737373' }}>{svc.rating} ({svc.reviews})</span>
            </div>
          </div>
        </div>

        <h3 style={s.cardTitle}>{svc.title}</h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
          {svc.tags.map(tag => (
            <span key={tag} className="badge badge-blue" style={{ fontSize: '11px' }}>{tag}</span>
          ))}
        </div>

        {/* Price row */}
        <div style={s.priceRow}>
          <span style={{ fontSize: '13px', color: '#737373' }}>Starting at</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#1A1A1A' }}>{svc.price}</span>
        </div>

        <button
          style={{
            ...s.viewBtn,
            background: hov ? '#1B4FD8' : 'transparent',
            color: hov ? '#FFFFFF' : '#1A1A1A',
            borderColor: hov ? '#1B4FD8' : '#E8E8E4',
          }}
        >
          View Service
        </button>
      </div>
    </div>
  );
}

function ExpertCard({ expert }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...s.expertCard,
        borderColor: hov ? '#1B4FD8' : '#E8E8E4',
        boxShadow: hov ? '0 4px 16px rgba(27,79,216,0.10)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.expertAvatar}>{expert.initial}</div>
      <p style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A1A', marginTop: '12px' }}>{expert.name}</p>
      <p style={{ fontSize: '12px', color: '#737373', marginTop: '2px' }}>{expert.specialty}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', justifyContent: 'center' }}>
        <Star size={12} fill="#D97706" color="#D97706" />
        <span style={{ fontSize: '12px', color: '#737373' }}>{expert.rating}</span>
      </div>
      <button
        className="btn btn-blue"
        style={{ marginTop: '12px', padding: '6px 16px', fontSize: '13px', width: '100%', justifyContent: 'center' }}
      >
        Hire
      </button>
    </div>
  );
}

const s = {
  heroBanner: {
    background: '#1A1A1A',
    padding: '64px 48px',
  },
  heroInner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heroHeadline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '40px',
    letterSpacing: '-0.04em',
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  heroSub: {
    fontSize: '17px',
    color: '#A3A3A3',
    marginBottom: '28px',
  },
  heroSearch: {
    maxWidth: '520px',
  },
  darkInput: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    background: '#2A2A2A',
    border: '1px solid #3A3A3A',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
  },
  tabStrip: {
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: '64px',
    zIndex: 50,
  },
  tabInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
    overflowX: 'auto',
    display: 'flex',
  },
  tab: {
    padding: '16px 20px',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
    transition: 'all 0.18s ease',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 48px 0',
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.18s ease',
  },
  cardImg: {
    height: '160px',
    background: 'var(--icon-bg)',
    borderRadius: '16px 16px 0 0',
  },
  cardBody: {
    padding: '16px',
  },
  providerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#1B4FD8',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '15px',
    color: 'var(--text-primary)',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: '12px',
    marginBottom: '12px',
  },
  viewBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1.5px solid',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  expertsStrip: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  expertCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '20px 24px',
    textAlign: 'center',
    minWidth: '160px',
    flexShrink: 0,
    transition: 'all 0.18s ease',
    cursor: 'pointer',
  },
  expertAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#1B4FD8',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 700,
    margin: '0 auto',
  },
};
