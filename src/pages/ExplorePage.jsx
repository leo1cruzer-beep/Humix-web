import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ChevronUp, SlidersHorizontal,
  Zap, TrendingUp, MessageCircle, Heart, Users, Briefcase, Gem, Pencil,
  Star,
} from 'lucide-react';

const CATEGORIES = ['All', 'Automate', 'Finance', 'Companion', 'Life Assistant', 'Community', 'Career', 'Business', 'Creative'];

const TOOLS = [
  { id: 1,  category: 'Automate',       title: 'Workflow Automator',       desc: 'Connect apps and trigger AI actions without writing a single line of code.',       type: 'AI Tool',      path: '/explore?category=Automate' },
  { id: 2,  category: 'Automate',       title: 'Smart Scheduler',          desc: 'AI-powered calendar that learns your priorities and blocks time automatically.',    type: 'AI Tool',      path: '/explore?category=Automate' },
  { id: 3,  category: 'Finance',        title: 'Debt Repayment Planner',   desc: 'Enter your debts and get a custom payoff strategy based on your income.',          type: 'AI Tool',      path: '/finance/debt' },
  { id: 4,  category: 'Finance',        title: 'Budget Tracker Pro',       desc: 'Track spending, set goals, and get AI alerts before you overspend.',               type: 'Hybrid',       path: '/finance/budget' },
  { id: 5,  category: 'Finance',        title: 'Investment Advisor',       desc: 'Personalized investment suggestions based on your risk profile and goals.',         type: 'Human Expert', path: '/finance' },
  { id: 6,  category: 'Companion',      title: 'Memory AI',                desc: 'An AI that remembers your story, preferences, and goals across every conversation.', type: 'AI Tool',     path: '/life-assistant' },
  { id: 7,  category: 'Companion',      title: 'Language Partner',         desc: 'Practice any language with an AI conversation partner that adapts to your level.',  type: 'AI Tool',      path: '/life-assistant' },
  { id: 8,  category: 'Life Assistant', title: 'Crop Disease Identifier',  desc: 'Upload a photo of your plant and get instant diagnosis plus treatment advice.',     type: 'AI Tool',      path: '/life-assistant' },
  { id: 9,  category: 'Life Assistant', title: 'Legal Doc Simplifier',     desc: 'Paste any legal document and get a plain-English summary with key alerts.',         type: 'AI Tool',      path: '/life-assistant' },
  { id: 10, category: 'Life Assistant', title: 'Health Symptom Checker',   desc: 'Describe symptoms and get triage guidance, questions to ask your doctor.',          type: 'Hybrid',       path: '/life-assistant' },
  { id: 11, category: 'Community',      title: 'Group Finder',             desc: 'Discover communities that match your interests, location, and goals.',               type: 'AI Tool',      path: '/community' },
  { id: 12, category: 'Career',         title: 'Resume Builder',           desc: 'AI-crafted resumes tailored to specific job descriptions in seconds.',               type: 'AI Tool',      path: '/career/resume' },
  { id: 13, category: 'Career',         title: 'Interview Coach',          desc: 'Practice with an AI interviewer, get real-time feedback on your answers.',          type: 'AI Tool',      path: '/career/interview' },
  { id: 14, category: 'Business',       title: 'Business Plan Generator',  desc: 'Answer a few questions and get a full business plan with financial projections.',   type: 'AI Tool',      path: '/business/plan' },
  { id: 15, category: 'Business',       title: 'Market Research AI',       desc: 'Instant competitive analysis, customer insights, and market sizing.',                type: 'Hybrid',       path: '/business/market' },
  { id: 16, category: 'Creative',       title: 'AI Copywriter',            desc: 'Generate blog posts, ads, emails, and social content in your brand voice.',         type: 'AI Tool',      path: '/creative/content' },
  { id: 17, category: 'Creative',       title: 'Design Brief Generator',   desc: 'Turn a vague idea into a detailed creative brief ready for any designer.',          type: 'AI Tool',      path: '/creative/brand' },
  { id: 18, category: 'Creative',       title: 'Professional Ghostwriter',  desc: 'Work with a seasoned writer who brings your story or content to life.',             type: 'Human Expert', path: '/creative/content' },
];

const FILTER_TYPES = ['AI Tool', 'Human Expert', 'Hybrid'];
const FILTER_RATINGS = ['4.5+', '4.0+', '3.5+'];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [searchQ, setSearchQ] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTypes, setActiveTypes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [openFilters, setOpenFilters] = useState({ category: true, type: true, rating: false, price: false });

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const match = CATEGORIES.find(c => c.toLowerCase().replace(' ', '-') === cat || c.toLowerCase() === cat);
      if (match) setActiveCategory(match);
    }
  }, [searchParams]);

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchType = activeTypes.length === 0 || activeTypes.includes(t.type);
    const matchQ = !searchQ || t.title.toLowerCase().includes(searchQ.toLowerCase()) || t.desc.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchType && matchQ;
  });

  const visible = filtered.slice(0, visibleCount);

  const toggleType = (type) => {
    setActiveTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setVisibleCount(12);
  };

  const clearAll = () => {
    setActiveTypes([]);
    setActiveCategory('All');
    setSearchQ('');
    setVisibleCount(12);
  };

  const toggleFilter = (key) => setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div style={s.container}>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Explore Humix</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Browse all tools, services, and AI features
          </p>

          {/* Search bar */}
          <div style={s.searchWrap}>
            <Search size={18} color="#737373" strokeWidth={1.5} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search tools, services, experts..."
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); setVisibleCount(12); }}
              style={s.searchInput}
            />
          </div>

          {/* Category pills */}
          <div className="pills-scroll" style={{ marginTop: '16px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill${activeCategory === cat ? ' active' : ''}`}
                onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={s.container}>
        <div style={s.layout}>
          {/* Sidebar */}
          <aside className="explore-sidebar" style={s.sidebar}>
            <div style={s.sidebarHeader}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} color="#374151" strokeWidth={1.5} />
                Filters
              </span>
              <button onClick={clearAll} style={s.clearBtn}>Clear All</button>
            </div>

            <FilterSection label="Category" open={openFilters.category} onToggle={() => toggleFilter('category')}>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <label key={cat} style={s.filterLabel}>
                  <input
                    type="checkbox"
                    checked={activeCategory === cat}
                    onChange={() => { setActiveCategory(activeCategory === cat ? 'All' : cat); setVisibleCount(12); }}
                    style={s.checkbox}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{cat}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection label="Type" open={openFilters.type} onToggle={() => toggleFilter('type')}>
              {FILTER_TYPES.map(type => (
                <label key={type} style={s.filterLabel}>
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    style={s.checkbox}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{type}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection label="Rating" open={openFilters.rating} onToggle={() => toggleFilter('rating')}>
              {FILTER_RATINGS.map(r => (
                <label key={r} style={s.filterLabel}>
                  <input type="radio" name="rating" style={s.checkbox} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} color="#D97706" fill="#D97706" /> {r}
                  </span>
                </label>
              ))}
            </FilterSection>

            <FilterSection label="Price Range" open={openFilters.price} onToggle={() => toggleFilter('price')}>
              {['Free', 'Under $10/mo', '$10–$30/mo', '$30+/mo'].map(p => (
                <label key={p} style={s.filterLabel}>
                  <input type="checkbox" style={s.checkbox} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{p}</span>
                </label>
              ))}
            </FilterSection>
          </aside>

          {/* Results */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {visible.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Showing {visible.length} of {filtered.length} results
                </p>
                <div className="explore-grid" style={s.resultsGrid}>
                  {visible.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '12px 32px' }}
                      onClick={() => setVisibleCount(v => v + 12)}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterSection({ label, open, onToggle, children }) {
  return (
    <div style={s.filterSection}>
      <button style={s.filterToggle} onClick={onToggle}>
        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {open ? <ChevronUp size={16} color="var(--text-secondary)" strokeWidth={1.5} /> : <ChevronDown size={16} color="var(--text-secondary)" strokeWidth={1.5} />}
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();

  const handleTryFree = () => {
    navigate(tool.path);
  };

  return (
    <div
      onClick={handleTryFree}
      style={{
        ...s.toolCard,
        borderColor: hov ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)',
        boxShadow: hov ? '0 8px 32px rgba(99,102,241,0.18)' : 'none',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ marginBottom: '12px' }}>
        <span className="badge badge-blue" style={{ fontSize: '11px' }}>{tool.category}</span>
      </div>
      <h3 className="card-title" style={{ marginBottom: '8px' }}>{tool.title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>{tool.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>By Humix AI</span>
        <button
          onClick={handleTryFree}
          style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
        >
          Try Free →
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Search size={28} color="var(--text-muted)" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>Nothing here yet</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Try adjusting your filters or search query</p>
      <button className="btn btn-blue" style={{ padding: '10px 24px' }} onClick={onClear}>Clear Filters</button>
    </div>
  );
}

const s = {
  pageHeader: {
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    padding: '48px 0 32px',
    marginBottom: '40px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  searchWrap: {
    position: 'relative',
    maxWidth: '640px',
  },
  searchInput: {
    width: '100%',
    height: '48px',
    paddingLeft: '44px',
    paddingRight: '16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '15px',
    color: 'var(--text-primary)',
    background: 'var(--input-bg)',
    outline: 'none',
    transition: 'border-color 0.18s ease',
    fontFamily: "'Inter', sans-serif",
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '220px',
    flexShrink: 0,
    position: 'sticky',
    top: '80px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontFamily: "'Inter', sans-serif",
    padding: 0,
  },
  filterSection: {
    borderTop: '1px solid var(--border)',
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: "'Inter', sans-serif",
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#6366F1',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  toolCard: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
};
