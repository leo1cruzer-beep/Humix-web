const steps = [
  {
    number: '01',
    icon: '🎯',
    title: 'Choose your service',
    description: 'Browse 8 specialized service categories covering automation, finance, AI companionship, health, career, and more.',
  },
  {
    number: '02',
    icon: '⚡',
    title: 'Access powerful AI tools',
    description: 'Use professional-grade tools built for real-world problems — from debt elimination to crop disease diagnosis.',
  },
  {
    number: '03',
    icon: '🌍',
    title: 'Connect with your community',
    description: 'Join millions of members sharing knowledge, success stories, and support in every service category.',
  },
];

export default function HowItWorks() {
  return (
    <section style={styles.section} id="how-it-works">
      <div className="container">
        <div style={styles.header}>
          <h2 style={styles.title}>How Havro Works</h2>
          <p style={styles.subtitle}>Get started in minutes — no technical knowledge needed</p>
        </div>

        <div style={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{step.number}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>

        <div style={styles.cta}>
          <a href="/join" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
            Get Started Free
          </a>
          <a href="/explore" className="btn btn-outline btn-lg" style={{ display: 'inline-flex', marginLeft: 12 }}>
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 0',
    background: 'var(--bg-card)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 56,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    marginTop: 8,
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 32,
    maxWidth: 900,
    margin: '0 auto',
  },
  stepCard: {
    textAlign: 'center',
    padding: '32px 24px',
    position: 'relative',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: 800,
    color: '#2563EB',
    letterSpacing: '0.1em',
    marginBottom: 16,
  },
  stepIcon: {
    fontSize: 44,
    marginBottom: 16,
    lineHeight: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 10,
    letterSpacing: '-0.2px',
  },
  stepDesc: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  cta: {
    textAlign: 'center',
    marginTop: 52,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
};
