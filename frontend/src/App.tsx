import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import { FarmLocationProvider } from './contexts/FarmLocationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';

// Canonical Authentication Module
import {
  AuthProvider,
  ProtectedRoute,
  LoginPage,
  RegisterPage,
  OnboardingPage,
} from './features/authentication';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { PublicLayout } from './layouts/PublicLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LanguageSelectionPage } from './pages/LanguageSelectionPage';

// Core Pages
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmsPage } from './pages/FarmsPage';
import { FarmDetailPage } from './pages/FarmDetailPage';
import { CropsPage } from './pages/CropsPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { PestMonitoringPage } from './pages/PestMonitoringPage';
import { WeatherPage } from './pages/WeatherPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Extended Ecosystem Modules
import { AgrinextAIPage } from './pages/AgrinextAIPage';
import { MandiPage } from './pages/MandiPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ExpertsPage } from './pages/ExpertsPage';
import { SchemesPage } from './pages/SchemesPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { FarmEconomicsPage } from './pages/FarmEconomicsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { ExpertDashboard } from './pages/ExpertDashboard';
import { ServiceProviderDashboard } from './pages/ServiceProviderDashboard';

// SIH 26131 Specialized Crop Health Modules
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { HotspotMapPage } from './pages/HotspotMapPage';
import { FollowUpMonitoringPage } from './pages/FollowUpMonitoringPage';
import { OfficialDashboardPage } from './pages/OfficialDashboardPage';

// Informational Platform Pages & Contact/Feedback
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WhyAgrinextPage } from './pages/WhyAgrinextPage';
import { ContactPage } from './pages/ContactPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { BrandLogoIntro } from './components/common/BrandLogoIntro';

export default function App() {
  const [showIntro, setShowIntro] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('agrinext_intro_seen') !== 'true';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('agrinext_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <FarmLocationProvider>
              <DataProvider>
                {showIntro && <BrandLogoIntro onComplete={handleIntroComplete} />}
                <BrowserRouter>
                  <Routes>
                    {/* 1. PUBLIC LANDING WEBSITE ROUTES (PUBLIC LAYOUT - NO LOGIN REQUIRED) */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      <Route path="/why-agrinext" element={<WhyAgrinextPage />} />
                      <Route path="/mandi-rates" element={<MandiPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/feedback" element={<FeedbackPage />} />
                      <Route path="/support" element={<ContactPage />} />
                    </Route>

                    {/* 0. LANGUAGE SELECTION ONBOARDING ROUTES */}
                    <Route path="/language-select" element={<LanguageSelectionPage />} />
                    <Route path="/language" element={<LanguageSelectionPage />} />
                    <Route path="/select-language" element={<LanguageSelectionPage />} />

                    {/* 2. AUTHENTICATION & ROLE SELECTION WEBPAGES */}
                    <Route path="/landing" element={<Navigate to="/" replace />} />
                    <Route path="/signin" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/sign-in" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/signup" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/sign-up" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/role-selection" element={<RoleSelectionPage />} />
                    <Route path="/login" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/login/:role" element={<LoginPage />} />
                    <Route path="/register" element={<Navigate to="/role-selection" replace />} />
                    <Route path="/register/:role" element={<RegisterPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />

                    {/* 2. PROTECTED FARMER WORKSPACE ROUTES (AUTHENTICATION REQUIRED) */}
                    <Route
                      element={
                        <ProtectedRoute allowedRoles={['farmer', 'admin', 'expert', 'buyer']}>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/farmer/dashboard" element={<FarmerDashboard onNavigate={() => {}} />} />
                      <Route path="/farmer/farms" element={<FarmsPage />} />
                      <Route path="/farmer/farms/:id" element={<FarmDetailPage />} />
                      <Route path="/farmer/crops" element={<CropsPage />} />
                      <Route path="/farmer/disease-detection" element={<DiseaseDetectionPage />} />
                      <Route path="/farmer/pest-monitoring" element={<PestMonitoringPage />} />
                      <Route path="/farmer/early-warning" element={<EarlyWarningPage />} />
                      <Route path="/farmer/hotspots" element={<HotspotMapPage />} />
                      <Route path="/farmer/follow-up" element={<FollowUpMonitoringPage />} />
                      <Route path="/farmer/official" element={<OfficialDashboardPage />} />
                      <Route path="/farmer/weather" element={<WeatherPage />} />
                      <Route path="/farmer/alerts" element={<AlertsPage />} />
                      <Route path="/farmer/ai" element={<AgrinextAIPage />} />
                      <Route path="/farmer/mandi" element={<MandiPage />} />
                      <Route path="/farmer/marketplace" element={<MarketplacePage />} />
                      <Route path="/farmer/experts" element={<ExpertsPage />} />
                      <Route path="/farmer/schemes" element={<SchemesPage />} />
                      <Route path="/farmer/equipment" element={<EquipmentPage />} />
                      <Route path="/farmer/economics" element={<FarmEconomicsPage />} />
                      <Route path="/farmer/profile" element={<ProfilePage />} />
                      <Route path="/farmer/settings" element={<SettingsPage />} />
                      <Route path="/farmer/contact" element={<ContactPage />} />
                      <Route path="/farmer/feedback" element={<FeedbackPage />} />
                      <Route path="/farmer/support" element={<ContactPage />} />

                      {/* Protected Farmer Aliases & SIH Direct Routes */}
                      <Route path="/dashboard" element={<FarmerDashboard onNavigate={() => {}} />} />
                      <Route path="/farms" element={<FarmsPage />} />
                      <Route path="/farms/:id" element={<FarmDetailPage />} />
                      <Route path="/my-farm" element={<FarmsPage />} />
                      <Route path="/crops" element={<CropsPage />} />
                      <Route path="/crop-cycle" element={<CropsPage />} />
                      <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
                      <Route path="/crop-scanner" element={<DiseaseDetectionPage />} />
                      <Route path="/crop_intel" element={<DiseaseDetectionPage />} />
                      <Route path="/pest-monitoring" element={<PestMonitoringPage />} />
                      <Route path="/early-warning" element={<EarlyWarningPage />} />
                      <Route path="/hotspots" element={<HotspotMapPage />} />
                      <Route path="/gis" element={<HotspotMapPage />} />
                      <Route path="/follow-up" element={<FollowUpMonitoringPage />} />
                      <Route path="/official" element={<OfficialDashboardPage />} />
                      <Route path="/official/dashboard" element={<OfficialDashboardPage />} />
                      <Route path="/weather" element={<WeatherPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/notifications" element={<AlertsPage />} />
                      <Route path="/ai" element={<AgrinextAIPage />} />
                      <Route path="/ai-assistant" element={<AgrinextAIPage />} />
                      <Route path="/assistant" element={<AgrinextAIPage />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="/market" element={<MarketplacePage />} />
                      <Route path="/experts" element={<ExpertsPage />} />
                      <Route path="/schemes" element={<SchemesPage />} />
                      <Route path="/equipment" element={<EquipmentPage />} />
                      <Route path="/economics" element={<FarmEconomicsPage />} />
                      <Route path="/farm-economics" element={<FarmEconomicsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>

                    {/* 3. PROTECTED AGRICULTURE EXPERT WORKSPACE ROUTES */}
                    <Route
                      element={
                        <ProtectedRoute allowedRoles={['expert', 'admin']}>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/expert/dashboard" element={<ExpertDashboard />} />
                      <Route path="/expert/consultations" element={<ExpertDashboard />} />
                      <Route path="/expert/disease-cases" element={<DiseaseDetectionPage />} />
                      <Route path="/expert/hotspots" element={<HotspotMapPage />} />
                      <Route path="/expert/early-warning" element={<EarlyWarningPage />} />
                      <Route path="/expert/profile" element={<ProfilePage />} />
                      <Route path="/expert/settings" element={<SettingsPage />} />
                      <Route path="/expert_dash" element={<ExpertDashboard />} />
                    </Route>

                    {/* 4. PROTECTED MARKET BUYER WORKSPACE ROUTES */}
                    <Route
                      element={
                        <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                      <Route path="/buyer/marketplace" element={<MarketplacePage />} />
                      <Route path="/buyer/mandi" element={<MandiPage />} />
                      <Route path="/buyer/profile" element={<ProfilePage />} />
                      <Route path="/buyer/settings" element={<SettingsPage />} />
                      <Route path="/buyer_dash" element={<BuyerDashboard />} />
                    </Route>

                    {/* 5. PROTECTED ADMIN & SERVICE PROVIDER ROUTES */}
                    <Route
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'equipment_owner']}>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/service_dash" element={<ServiceProviderDashboard />} />
                    </Route>

                    {/* Universal Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <LocationPickerModal />
                  <LanguageSelectorModal />
                </BrowserRouter>
              </DataProvider>
            </FarmLocationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
