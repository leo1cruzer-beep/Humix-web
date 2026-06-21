import { useState } from 'react';

const filters = ['Latest', 'Top', 'Unanswered', 'Success Stories'];

const typeColors = {
  'Success Story': '#059669',
  'Question': '#2563EB',
  'Resource': '#7C3AED',
  'Job/Gig': '#D97706',
  'Answer': '#0891B2',
};

export default function CommunityFeed({ serviceId, data }) {
  const [activeFilter, setActiveFilter] = useState('Latest');
  const [posts, setPosts] = useState(data.posts);
  const [joined, setJoined] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'Success Stories') return p.type === 'Success Story';
    if (activeFilter === 'Unanswered') return p.type === 'Question' && p.comments === 0;
    return true;
  }).sort((a, b) => {
    if (activeFilter === 'Top') return b.likes - a.likes;
    return 0;
  });

  return (
    <div style={styles.container}>
      {/* Community header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Community</h2>
          <p style={styles.meta}>
            <span style={styles.memberCount}>{data.memberCount} members</span>
            <span style={styles.dot}>·</span>
            <span style={styles.postCount}>{data.postCount} posts</span>
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.askBtn}
            onClick={() => setShowAskModal(true)}
          >
            + Ask a Question
          </button>
          <button
            style={joined ? styles.joinedBtn : styles.joinBtn}
            onClick={() => setJoined(!joined)}
          >
            {joined ? '✓ Joined' : 'Join Community'}
          </button>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Main feed */}
        <div style={styles.mainCol}>
          {/* Filters */}
          <div style={styles.filterRow}>
            {filters.map(f => (
              <button
                key={f}
                style={activeFilter === f ? styles.filterActive : styles.filterBtn}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div style={styles.posts}>
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h4 style={styles.sideTitle}>Top Contributors This Week</h4>
            <div style={styles.contributors}>
              {data.topContributors.map((c, i) => (
                <div key={i} style={styles.contributor}>
                  <div style={styles.rank}>{i + 1}</div>
                  <div style={styles.contributorAvatar}>{c.avatar}</div>
                  <div style={styles.contributorInfo}>
                    <div style={styles.contributorName}>{c.country} {c.username}</div>
                    <div style={styles.contributorBadge}>{c.badge}</div>
                  </div>
                  <div style={styles.contributorPosts}>{c.posts} posts</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.sideCard}>
            <h4 style={styles.sideTitle}>Post Types</h4>
            <div style={styles.postTypes}>
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} style={styles.postType}>
                  <span style={{ ...styles.typeDot, background: color }} />
                  <span style={styles.typeLabel}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Modal */}
      {showAskModal && (
        <AskModal onClose={() => setShowAskModal(false)} />
      )}
    </div>
  );
}

function PostCard({ post, onLike }) {
  const typeColor = typeColors[post.type] || '#6B7280';

  return (
    <div style={styles.postCard}>
      <div style={styles.postHeader}>
        <div style={styles.postAvatar}>{post.avatar}</div>
        <div style={styles.postMeta}>
          <span style={styles.postUsername}>{post.country} {post.username}</span>
          <span style={styles.postTime}>{post.time}</span>
        </div>
        <span style={{ ...styles.postType2, background: `${typeColor}15`, color: typeColor }}>
          {post.type}
        </span>
      </div>

      <h3 style={styles.postTitle}>{post.title}</h3>
      <p style={styles.postContent}>{post.content}</p>

      {post.image && (
        <div style={styles.postImageWrap}>
          <span style={styles.postImage}>{post.image}</span>
          <span style={styles.postImageLabel}>Photo attached</span>
        </div>
      )}

      <div style={styles.postActions}>
        <button
          style={post.liked ? { ...styles.actionBtn, ...styles.actionLiked } : styles.actionBtn}
          onClick={() => onLike(post.id)}
        >
          {post.liked ? '❤️' : '🤍'} {post.likes}
        </button>
        <button style={styles.actionBtn}>
          💬 {post.comments}
        </button>
        <button style={styles.actionBtn}>
          ↗ Share
        </button>
        <button style={styles.actionBtn}>
          🔖 Save
        </button>
      </div>
    </div>
  );
}

function AskModal({ onClose }) {
  const [question, setQuestion] = useState('');

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Ask the Community</h3>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <textarea
          placeholder="What do you want to know? Be specific — better questions get better answers."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={styles.modalTextarea}
          rows={5}
        />
        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.submitBtn} onClick={onClose}>Post Question</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  memberCount: { fontSize: 13, color: '#2563EB', fontWeight: 600 },
  dot: { color: '#D1D5DB' },
  postCount: { fontSize: 13, color: '#6B7280' },
  headerActions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  askBtn: {
    padding: '9px 16px',
    background: '#EFF6FF',
    color: '#2563EB',
    border: '1.5px solid #BFDBFE',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  joinBtn: {
    padding: '9px 18px',
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  joinedBtn: {
    padding: '9px 18px',
    background: '#D1FAE5',
    color: '#059669',
    border: '1.5px solid #A7F3D0',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: 24,
    alignItems: 'start',
  },
  mainCol: {},
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sideCard: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
    padding: 20,
  },
  sideTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#374151',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  contributors: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  contributor: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  rank: {
    fontSize: 12,
    fontWeight: 700,
    color: '#9CA3AF',
    width: 16,
    flexShrink: 0,
  },
  contributorAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#EFF6FF',
    color: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  contributorInfo: { flex: 1, minWidth: 0 },
  contributorName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#111827',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  contributorBadge: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  contributorPosts: { fontSize: 11, color: '#6B7280', flexShrink: 0, fontWeight: 500 },
  postTypes: { display: 'flex', flexDirection: 'column', gap: 8 },
  postType: { display: 'flex', alignItems: 'center', gap: 8 },
  typeDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  typeLabel: { fontSize: 13, color: '#374151' },
  filterRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '7px 16px',
    background: 'transparent',
    border: '1.5px solid #E5E7EB',
    borderRadius: 99,
    fontSize: 13,
    color: '#6B7280',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  filterActive: {
    padding: '7px 16px',
    background: '#2563EB',
    border: '1.5px solid #2563EB',
    borderRadius: 99,
    fontSize: 13,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },
  posts: { display: 'flex', flexDirection: 'column', gap: 16 },
  postCard: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#EFF6FF',
    color: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  postMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
    minWidth: 0,
  },
  postUsername: {
    fontSize: 13,
    fontWeight: 600,
    color: '#111827',
  },
  postTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  postType2: {
    padding: '3px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    flexShrink: 0,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 8,
    lineHeight: 1.4,
    letterSpacing: '-0.1px',
  },
  postContent: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 1.6,
    marginBottom: 12,
  },
  postImageWrap: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  postImage: { fontSize: 24 },
  postImageLabel: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  postActions: {
    display: 'flex',
    gap: 4,
    borderTop: '1px solid #F3F4F6',
    paddingTop: 12,
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    fontSize: 12,
    color: '#6B7280',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  actionLiked: {
    borderColor: '#FECACA',
    background: '#FEF2F2',
    color: '#DC2626',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
  },
  modalClose: {
    fontSize: 18,
    color: '#6B7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  modalTextarea: {
    width: '100%',
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 14,
    color: '#222',
    resize: 'vertical',
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.5,
    marginBottom: 16,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    color: '#374151',
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
};
