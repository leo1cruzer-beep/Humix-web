import { useState } from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase, Users } from 'lucide-react';

const JOBS = [
  {
    id: 1, title: 'Senior Frontend Engineer', company: 'TechFlow Inc.', initial: 'T',
    location: 'Remote', type: 'Full-time', pay: '$90K–$130K/yr',
    tags: ['Remote', 'Full-time', 'AI-Assisted Matching'],
  },
  {
    id: 2, title: 'Freelance Content Writer', company: 'ContentHub', initial: 'C',
    location: 'Remote', type: 'Contract', pay: '$35–$60/hr',
    tags: ['Remote', 'Contract', 'AI-Assisted Matching'],
  },
  {
    id: 3, title: 'Agricultural Business Consultant', company: 'FarmWise', initial: 'F',
    location: 'Nairobi, Kenya', type: 'On-site', pay: '$40K–$55K/yr',
    tags: ['On-site', 'Full-time'],
  },
  {
    id: 4, title: 'UX Designer', company: 'DesignForge', initial: 'D',
    location: 'Hybrid', type: 'Full-time', pay: '$70K–$100K/yr',
    tags: ['Hybrid', 'Full-time', 'AI-Assisted Matching'],
  },
  {
    id: 5, title: 'Financial Advisor (Remote)', company: 'WealthPath', initial: 'W',
    location: 'Remote', type: 'Part-time', pay: '$50–$80/hr',
    tags: ['Remote', 'Part-time'],
  },
  {
    id: 6, title: 'AI Trainer & Data Annotator', company: 'Humix AI', initial: 'H',
    location: 'Remote', type: 'Contract', pay: '$20–$30/hr',
    tags: ['Remote', 'Contract', 'AI-Assisted Matching'],
  },
];

const JOB_TYPES = ['Remote', 'On-site', 'Hybrid'];
const CATEGORIES = ['All', 'Tech', 'Design', 'Writing', 'Finance', 'Agriculture', 'AI'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];

export default function CareerPage() {
  const [activeView, setActiveView] = useState('find');
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [formData, setFormData] = useState({ role: '', category: '', desc: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleType = (t) => setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const filteredJobs = JOBS.filter(j => {
    const matchType = activeTypes.length === 0 || activeTypes.some(t => j.tags.includes(t));
    const matchCat = activeCategory === 'All' || j.tags.some(tag => tag === activeCategory);
    return matchType && matchCat;
  });

  return (
    <main className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <section style={s.header}>
        <div style={s.container}>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Find work or hire globally</h1>
          <p style={{ fontSize: '17px', color: '#737373', marginBottom: '32px' }}>
            AI-matched opportunities. Real results.
          </p>

          {/* View toggle */}
          <div style={s.viewToggle}>
            <button
              onClick={() => setActiveView('find')}
              style={{
                ...s.toggleBtn,
                background: activeView === 'find' ? '#1A1A1A' : 'transparent',
                color: activeView === 'find' ? '#FFFFFF' : '#737373',
                border: activeView === 'find' ? '1px solid #1A1A1A' : '1px solid #E8E8E4',
              }}
            >
              <Briefcase size={16} strokeWidth={1.5} /> Find Work
            </button>
            <button
              onClick={() => setActiveView('hire')}
              style={{
                ...s.toggleBtn,
                background: activeView === 'hire' ? '#1A1A1A' : 'transparent',
                color: activeView === 'hire' ? '#FFFFFF' : '#737373',
                border: activeView === 'hire' ? '1px solid #1A1A1A' : '1px solid #E8E8E4',
              }}
            >
              <Users size={16} strokeWidth={1.5} /> Hire Talent
            </button>
          </div>
        </div>
      </section>

      <div style={s.container}>
        {activeView === 'find' ? (
          <FindWorkView
            jobs={filteredJobs}
            activeTypes={activeTypes}
            onToggleType={toggleType}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        ) : (
          <HireTalentView
            formData={formData}
            onChange={setFormData}
            submitted={submitted}
            onSubmit={() => setSubmitted(true)}
          />
        )}
      </div>
    </main>
  );
}

function FindWorkView({ jobs, activeTypes, onToggleType, activeCategory, onCategoryChange }) {
  return (
    <div style={{ paddingTop: '40px' }}>
      {/* Filters */}
      <div className="career-filters" style={s.filters}>
        <div>
          <p style={s.filterLabel}>Job Type</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {JOB_TYPES.map(t => (
              <button
                key={t}
                className={`filter-pill${activeTypes.includes(t) ? ' active' : ''}`}
                onClick={() => onToggleType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={s.filterLabel}>Category</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-pill${activeCategory === c ? ' active' : ''}`}
                onClick={() => onCategoryChange(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={s.filterLabel}>Experience Level</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EXP_LEVELS.map(e => (
              <button key={e} className="filter-pill">{e}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p style={{ fontSize: '14px', color: '#737373', marginBottom: '16px' }}>
          {jobs.length} opportunities found
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
        {jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>No jobs match your filters</h3>
            <p style={{ color: '#737373' }}>Try removing some filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...s.jobCard,
        borderColor: hov ? '#1B4FD8' : '#E8E8E4',
        boxShadow: hov ? '0 4px 16px rgba(27,79,216,0.10)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={s.companyLogo}>{job.initial}</div>
        <div style={{ flex: 1 }}>
          <h3 className="card-title" style={{ marginBottom: '4px' }}>{job.title}</h3>
          <p style={{ fontSize: '14px', color: '#737373', marginBottom: '10px' }}>{job.company}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={s.metaChip}>
              <MapPin size={12} strokeWidth={1.5} /> {job.location}
            </span>
            <span style={s.metaChip}>
              <Clock size={12} strokeWidth={1.5} /> {job.type}
            </span>
            <span style={s.metaChip}>
              <DollarSign size={12} strokeWidth={1.5} /> {job.pay}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            {job.tags.map(tag => (
              <span key={tag} className="badge badge-blue" style={{ fontSize: '11px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <button
          style={{
            ...s.applyBtn,
            background: hov ? '#1B4FD8' : 'transparent',
            color: hov ? '#FFFFFF' : '#1A1A1A',
            borderColor: hov ? '#1B4FD8' : '#E8E8E4',
          }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

function HireTalentView({ formData, onChange, submitted, onSubmit }) {
  const update = (key) => (e) => onChange(prev => ({ ...prev, [key]: e.target.value }));

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ fontSize: '28px' }}>✓</span>
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '22px', color: '#1A1A1A', marginBottom: '8px' }}>Job posted!</h3>
        <p style={{ color: '#737373', marginBottom: '24px' }}>We'll match you with verified professionals within 24 hours.</p>
        <button className="btn btn-ghost" onClick={() => {}}>Post Another Job</button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '40px', maxWidth: '600px' }}>
      <div style={s.formCard}>
        <h2 style={{ fontWeight: 600, fontSize: '20px', color: '#1A1A1A', marginBottom: '24px' }}>Post a Job</h2>

        <div style={s.field}>
          <label style={s.fieldLabel}>Role Title</label>
          <input
            type="text"
            placeholder="e.g. React Developer, Content Writer..."
            value={formData.role}
            onChange={update('role')}
            style={s.input}
            onFocus={e => { e.target.style.borderColor = '#1B4FD8'; }}
            onBlur={e => { e.target.style.borderColor = '#E8E8E4'; }}
          />
        </div>

        <div style={s.field}>
          <label style={s.fieldLabel}>Category</label>
          <select
            value={formData.category}
            onChange={update('category')}
            style={{ ...s.input, cursor: 'pointer' }}
          >
            <option value="">Select a category</option>
            {['Tech', 'Design', 'Writing', 'Finance', 'Legal', 'Health', 'Agriculture', 'Business'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={s.field}>
          <label style={s.fieldLabel}>Description</label>
          <textarea
            placeholder="Describe the role, skills needed, and expected outcomes..."
            value={formData.desc}
            onChange={update('desc')}
            rows={4}
            style={{ ...s.input, resize: 'vertical', paddingTop: '12px', lineHeight: 1.6 }}
            onFocus={e => { e.target.style.borderColor = '#1B4FD8'; }}
            onBlur={e => { e.target.style.borderColor = '#E8E8E4'; }}
          />
        </div>

        <div style={s.field}>
          <label style={s.fieldLabel}>Budget Range</label>
          <input
            type="text"
            placeholder="e.g. $500–$1,000 or $25/hr"
            value={formData.budget}
            onChange={update('budget')}
            style={s.input}
            onFocus={e => { e.target.style.borderColor = '#1B4FD8'; }}
            onBlur={e => { e.target.style.borderColor = '#E8E8E4'; }}
          />
        </div>

        <button
          className="btn btn-blue"
          style={{ width: '100%', justifyContent: 'center', padding: '13px 16px', fontSize: '15px', marginTop: '8px' }}
          onClick={onSubmit}
        >
          Post Job
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#737373' }}>
        Or{' '}
        <a href="#" style={{ color: '#1B4FD8', fontWeight: 600, textDecoration: 'none' }}>
          browse 2,400+ verified professionals →
        </a>
      </p>
    </div>
  );
}

const s = {
  header: {
    background: '#F7F7F5',
    borderBottom: '1px solid #E8E8E4',
    padding: '64px 48px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    background: '#F0F0ED',
    borderRadius: '10px',
    padding: '4px',
    width: 'fit-content',
  },
  toggleBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.18s ease',
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: '#FFFFFF',
    border: '1px solid #E8E8E4',
    borderRadius: '16px',
    padding: '24px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
    fontFamily: "'Inter', sans-serif",
  },
  jobCard: {
    background: '#FFFFFF',
    border: '1px solid #E8E8E4',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    transition: 'all 0.18s ease',
    flexWrap: 'wrap',
  },
  companyLogo: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: '#EEF2FF',
    color: '#1B4FD8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Inter', sans-serif",
  },
  metaChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#737373',
  },
  applyBtn: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: '1.5px solid',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
  },
  formCard: {
    background: '#FFFFFF',
    border: '1px solid #E8E8E4',
    borderRadius: '16px',
    padding: '32px',
  },
  field: {
    marginBottom: '20px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '8px',
    fontFamily: "'Inter', sans-serif",
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #E8E8E4',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1A1A1A',
    fontFamily: "'Inter', sans-serif",
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.18s ease',
  },
};
