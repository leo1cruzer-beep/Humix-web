import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="page-enter" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: '#F0F0ED', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 24px',
      }}>
        <Search size={32} color="#A3A3A3" strokeWidth={1.5} />
      </div>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.03em', color: '#1A1A1A', marginBottom: '12px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px' }}>
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn btn-blue" style={{ display: 'inline-flex', padding: '12px 28px', fontSize: '15px' }}>
        Back to Home
      </Link>
    </main>
  );
}
