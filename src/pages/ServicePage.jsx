import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { services } from '../data/services.js';
import { communityData } from '../data/community.js';
import CommunityFeed from '../components/CommunityFeed.jsx';

const tabs = ['Overview', 'Features', 'Community', 'Resources'];

export default function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const service = services[slug];

  if (!service) {
    return (
      <div style={styles.notFound}>
        <h2>Service not found</h2>
        <p>The service "{slug}" doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const community = communityData[slug];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <div className="container" style={styles.breadcrumbInner}>
          <Link to="/" style={styles.breadLink}>Home</Link>
          <span style={styles.breadSep}>›</span>
          <Link to="/" style={styles.breadLink}>Services</Link>
          <span style={styles.breadSep}>›</span>
          <span style={styles.breadCurrent}>{service.name}</span>
        </div>
      </div>

      {/* Service Hero */}
      <div style={{ ...styles.serviceHero, borderBottom: `3px solid ${service.color}` }}>
        <div className="container">
          <div style={styles.heroBadge}>
            <span style={{ ...styles.taglineBadge, color: service.color, background: service.color + '12', border: `1px solid ${service.color}22` }}>
              {service.tagline}
            </span>
          </div>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
              <h1 style={styles.serviceName}>{service.name}</h1>
              <p style={styles.serviceDesc}>{service.description}</p>
              <div style={styles.heroMeta}>
                <span style={styles.metaItem}>{service.members} members</span>
                <span style={styles.metaDot}>·</span>
                <span style={styles.metaItem}>47 countries</span>
                <span style={styles.metaDot}>·</span>
                <span style={styles.metaItem}>Free to start</span>
              </div>
              <div style={styles.heroCTAs}>
                <button
                  style={{ ...styles.ctaBtn, background: service.color }}
                  onClick={() => navigate('/join')}
                >
                  Get started free
                </button>
                <button
                  style={styles.ctaBtnGhost}
                  onClick={() => navigate('/how-it-works')}
                >
                  Learn how it works
                </button>
              </div>
            </div>
            <div style={styles.heroRight}>
              <div style={{ ...styles.heroStatBlock, borderColor: service.color + '22', background: service.color + '06' }}>
                {[
                  { label: 'Members',   value: service.members },
                  { label: 'Countries', value: '47' },
                  { label: 'Rating',    value: '4.9 / 5' },
                ].map(st => (
                  <div key={st.label} style={styles.heroStat}>
                    <span style={{ ...styles.heroStatVal, color: service.color }}>{st.value}</span>
                    <span style={styles.heroStatLabel}>{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        <div className="container">
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab}
                style={activeTab === tab ? { ...styles.tab, ...styles.tabActive, borderBottomColor: service.color, color: service.color } : styles.tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        <div className="container">
          {activeTab === 'Overview' && <OverviewTab service={service} />}
          {activeTab === 'Features' && <FeaturesTab service={service} />}
          {activeTab === 'Community' && community && (
            <CommunityFeed serviceId={slug} data={community} />
          )}
          {activeTab === 'Resources' && <ResourcesTab service={service} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ service }) {
  const refs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    refs.current.filter(Boolean).forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={overviewStyles.container}>
      {/* Section header */}
      <div ref={el => refs.current[0] = el} className="reveal" style={overviewStyles.notionHeader}>
        <h2 style={overviewStyles.notionH2}>What you get with {service.name}</h2>
        <p style={overviewStyles.notionSub}>Professional-grade tools designed for real-world outcomes.</p>
      </div>

      {/* Feature grid */}
      <div style={overviewStyles.featGrid}>
        {service.features.map((f, i) => (
          <div
            key={i}
            ref={el => refs.current[i + 1] = el}
            className="reveal"
            style={{ ...overviewStyles.featCard, transitionDelay: `${i * 60}ms` }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = service.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 24px ${service.color}18`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ ...overviewStyles.featIcon, background: service.bgColor, color: service.color }}>
              {f.icon}
            </div>
            <h4 style={overviewStyles.featTitle}>{f.title}</h4>
            <p style={overviewStyles.featDesc}>{f.description}</p>
          </div>
        ))}
      </div>

      {/* Popular tags */}
      <div ref={el => refs.current[service.features.length + 1] = el} className="reveal" style={overviewStyles.tagsSection}>
        <h3 style={overviewStyles.tagsTitle}>Popular Topics</h3>
        <div style={overviewStyles.tags}>
          {service.popularTags.map(tag => (
            <span key={tag} style={{ ...overviewStyles.tag, background: service.bgColor, color: service.color, border: `1px solid ${service.color}20` }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div
        ref={el => refs.current[service.features.length + 2] = el}
        className="reveal"
        style={{ ...overviewStyles.quickStart, borderColor: service.color + '25', background: service.color + '06' }}
      >
        <div style={overviewStyles.quickContent}>
          <h3 style={overviewStyles.quickTitle}>Start using {service.name} today</h3>
          <p style={overviewStyles.quickDesc}>Join {service.members} members already using these tools. Free forever — no credit card required.</p>
        </div>
        <button style={{ ...overviewStyles.quickBtn, background: service.color }}>
          Get Started Free
        </button>
      </div>
    </div>
  );
}

function FeaturesTab({ service }) {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={overviewStyles.sectionTitle}>All {service.name} Features</h2>
        <p style={{ color: '#6B7280', marginTop: 8 }}>
          Professional-grade tools designed for real-world use.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {service.features.map((f, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1.5px solid #E5E7EB',
            borderRadius: 12,
            padding: 24,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = service.color;
              e.currentTarget.style.boxShadow = `0 4px 20px ${service.color}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{f.description}</p>
            <button style={{
              marginTop: 16,
              padding: '8px 16px',
              background: service.bgColor,
              color: service.color,
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              Try this →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesTab({ service }) {
  const resources = [
    { icon: '📖', title: `${service.name} Beginner Guide`, type: 'Guide', time: '5 min read' },
    { icon: '🎥', title: `Getting started with ${service.name}`, type: 'Video', time: '8 min' },
    { icon: '📊', title: `${service.name} best practices`, type: 'Article', time: '3 min read' },
    { icon: '❓', title: `${service.name} FAQ`, type: 'FAQ', time: '10 min read' },
    { icon: '🤝', title: `${service.name} community guide`, type: 'Community', time: '4 min read' },
    { icon: '⚡', title: `Advanced ${service.name} tips`, type: 'Advanced', time: '12 min read' },
  ];

  return (
    <div>
      <h2 style={{ ...overviewStyles.sectionTitle, marginBottom: 24 }}>Learning Resources</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {resources.map((r, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 10,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.background = service.bgColor; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
          >
            <span style={{ fontSize: 24 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{r.title}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                <span style={{ color: service.color, fontWeight: 600 }}>{r.type}</span>
                <span style={{ margin: '0 8px', color: '#D1D5DB' }}>·</span>
                {r.time}
              </div>
            </div>
            <span style={{ color: '#9CA3AF', fontSize: 18 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const overviewStyles = {
  container: { display: 'flex', flexDirection: 'column', gap: 56 },
  notionHeader: { borderBottom: '1px solid #F4F4F5', paddingBottom: 32 },
  notionH2: {
    fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700,
    color: '#0A0A0A', letterSpacing: '-0.6px', marginBottom: 8,
    fontFamily: 'Inter, sans-serif',
  },
  notionSub: { fontSize: 15, color: '#71717A', lineHeight: 1.6 },
  featGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  featCard: {
    background: '#fff',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12,
    padding: '22px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'border-color 0.18s, transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s',
    cursor: 'default',
  },
  featIcon: {
    width: 44, height: 44, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  featTitle: { fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.2px' },
  featDesc: { fontSize: 13, color: '#6B7280', lineHeight: 1.6 },
  tagsSection: {},
  tagsTitle: { fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 14 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: { padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500 },
  quickStart: {
    display: 'flex', alignItems: 'center', gap: 24,
    padding: '28px 32px', borderRadius: 14, border: '1.5px solid',
    flexWrap: 'wrap',
  },
  quickContent: { flex: 1, minWidth: 200 },
  quickTitle: { fontSize: 17, fontWeight: 700, color: '#0A0A0A', marginBottom: 6, letterSpacing: '-0.3px' },
  quickDesc: { fontSize: 14, color: '#6B7280', lineHeight: 1.6 },
  quickBtn: {
    padding: '12px 24px', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0,
    transition: 'opacity 0.15s',
  },
};

const styles = {
  notFound: { padding: 60, textAlign: 'center', color: '#374151' },
  breadcrumb: { background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 0' },
  breadcrumbInner: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 },
  breadLink: { color: '#6B7280' },
  breadSep: { color: '#9CA3AF' },
  breadCurrent: { color: '#111827', fontWeight: 600 },
  serviceHero: {
    padding: '52px 0 44px',
    background: '#fff',
  },
  heroBadge: { marginBottom: 20 },
  taglineBadge: {
    display: 'inline-block', fontSize: 11, fontWeight: 700,
    padding: '4px 12px', borderRadius: 99,
    textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  heroInner: {
    display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap',
  },
  heroLeft: { flex: '2', minWidth: 280 },
  serviceName: {
    fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
    color: '#0A0A0A', letterSpacing: '-1.2px', lineHeight: 1.08, marginBottom: 14,
    fontFamily: 'Inter, sans-serif',
  },
  serviceDesc: { fontSize: 16, color: '#4B5563', lineHeight: 1.65, maxWidth: 520, marginBottom: 20 },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 },
  metaItem: { fontSize: 13, color: '#71717A', fontWeight: 500 },
  metaDot: { color: '#D1D5DB' },
  heroCTAs: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  ctaBtn: {
    padding: '12px 22px', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'opacity 0.15s',
  },
  ctaBtnGhost: {
    padding: '12px 22px', color: '#374151',
    border: '1.5px solid #E4E4E7', background: '#fff',
    borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.15s',
  },
  heroRight: { flex: '1', minWidth: 220 },
  heroStatBlock: {
    border: '1.5px solid', borderRadius: 12, padding: '20px 24px',
    display: 'flex', flexDirection: 'column', gap: 18,
  },
  heroStat: { display: 'flex', flexDirection: 'column', gap: 2 },
  heroStatVal: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 },
  heroStatLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: 500 },
  tabBar: {
    borderBottom: '1px solid #E5E7EB',
    background: '#fff',
    position: 'sticky',
    top: 68,
    zIndex: 50,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  tab: {
    padding: '14px 20px',
    fontSize: 14,
    fontWeight: 500,
    color: '#6B7280',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
  },
  tabActive: {
    fontWeight: 600,
  },
  content: {
    padding: '40px 0 80px',
  },
};
