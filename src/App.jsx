import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import CareerPage from './pages/CareerPage.jsx';
import LifeAssistantPage from './pages/LifeAssistantPage.jsx';
import FinancePage from './pages/FinancePage.jsx';
import BusinessPage from './pages/BusinessPage.jsx';
import CreativePage from './pages/CreativePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const scrollCache = new Map();

function ScrollRestorer() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevRef = useRef(pathname);

  useEffect(() => {
    const onScroll = () => scrollCache.set(prevRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollCache.set(prevRef.current, window.scrollY);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    prevRef.current = pathname;
    if (navType === 'POP') {
      const pos = scrollCache.get(pathname);
      if (pos != null) requestAnimationFrame(() => window.scrollTo(0, pos));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  if (pathname === '/life-assistant') {
    return (
      <>
        <ScrollRestorer />
        <Routes>
          <Route path="/life-assistant" element={<LifeAssistantPage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollRestorer />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/explore"        element={<ExplorePage />} />
            <Route path="/services"       element={<ServicesPage />} />
            <Route path="/pricing"        element={<PricingPage />} />
            <Route path="/community"      element={<CommunityPage />} />
            <Route path="/career"           element={<CareerPage />} />
            <Route path="/career/:tool"   element={<CareerPage />} />
            <Route path="/finance"        element={<FinancePage />} />
            <Route path="/finance/:tool"  element={<FinancePage />} />
            <Route path="/business"       element={<BusinessPage />} />
            <Route path="/business/:tool" element={<BusinessPage />} />
            <Route path="/creative"       element={<CreativePage />} />
            <Route path="/creative/:tool" element={<CreativePage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}
