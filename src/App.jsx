import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import CareerPage from './pages/CareerPage.jsx';
import LifeAssistantPage from './pages/LifeAssistantPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isLifeAssistant = pathname === '/life-assistant';

  if (isLifeAssistant) {
    return (
      <Routes>
        <Route path="/life-assistant" element={<LifeAssistantPage />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/explore"   element={<ExplorePage />} />
          <Route path="/services"  element={<ServicesPage />} />
          <Route path="/pricing"   element={<PricingPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/career"    element={<CareerPage />} />
          <Route path="*"          element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
