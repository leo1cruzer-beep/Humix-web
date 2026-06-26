import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollManager from './components/ScrollManager.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Auth from './components/Auth.jsx';
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

function ProtectedRoute({ children, isVerified }) {
  if (!isVerified) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { search } = useLocation();
  const { isVerified, loading } = useIdentity();

  // Capture referral code from ?ref=CODE URL param
  useEffect(() => {
    const params = new URLSearchParams(search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem('humix_pending_referral', ref.toUpperCase());
  }, [search]);

  // Show nothing while checking session (avoids flash)
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={spinnerStyle} />
      </div>
    );
  }

  // Not logged in — show auth screen
  if (!isVerified) return <Auth />;

  const guard = (el) => (
    <ProtectedRoute isVerified={isVerified}>{el}</ProtectedRoute>
  );

  return (
    <>
      <ScrollManager />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
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
            <Route path="/life-assistant"      element={guard(<LifeAssistantPage />)} />
            <Route path="/profile"             element={guard(<IdentityProfile />)} />
            <Route path="*"                    element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

const spinnerStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '3px solid rgba(99,102,241,0.15)',
  borderTop: '3px solid #6366F1',
  animation: 'spin 0.8s linear infinite',
};
