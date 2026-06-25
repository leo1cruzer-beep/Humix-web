import { useEffect, useRef, useState, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigationType, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import FaceScan from './components/FaceScan.jsx';
import { useIdentity } from './hooks/useIdentity.jsx';
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
import Resume from './screens/career/Resume.jsx';
import CoverLetter from './screens/career/CoverLetter.jsx';
import InterviewPrep from './screens/career/InterviewPrep.jsx';
import SalaryInsights from './screens/career/SalaryInsights.jsx';
import BusinessPlan from './screens/business/BusinessPlan.jsx';
import PitchDeck from './screens/business/PitchDeck.jsx';
import NameGenerator from './screens/business/NameGenerator.jsx';
import MarketResearch from './screens/business/MarketResearch.jsx';
import ContentWriter from './screens/creative/ContentWriter.jsx';
import SocialMediaPack from './screens/creative/SocialMediaPack.jsx';
import EmailCampaign from './screens/creative/EmailCampaign.jsx';
import BrandVoice from './screens/creative/BrandVoice.jsx';

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

function ProtectedRoute({ children, isVerified, openScan }) {
  useEffect(() => {
    if (!isVerified) openScan();
  }, [isVerified, openScan]);

  if (!isVerified) return null;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isVerified } = useIdentity();
  const [scanOpen, setScanOpen] = useState(false);

  const openScan  = useCallback(() => setScanOpen(true),  []);
  const closeScan = useCallback(() => setScanOpen(false), []);
  const onScanComplete = useCallback(() => {
    setScanOpen(false);
    navigate('/');
  }, [navigate]);

  if (pathname === '/life-assistant') {
    return (
      <>
        <ScrollRestorer />
        {scanOpen && (
          <FaceScan onComplete={onScanComplete} onClose={closeScan} />
        )}
        <Routes>
          <Route path="/life-assistant" element={<LifeAssistantPage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollRestorer />
      {scanOpen && (
        <FaceScan onComplete={onScanComplete} onClose={closeScan} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
        <Navbar onScanToEnter={openScan} isVerified={isVerified} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<HomePage onScanToEnter={openScan} />} />
            <Route path="/explore"        element={<ExplorePage />} />
            <Route path="/services"       element={<ServicesPage />} />
            <Route path="/pricing"        element={<PricingPage />} />
            <Route path="/community"      element={<CommunityPage />} />
            <Route path="/career"              element={<CareerPage />} />
            <Route path="/career/resume"       element={<Resume />} />
            <Route path="/career/cover-letter" element={<CoverLetter />} />
            <Route path="/career/interview"    element={<InterviewPrep />} />
            <Route path="/career/salary"       element={<SalaryInsights />} />
            <Route path="/finance"             element={<FinancePage />} />
            <Route path="/finance/:tool"       element={<FinancePage />} />
            <Route path="/business"            element={<BusinessPage />} />
            <Route path="/business/plan"       element={<BusinessPlan />} />
            <Route path="/business/pitch"      element={<PitchDeck />} />
            <Route path="/business/names"      element={<NameGenerator />} />
            <Route path="/business/market"     element={<MarketResearch />} />
            <Route path="/creative"            element={<CreativePage />} />
            <Route path="/creative/content"    element={<ContentWriter />} />
            <Route path="/creative/social"     element={<SocialMediaPack />} />
            <Route path="/creative/email"      element={<EmailCampaign />} />
            <Route path="/creative/brand"      element={<BrandVoice />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}
