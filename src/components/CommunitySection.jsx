import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const POSTS = [
  {
    initials: 'SA', user: 'sara.al_rashid', location: 'Qatar',
    service: 'Finance', serviceColor: '#34D399',
    text: 'Cleared QAR 200,000 in debt in 3 years. The debt plan feature gave me a roadmap I could actually follow, week by week.',
    likes: 891, comments: 156, time: '2 days ago',
    anim: 'card-float-1',
  },
  {
    initials: 'IK', user: 'imran.khurshid', location: 'Pakistan',
    service: 'Life Assistant', serviceColor: '#FB923C',
    text: 'Got my CNIC without paying a single middleman. The legal guide walked through every step — document by document.',
    likes: 1876, comments: 312, time: '5 days ago',
    anim: 'card-float-2',
  },
  {
    initials: 'TM', user: 'tunde.musa', location: 'Nigeria',
    service: 'Companion', serviceColor: '#A78BFA',
    text: 'Day 90. No alcohol. Companion reminded me of my own words from day 1 when I almost gave up on day 34.',
    likes: 1203, comments: 167, time: '1 week ago',
    anim: 'card-float-3',
  },
];

export default function CommunitySection() {
  const headRef  = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const targets = [headRef.current, cardsRef.current].filter(Boolean);
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={s.section}>
      {/* background glow */}
      <div style={s.bgGlow} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headRef} className="reveal" style={s.header}>
          <p style={s.eyebrow}>Community</p>
          <h2 style={s.headline}>
            Connect with people who<br />
            understand your journey.
          </h2>
          <p style={s.body}>
            Millions of members sharing success stories, answering questions,
            and helping each other — across 47 countries.
          </p>
          <div style={s.headerCTAs}>
            <Link to="/service/community" className="btn btn-white btn-lg">
              Join the conversation
            </Link>
            <div style={s.memberCount}>
              <div style={s.memberAvatars}>
                {['SA', 'IK', 'TM', 'RB'].map((i, idx) => (
                  <div key={idx} style={{ ...s.miniAvatar, marginLeft: idx > 0 ? -10 : 0, zIndex: 4 - idx }}>
                    {i}
                  </div>
                ))}
              </div>
              <span style={s.memberText}>15M+ members</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="reveal d2" style={s.cards}>
          {POSTS.map((post, i) => (
            <PostCard key={i} post={post} />
          ))}
        </div>

        {/* Stats strip */}
        <div style={s.statsStrip}>
          {[
            { label: 'Finance',        members: '2.3M', color: '#34D399' },
            { label: 'Life Assistant', members: '4.1M', color: '#FB923C' },
            { label: 'Companion',      members: '980K', color: '#A78BFA' },
            { label: 'Automate',       members: '1.8M', color: '#60A5FA' },
          ].map(({ label, members, color }) => (
            <div key={label} style={s.statItem}>
              <span style={{ ...s.statDot, background: color }} />
              <span style={s.statLabel}>{label}</span>
              <span style={s.statMembers}>{members}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }) {
  return (
    <div
      style={{
        ...s.card,
        animation: `${post.anim} 6s ease-in-out infinite`,
      }}
    >
      <div style={s.cardTop}>
        <div style={s.avatar}>{post.initials}</div>
        <div style={s.userInfo}>
          <span style={s.userName}>{post.user}</span>
          <span style={s.userLoc}>{post.location} · {post.time}</span>
        </div>
        <span style={{ ...s.serviceTag, color: post.serviceColor, background: post.serviceColor + '14', border: `1px solid ${post.serviceColor}25` }}>
          {post.service}
        </span>
      </div>
      <p style={s.cardText}>"{post.text}"</p>
      <div style={s.cardFooter}>
        <span style={s.reaction}>
          <HeartIcon /> {post.likes.toLocaleString()}
        </span>
        <span style={s.reaction}>
          <CommentIcon /> {post.comments}
        </span>
      </div>
    </div>
  );
}

function HeartIcon() {
  return <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M6.5 10.5S1 7.5 1 3.8C1 2.2 2.2 1 3.8 1c.9 0 1.7.4 2.2 1.1A2.8 2.8 0 016.5 1C7.1.4 7.9 1 8.5 1c1.6 0 2.8 1.2 2.8 2.8C11.3 7.5 6.5 10.5 6.5 10.5z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
}
function CommentIcon() {
  return <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M11.5 8c0 .6-.5 1-1 1H3.5L1 11V2c0-.6.4-1 1-1h9.5c.5 0 1 .4 1 1v6z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
}

const s = {
  section: {
    background: '#0F172A', padding: '120px 0', position: 'relative', overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
    width: 900, height: 600,
    background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
    pointerEvents: 'none', filter: 'blur(60px)',
  },
  header: { maxWidth: 580, marginBottom: 64 },
  eyebrow: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 },
  headline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1,
    letterSpacing: 'clamp(-1px, -0.028em, -2px)',
    color: '#fff', marginBottom: 20,
  },
  body: { fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 32 },
  headerCTAs: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  memberCount: { display: 'flex', alignItems: 'center', gap: 10 },
  memberAvatars: { display: 'flex', alignItems: 'center' },
  miniAvatar: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)', border: '2px solid #0F172A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
    position: 'relative',
  },
  memberText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  cards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20, marginBottom: 60,
  },
  card: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '20px',
    backdropFilter: 'blur(8px)',
    willChange: 'transform',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userLoc:  { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 },
  serviceTag: { fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, flexShrink: 0, letterSpacing: '0.02em' },
  cardText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 14 },
  cardFooter: { display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' },
  reaction: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  statsStrip: {
    display: 'flex', gap: 32, flexWrap: 'wrap',
    paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  statItem: { display: 'flex', alignItems: 'center', gap: 8 },
  statDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  statMembers: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 700 },
};
