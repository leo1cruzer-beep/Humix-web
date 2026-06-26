import { useEffect, useState, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollManager from './components/ScrollManager.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PasskeyAuth from './components/PasskeyAuth.jsx';
import SignupModal from './components/SignupModal.jsx';
import SupportChat from './components/SupportChat.jsx';
import EmailGateModal from './components/EmailGateModal.jsx';
import { useEmailGate } from './hooks/useEmailGate.jsx';
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
import MicroTasks from './screens/business/MicroTasks.jsx';
import Freelance from './screens/business/Freelance.jsx';
import MarketPrices from './screens/business/MarketPrices.jsx';
import RemittanceJobs from './screens/business/RemittanceJobs.jsx';
import ContentWriter from './screens/creative/ContentWriter.jsx';
import SocialMediaPack from './screens/creative/SocialMediaPack.jsx';
import EmailCampaign from './screens/creative/EmailCampaign.jsx';
import BrandVoice from './screens/creative/BrandVoice.jsx';
import AgentRegisterPage from './pages/agent/AgentRegisterPage.jsx';
import AgentDashboardPage from './pages/agent/AgentDashboardPage.jsx';
import AgentLeaderboardPage from './pages/agent/AgentLeaderboardPage.jsx';

// Allows up to 2 guest tool accesses; prompts signup on the 3rd attempt.
function ProtectedRoute({ children, isVerified, guestUses, onGuestAccess, openSignup }) {
  const didRun = useRef(false);

  useEffect(() => {
    if (isVerified || didRun.current) return;
    didRun.current = true;
    if (guestUses < 2) {
      onGuestAccess();
    } else {
      openSignup();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isVerified) return children;
  if (guestUses < 2) return children;
  return <Navigate to="/" replace />;
}

export default function App() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { isVerified, guestUses, incrementGuestUse } = useIdentity();
  const { gateOpen, setGateOpen } = useEmailGate();
  const [scanOpen, setScanOpen]     = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem('havro_pending_referral', ref.toUpperCase());
  }, [search]);

  // Auto-close signup modal when auth completes
  useEffect(() => {
    if (isVerified) setSignupOpen(false);
  }, [isVerified]);

  const openScan  = useCallback(() => setScanOpen(true),  []);
  const closeScan = useCallback(() => setScanOpen(false), []);
  const onScanComplete = useCallback(() => {
    setScanOpen(false);
    navigate('/');
  }, [navigate]);

  const openSignup  = useCallback(() => setSignupOpen(true),  []);
  const closeSignup = useCallback(() => setSignupOpen(false), []);

  // SignupModal "Use Face ID" → close signup, open passkey
  const handleSignupFaceId = useCallback(() => {
    setSignupOpen(false);
    setScanOpen(true);
  }, []);

  const guard = (el) => (
    <ProtectedRoute
      isVerified={isVerified}
      guestUses={guestUses}
      onGuestAccess={incrementGuestUse}
      openSignup={openSignup}
    >
      {el}
    </ProtectedRoute>
  );

  if (pathname === '/life-assistant') {
    return (
      <>
        <ScrollManager />
        {scanOpen && <PasskeyAuth onComplete={onScanComplete} onClose={closeScan} />}
        <SignupModal isOpen={signupOpen} onClose={closeSignup} onFaceId={handleSignupFaceId} />
        <Routes>
          <Route path="/life-assistant" element={guard(<LifeAssistantPage />)} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollManager />
      {scanOpen && <PasskeyAuth onComplete={onScanComplete} onClose={closeScan} />}
      <SignupModal isOpen={signupOpen} onClose={closeSignup} onFaceId={handleSignupFaceId} />
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
            <Route path="/business"                   element={guard(<BusinessPage />)} />
            <Route path="/business/plan"              element={guard(<BusinessPlan />)} />
            <Route path="/business/pitch"             element={guard(<PitchDeck />)} />
            <Route path="/business/names"             element={guard(<NameGenerator />)} />
            <Route path="/business/market"            element={guard(<MarketResearch />)} />
            <Route path="/business/microtasks"        element={guard(<MicroTasks />)} />
            <Route path="/business/freelance"         element={guard(<Freelance />)} />
            <Route path="/business/market-prices"     element={guard(<MarketPrices />)} />
            <Route path="/business/remittance-jobs"   element={guard(<RemittanceJobs />)} />
            <Route path="/agent/register"    element={<AgentRegisterPage />} />
            <Route path="/agent/dashboard"   element={<AgentDashboardPage />} />
            <Route path="/agent/leaderboard" element={<AgentLeaderboardPage />} />
            <Route path="/agent"             element={<Navigate to="/agent/register" replace />} />
            <Route path="/creative"            element={guard(<CreativePage />)} />
            <Route path="/creative/content"    element={guard(<ContentWriter />)} />
            <Route path="/creative/social"     element={guard(<SocialMediaPack />)} />
            <Route path="/creative/email"      element={guard(<EmailCampaign />)} />
            <Route path="/creative/brand"      element={guard(<BrandVoice />)} />
            <Route path="/profile"             element={guard(<IdentityProfile />)} />
            <Route path="*"                    element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <SupportChat />
      <EmailGateModal isOpen={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}
