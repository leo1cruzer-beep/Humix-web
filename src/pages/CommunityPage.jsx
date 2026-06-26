import { useState } from 'react';
import {
  Briefcase, Users, Sprout, GraduationCap,
  Heart, TrendingUp, Pencil, Cpu,
  MessageSquare, Clock, ArrowRight,
} from 'lucide-react';

const COMMUNITY_CATS = [
  { id: 'entrepreneurs', label: 'Entrepreneurs',  Icon: Briefcase,      members: '2.4K' },
  { id: 'freelancers',   label: 'Freelancers',    Icon: Users,           members: '3.1K' },
  { id: 'farmers',       label: 'Farmers',        Icon: Sprout,          members: '1.8K' },
  { id: 'students',      label: 'Students',       Icon: GraduationCap,   members: '4.7K' },
  { id: 'health',        label: 'Health',         Icon: Heart,           members: '2.2K' },
  { id: 'finance',       label: 'Finance',        Icon: TrendingUp,      members: '1.9K' },
  { id: 'creatives',     label: 'Creatives',      Icon: Pencil,          members: '3.4K' },
  { id: 'tech',          label: 'Tech',           Icon: Cpu,             members: '5.2K' },
];

const DISCUSSIONS = [
  { id: 1, title: 'How I paid off $18K in debt using Humix Finance tools in 14 months', category: 'Finance', author: 'Maria G.', time: '2h ago', replies: 34 },
  { id: 2, title: 'Best AI prompts for growing your freelance client base in 2026', category: 'Freelancers', time: '4h ago', author: 'Ahmed K.', replies: 21 },
  { id: 3, title: 'Crop rotation advice for smallholder farms in East Africa', category: 'Farmers', time: '6h ago', author: 'Joseph M.', replies: 15 },
  { id: 4, title: 'Anyone else using Companion AI for mental health journaling?', category: 'Health', time: '8h ago', author: 'Priya S.', replies: 47 },
  { id: 5, title: 'Landing a remote tech job with no degree — my full story', category: 'Tech', time: '12h ago', author: 'David L.', replies: 89 },
  { id: 6, title: 'How we used Humix Business tools to launch our startup in 30 days', category: 'Entrepreneurs', time: '1d ago', author: 'Linda T.', replies: 62 },
  { id: 7, title: 'Study group for IELTS prep — join us every Tuesday', category: 'Students', time: '1d ago', author: 'Chen W.', replies: 28 },
  { id: 8, title: 'Building a portfolio with AI-assisted design tools — tips and tricks', category: 'Creatives', time: '2d ago', author: 'Sofia R.', replies: 33 },
];

const TRENDING_TOPICS = [
  '#AIForFarming',
  '#DebtFreeJourney',
  '#RemoteWork2026',
  '#StartupLife',
  '#LanguageLearning',
];

const CATEGORY_COLORS = {
  Finance: '#16A34A', Freelancers: '#6366F1', Farmers: '#D97706',
  Health: '#DC2626', Tech: '#7C3AED', Entrepreneurs: '#6366F1',
  Students: '#0891B2', Creatives: '#DB2777',
};

export default function CommunityPage() {
  const [joined, setJoined] = useState({});
  const [hovPost, setHovPost] = useState(null);

  const toggleJoin = (id) => setJoined(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="page-enter page-transition" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <section style={s.header}>
        <div style={s.container}>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Connect with people like you</h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Forums, groups, and live discussions across every interest
          </p>
          <button className="btn btn-blue" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Join Community
          </button>
        </div>
      </section>

      <div style={s.container}>
        {/* Community Categories Grid */}
        <section style={{ paddingTop: '64px', marginBottom: '64px' }}>
          <h2 className="section-heading" style={{ marginBottom: '24px' }}>Browse Communities</h2>
          <div className="community-grid" style={s.catGrid}>
            {COMMUNITY_CATS.map(({ id, label, Icon, members }) => (
              <CatCard
                key={id}
                id={id}
                label={label}
                Icon={Icon}
                members={members}
                joined={joined[id]}
                onJoin={() => toggleJoin(id)}
              />
            ))}
          </div>
        </section>

        {/* Discussions + Trending */}
        <section>
          <h2 className="section-heading" style={{ marginBottom: '24px' }}>Recent Discussions</h2>
          <div className="discussion-layout" style={s.discussionLayout}>
            {/* Posts */}
            <div style={{ flex: '0 0 70%', minWidth: 0 }}>
              {DISCUSSIONS.map(post => (
                <PostRow
                  key={post.id}
                  post={post}
                  hov={hovPost === post.id}
                  onHover={() => setHovPost(post.id)}
                  onLeave={() => setHovPost(null)}
                />
              ))}
            </div>

            {/* Trending sidebar */}
            <aside className="trending-sidebar" style={s.sidebar}>
              <div style={s.trendingBox}>
                <h3 style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Trending Topics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {TRENDING_TOPICS.map(tag => (
                    <span
                      key={tag}
                      className="badge badge-blue"
                      style={{ cursor: 'pointer', alignSelf: 'flex-start', fontSize: '13px', padding: '4px 12px' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Quick stats
                  </h3>
                  {[
                    { label: 'Active members', value: '24.7K' },
                    { label: 'Posts today', value: '312' },
                    { label: 'Communities', value: '8' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function CatCard({ id, label, Icon, members, joined, onJoin }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        ...s.catCard,
        borderColor: hov ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)',
        boxShadow: hov ? '0 8px 32px rgba(99,102,241,0.15)' : 'none',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.iconBox}>
        <Icon size={22} color="var(--text-secondary)" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', margin: '14px 0 4px' }}>{label}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>{members} members</p>
      <button
        className={joined ? 'btn btn-ghost' : 'btn btn-blue'}
        style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '13px' }}
        onClick={onJoin}
      >
        {joined ? 'Joined ✓' : 'Join'}
      </button>
    </div>
  );
}

function PostRow({ post, hov, onHover, onLeave }) {
  const color = CATEGORY_COLORS[post.category] || '#6366F1';
  return (
    <div
      style={{
        ...s.postRow,
        background: hov ? 'var(--icon-bg)' : 'transparent',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span
            style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', background: color + '18', color }}
          >
            {post.category}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{post.author}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} color="var(--text-muted)" strokeWidth={1.5} /> {post.time}
          </span>
        </div>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: hov ? 'var(--accent)' : 'var(--text-primary)',
            lineHeight: 1.45,
            transition: 'color 0.18s ease',
            cursor: 'pointer',
          }}
        >
          {post.title}
        </h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
        <MessageSquare size={14} color="var(--text-muted)" strokeWidth={1.5} />
        {post.replies}
      </div>
    </div>
  );
}

const s = {
  header: {
    background: 'var(--bg-page)',
    borderBottom: '1px solid var(--border)',
    padding: '64px 48px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 48px',
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  catCard: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.18s ease',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'var(--icon-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discussionLayout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  postRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px',
    borderRadius: '8px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  sidebar: {
    width: '30%',
    flexShrink: 0,
    position: 'sticky',
    top: '80px',
  },
  trendingBox: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
  },
};
