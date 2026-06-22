import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homepageCategories } from '../data/services.js';

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.header}>
          <h2 style={styles.title}>Everything you need</h2>
          <p style={styles.subtitle}>
            Eight service areas. One account. Start with any of them — they all work together.
          </p>
        </div>
        <div style={styles.grid}>
          {homepageCategories.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() =>
                service.slug === 'life-assistant'
                  ? navigate('/life-assistant')
                  : navigate(`/service/${service.slug}`)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...styles.card,
        borderBottomColor: hovered ? 'var(--text-primary)' : 'var(--border)',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardInner}>
        <div style={styles.cardLeft}>
          <h3 style={styles.cardName}>{service.name}</h3>
          <p style={styles.cardDesc}>{service.cardDesc || service.description}</p>
        </div>
        <span
          style={{
            ...styles.arrow,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
          }}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </button>
  );
}

const styles = {
  section: {
    background: 'var(--bg-card)',
    padding: '96px 0 112px',
  },
  header: {
    marginBottom: 64,
  },
  title: {
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-1.5px',
    lineHeight: 1.1,
    marginBottom: 16,
    fontFamily: 'Inter, sans-serif',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: 480,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 0,
    borderTop: '1px solid var(--border)',
  },
  card: {
    background: 'var(--bg-card)',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    borderLeft: '1px solid transparent',
    borderRight: '1px solid transparent',
    borderTop: '1px solid transparent',
    padding: '36px 32px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'block',
    width: '100%',
    transition: 'box-shadow 0.2s, transform 0.2s, border-bottom-color 0.2s',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 0,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border)',
  },
  cardInner: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 80,
  },
  cardLeft: {
    flex: 1,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.4px',
    lineHeight: 1.2,
    marginBottom: 10,
    fontFamily: 'Inter, sans-serif',
  },
  cardDesc: {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    fontFamily: 'Inter, sans-serif',
  },
  arrow: {
    fontSize: 20,
    color: 'var(--text-primary)',
    flexShrink: 0,
    lineHeight: 1,
    transition: 'opacity 0.2s, transform 0.2s',
    display: 'block',
    marginBottom: 2,
  },
};
