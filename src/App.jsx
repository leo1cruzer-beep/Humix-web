import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollManager from './components/ScrollManager.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PasskeyAuth from './components/PasskeyAuth.jsx';
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
import IdentityProfile from './pages/IdentityProfile.jsx';
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


function ProtectedRoute({ children, isVerified, openScan }) {
  useEffect(() => {
    if (!isVerified) openScan();
  }, [isVerified, openScan]);

  if (!isVerified) return <Navigate to="/" replace />;
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

  // helper to keep route definitions terse
  const guard = (el) => (
    <ProtectedRoute isVerified={isVerified} openScan={openScan}>{el}</ProtectedRoute>
  );

  if (pathname === '/life-assistant') {
    return (
      <>
        <ScrollManager />
        {scanOpen && (
          <PasskeyAuth onComplete={onScanComplete} onClose={closeScan} />
        )}
        <Routes>
          <Route path="/life-assistant" element={guard(<LifeAssistantPage />)} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollManager />
      {scanOpen && (
        <PasskeyAuth onComplete={onScanComplete} onClose={closeScan} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
        <Navbar onScanToEnter={openScan} isVerified={isVerified} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<HomePage onScanToEnter={openScan} />} />
            <Route path="/explore"        element={guard(<ExplorePage />)} />
            <Route path="/services"       element={guard(<ServicesPage />)} />
            <Route path="/pricing"        element={guard(<PricingPage />)} />
            <Route path="/community"      element={guard(<CommunityPage />)} />
            <Route path="/career"              element={guard(<CareerPage />)} />
            <Route path="/career/resume"       element={guard(<Resume />)} />
            <Route path="/career/cover-letter" element={guard(<CoverLetter />)} />
            <Route path="/career/interview"    element={guard(<InterviewPrep />)} />
            <Route path="/career/salary"       element={guard(<SalaryInsights />)} />
            <Route path="/finance"             element={guard(<FinancePage />)} />
            <Route path="/finance/:tool"       element={guard(<FinancePage />)} />
            <Route path="/business"            element={guard(<BusinessPage />)} />
            <Route path="/business/plan"       element={guard(<BusinessPlan />)} />
            <Route path="/business/pitch"      element={guard(<PitchDeck />)} />
            <Route path="/business/names"      element={guard(<NameGenerator />)} />
            <Route path="/business/market"     element={guard(<MarketResearch />)} />
            <Route path="/creative"            element={guard(<CreativePage />)} />
            <Route path="/creative/content"    element={guard(<ContentWriter />)} />
            <Route path="/creative/social"     element={guard(<SocialMediaPack />)} />
            <Route path="/creative/email"      element={guard(<EmailCampaign />)} />
            <Route path="/creative/brand"      element={guard(<BrandVoice />)} />
            <Route path="/profile"             element={guard(<IdentityProfile />)} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}
